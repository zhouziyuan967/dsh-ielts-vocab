/**
 * Host half of the IELTS vocabulary bundle.
 *
 * Serves the study JSON API used by the Web UI, registers the `ielts_vocab`
 * agent tool, and optionally asks the configured model for a mnemonic.
 */
import { createStore, defaultStatePath, StoreError, WORD_BY_ID, WORDS } from './store.js'

const API_PREFIX = '/ielts-vocab/api'
const AI_TIMEOUT_MS = 45000
const MAX_BODY_BYTES = 64 * 1024

const store = createStore(defaultStatePath())

function sendJson(response, status, value) {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.setHeader('cache-control', 'no-store')
  response.end(JSON.stringify(value))
}

function sendError(response, error) {
  if (error instanceof StoreError) {
    sendJson(response, error.status, { error: error.code, message: error.message })
    return
  }
  console.error('[ielts-vocab] request failed:', error)
  sendJson(response, 500, { error: 'internal-error', message: 'The study server failed to complete the request.' })
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    const fail = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }
    request.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        fail(new StoreError('Request body is too large.', 413, 'body-too-large'))
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => {
      if (settled) return
      settled = true
      if (chunks.length === 0) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new StoreError('Request body must be valid JSON.', 400, 'invalid-json'))
      }
    })
    request.on('error', fail)
  })
}

function isLoopbackAuthority(authority) {
  const value = String(authority || '').toLowerCase().replace(/:\d+$/, '').replace(/^\[/, '').replace(/\]$/, '')
  if (!value) return false
  if (value === 'localhost' || value === '::1') return true
  if (value.endsWith('.localhost')) return true
  const parts = value.split('.')
  return parts.length === 4 && parts[0] === '127' && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

function authorize(request, response, context) {
  const deny = (status) => {
    response.statusCode = status
    response.end()
    return false
  }
  const headers = request.headers || {}
  const site = String(headers['sec-fetch-site'] || '').toLowerCase()
  if (site === 'cross-site') return deny(403)
  const origin = headers.origin
  if (typeof origin === 'string' && origin && origin !== 'null') {
    try {
      if (new URL(origin).host.toLowerCase() !== String(headers.host || '').toLowerCase()) return deny(403)
    } catch {
      return deny(403)
    }
  }
  const connection = context.get('connection')
  if (connection && typeof connection.requestRejection === 'function') {
    let code
    try {
      code = connection.requestRejection(request)
    } catch {
      return deny(403)
    }
    if (code) return deny(typeof code === 'number' ? code : 403)
    return true
  }
  if (!isLoopbackAuthority(headers.host)) return deny(403)
  return true
}

function formatPlan(state) {
  const lines = []
  const novel = state.plan.filter((entry) => entry.isNew).length
  lines.push(`今日计划：${state.plan.length} 个单词（新词 ${novel}，待复习 ${state.plan.length - novel}）`)
  for (const entry of state.plan.slice(0, 20)) {
    const tag = entry.isNew ? '新' : '复'
    lines.push(`- [${tag}] ${entry.word} ${entry.phonetic} ${entry.pos} ${entry.cn}${entry.note ? '（已有记忆法）' : ''}`)
  }
  if (state.plan.length > 20) lines.push(`……还有 ${state.plan.length - 20} 个`)
  const stats = state.stats
  lines.push(`进度：已学 ${stats.learned}/${stats.total}，掌握 ${stats.mastered}，今日复习 ${stats.reviewsToday} 次，连续 ${stats.streak} 天`)
  return lines.join('\n')
}

function describeWord(word, state) {
  const note = state ? state.plan.find((entry) => entry.id === word.id)?.note || '' : ''
  return [
    `${word.word} ${word.phonetic} ${word.pos}`,
    `中文：${word.cn}`,
    `英文：${word.en}`,
    `例句：${word.example}`,
    `译文：${word.exampleCn}`,
    note ? `记忆法：${note}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

async function generateNote(context, entry, force) {
  const existing = store.findNote(entry.id)
  if (existing && !force) return existing
  const llm = context.get('llm')
  const defaultModel = context.get('agentDefaultModel')
  if (!llm || !defaultModel) {
    throw new StoreError('AI model service is unavailable in this profile.', 503, 'ai-unavailable')
  }
  let selection
  try {
    selection = defaultModel.currentSelection()
  } catch {
    throw new StoreError('The default model is not configured.', 503, 'ai-unavailable')
  }
  if (!selection || !selection.provider || !selection.model) {
    throw new StoreError('The default model is not configured.', 503, 'ai-unavailable')
  }
  const prompt = [
    'You are an IELTS vocabulary coach writing for a Chinese learner.',
    `Word: ${entry.word} ${entry.phonetic} (${entry.pos})`,
    `Meaning: ${entry.cn}; ${entry.en}`,
    'Write exactly two lines in Chinese, no extra commentary:',
    '记忆法：一句 20-40 字的准确联想或词根记忆，不要编造错误词源。',
    '例句：一个雅思写作或口语风格的英文句子，不超过 20 词。',
  ].join('\n')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)
  try {
    const prepared = await llm.prepareCall({
      provider: selection.provider,
      model: selection.model,
      reasoningEffort: 'off',
      maxTokens: 600,
    }).catch(() =>
      llm.prepareCall({ provider: selection.provider, model: selection.model, maxTokens: 1200 }),
    )
    const options = {
      ...prepared.config,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
      signal: controller.signal,
    }
    let text = ''
    const chunkTypes = []
    for await (const chunk of prepared.stream(options)) {
      if (chunk.type) chunkTypes.push(chunk.type)
      if (chunk.type === 'text-delta') text += chunk.text
      if (chunk.type === 'finish' && chunk.reason && chunk.reason.kind === 'error') {
        throw new Error(chunk.reason.failure?.message || 'The model returned an error.')
      }
    }
    const note = text.trim().replace(/^记忆法\s*[:：]\s*/u, '')
    if (!note) throw new Error(`The model returned no content (${chunkTypes.join(',') || 'no chunks'}).`)
    return note
  } catch (error) {
    if (controller.signal.aborted) {
      throw new StoreError('AI generation timed out.', 504, 'ai-timeout')
    }
    throw new StoreError(`AI generation failed: ${error?.message || error}`, 502, 'ai-failed')
  } finally {
    clearTimeout(timer)
  }
}

export function apply(root) {
  if (typeof root?.inject !== 'function') return

  root.inject(['webServer'], (context) => {
    const route = (path, handler) => {
      context.effect(
        () =>
          context.webServer.register({
            kind: 'exact',
            path: `${API_PREFIX}${path}`,
            handler: async (request, response) => {
              if (!authorize(request, response, context)) return
              try {
                await handler(request, response)
              } catch (error) {
                sendError(response, error)
              }
            },
          }),
        `ielts-vocab: route ${path}`,
      )
    }

    route('/health', async (request, response) => {
      sendJson(response, 200, {
        ok: true,
        words: WORDS.length,
        ai: Boolean(context.get('llm') && context.get('agentDefaultModel')),
      })
    })

    route('/state', async (request, response) => {
      sendJson(response, 200, store.buildState())
    })

    route('/review', async (request, response) => {
      const body = await readJson(request)
      sendJson(response, 200, store.review(body.id, body.grade))
    })

    route('/settings', async (request, response) => {
      const body = await readJson(request)
      sendJson(response, 200, store.updateSettings(body))
    })

    route('/quiz', async (request, response) => {
      const body = await readJson(request)
      sendJson(response, 200, store.quiz(body.count))
    })

    route('/note', async (request, response) => {
      const body = await readJson(request)
      sendJson(response, 200, store.saveNote(body.id, body.note))
    })

    route('/ai-note', async (request, response) => {
      const body = await readJson(request)
      const word = WORD_BY_ID.get(String(body.id || ''))
      if (!word) throw new StoreError('Unknown word id.', 404, 'unknown-word')
      const note = await generateNote(context, word, Boolean(body.refresh))
      const state = store.saveNote(word.id, note)
      sendJson(response, 200, { ...state, note })
    })

    route('/reset', async (request, response) => {
      sendJson(response, 200, store.reset())
    })
  })

  root.inject(['tools'], (context) => {
    context.effect(
      () =>
        context.tools.register({
          name: 'ielts_vocab',
          description:
            'IELTS vocabulary coach backed by the local study store. Use for daily plans, word details, recording review grades, multiple-choice quizzes, progress stats, and saving AI-generated mnemonics or example sentences. Grades: 0 = forgot, 1 = fuzzy, 2 = known, 3 = easy. When the user asks for an AI mnemonic or example, you may write it yourself and save it with the note action, or use the ai action to have the configured model generate and save it.',
          parameters: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['today', 'word', 'review', 'quiz', 'note', 'ai', 'stats'],
                description: 'Operation to perform.',
              },
              word: { type: 'string', description: 'Target word spelling, for word/review/note/ai.' },
              grade: { type: 'integer', minimum: 0, maximum: 3, description: 'Review grade for the review action.' },
              count: { type: 'integer', minimum: 1, maximum: 20, description: 'Number of quiz questions.' },
              note: { type: 'string', description: 'Mnemonic or example text to save for the note action.' },
              refresh: { type: 'boolean', description: 'For ai: regenerate even when a note already exists.' },
            },
            required: ['action'],
            additionalProperties: false,
          },
          output: {
            schema: {
              type: 'object',
              properties: { ok: { type: 'boolean' }, text: { type: 'string' } },
              required: ['ok', 'text'],
              additionalProperties: false,
            },
            render: (args, value) => [{ type: 'text', text: String(value?.text || '') }],
          },
          async execute(args) {
            const action = String(args?.action || '')
            try {
              if (action === 'today' || action === 'stats') {
                const state = store.buildState()
                return { ok: true, text: formatPlan(state) }
              }
              if (action === 'word') {
                const word = WORD_BY_ID.get(String(args?.word || '').trim().toLowerCase())
                if (!word) return { ok: false, text: `未找到单词：${args?.word || ''}` }
                const state = store.buildState()
                const entry = state.plan.find((item) => item.id === word.id)
                const note = store.findNote(word.id)
                const text = describeWord({ ...word, note: entry?.note || note }, state)
                return { ok: true, text }
              }
              if (action === 'review') {
                const word = WORD_BY_ID.get(String(args?.word || '').trim().toLowerCase())
                if (!word) return { ok: false, text: `未找到单词：${args?.word || ''}` }
                if (!Number.isInteger(args?.grade)) return { ok: false, text: 'grade 必须是 0-3 的整数。' }
                const state = store.review(word.id, args.grade)
                return { ok: true, text: `已记录 ${word.word}（${args.grade}）。\n${formatPlan(state)}` }
              }
              if (action === 'quiz') {
                const { questions } = store.quiz(args?.count)
                const lines = questions.map((question, index) => {
                  const options = question.options.map((option, position) => `${String.fromCharCode(65 + position)}. ${option}`)
                  return `第 ${index + 1} 题：${question.word} ${question.phonetic}\n${options.join('\n')}\n答案：${String.fromCharCode(65 + question.answer)}`
                })
                return {
                  ok: true,
                  text: `共 ${questions.length} 题。先依次提问，用户作答后再核对答案，不要提前展示。\n\n${lines.join('\n\n')}`,
                }
              }
              if (action === 'ai') {
                const word = WORD_BY_ID.get(String(args?.word || '').trim().toLowerCase())
                if (!word) return { ok: false, text: `未找到单词：${args?.word || ''}` }
                const note = await generateNote(context, word, Boolean(args.refresh))
                store.saveNote(word.id, note)
                return { ok: true, text: `已为 ${word.word} 生成并保存记忆法：\n${note}` }
              }
              if (action === 'note') {
                const word = WORD_BY_ID.get(String(args?.word || '').trim().toLowerCase())
                if (!word) return { ok: false, text: `未找到单词：${args?.word || ''}` }
                if (typeof args?.note !== 'string' || !args.note.trim()) {
                  return { ok: false, text: 'note 不能为空。' }
                }
                const state = store.saveNote(word.id, args.note)
                const stored = state.plan.find((entry) => entry.id === word.id)?.note
                return { ok: true, text: `已保存 ${word.word} 的记忆法/例句。${stored ? `\n${stored}` : ''}` }
              }
              return { ok: false, text: `未知操作：${action}` }
            } catch (error) {
              return { ok: false, text: `操作失败：${error?.message || error}` }
            }
          },
        }),
      'ielts-vocab: agent tool',
    )
  })
}
