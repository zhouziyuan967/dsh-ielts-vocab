/**
 * IELTS vocabulary study engine.
 *
 * Pure-ish store: reads and writes one JSON file, keeps a per-day plan,
 * schedules reviews with a compact SM-2 variant, and serves quiz questions.
 * The Host HTTP routes and the `ielts_vocab` agent tool share this store.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { WORDS as RAW_WORDS } from './words.js'

/** The bank stores the spelling in `id`; expose it as `word` for display. */
export const WORDS = RAW_WORDS.map((word) => ({ ...word, word: word.word || word.id }))

export const WORD_BY_ID = new Map(WORDS.map((word) => [word.id, word]))

const DAY_MS = 24 * 60 * 60 * 1000
const AGAIN_MS = 10 * 60 * 1000
const MAX_PLAN = 60
const DATA_VERSION = 1

export class StoreError extends Error {
  constructor(message, status = 400, code = 'bad-request') {
    super(message)
    this.name = 'StoreError'
    this.status = status
    this.code = code
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function shiftDayKey(key, delta) {
  const [year, month, day] = key.split('-').map(Number)
  return dayKey(new Date(year, month - 1, day + delta))
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function clampSetting(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return clamp(Math.round(number), min, max)
}

/** Keep a saved pill position as two finite pixel values; anything else means "default". */
function normalizePill(value) {
  if (!value || typeof value !== 'object') return null
  const x = Number(value.x)
  const y = Number(value.y)
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null
  return { x: Math.round(clamp(x, 0, 20000)), y: Math.round(clamp(y, 0, 20000)) }
}

function emptyState() {
  return {
    version: DATA_VERSION,
    settings: { dailyTarget: 20, ambient: true, pill: null },
    daily: { date: '', newIds: [] },
    progress: {},
    notes: {},
    days: {},
    createdAt: new Date().toISOString(),
  }
}

function normalizeState(raw) {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {}
  const daily = raw.daily && typeof raw.daily === 'object' ? raw.daily : {}
  const progress = raw.progress && typeof raw.progress === 'object' ? raw.progress : {}
  const notes = raw.notes && typeof raw.notes === 'object' ? raw.notes : {}
  const days = raw.days && typeof raw.days === 'object' ? raw.days : {}
  return {
    version: DATA_VERSION,
    settings: {
      dailyTarget: clampSetting(settings.dailyTarget, 5, 60, 20),
      ambient: settings.ambient !== false,
      pill: normalizePill(settings.pill),
    },
    daily: {
      date: typeof daily.date === 'string' ? daily.date : '',
      newIds: Array.isArray(daily.newIds) ? daily.newIds.filter((id) => WORD_BY_ID.has(id)) : [],
    },
    progress: Object.fromEntries(
      Object.entries(progress).filter(([id, entry]) => WORD_BY_ID.has(id) && entry && typeof entry === 'object'),
    ),
    notes: Object.fromEntries(Object.entries(notes).filter(([id]) => WORD_BY_ID.has(id))),
    days,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : base.createdAt,
  }
}

/** Pure SM-2 style transition. `grade`: 0 again, 1 hard, 2 good, 3 easy. */
export function nextReview(previous, grade, now = Date.now()) {
  const previousReps = Number(previous?.reps) || 0
  const previousInterval = Number(previous?.interval) || 0
  const previousEase = Number(previous?.ease) || 2.3
  const previousLapses = Number(previous?.lapses) || 0
  const entry = {
    reps: previousReps,
    interval: previousInterval,
    ease: previousEase,
    lapses: previousLapses,
    dueAt: 0,
    lastGrade: grade,
  }
  if (grade === 0) {
    entry.reps = 0
    entry.lapses = previousLapses + 1
    entry.interval = 0
    entry.ease = clamp(previousEase - 0.2, 1.3, 2.8)
    entry.dueAt = now + AGAIN_MS
    return entry
  }
  let interval
  if (previousReps === 0) interval = grade === 1 ? 1 : grade === 2 ? 1 : 2
  else if (previousReps === 1) interval = grade === 1 ? 2 : grade === 2 ? 3 : 5
  else interval = Math.max(1, Math.round(previousInterval * (grade === 1 ? 1.2 : grade === 2 ? previousEase : previousEase * 1.3)))
  entry.reps = previousReps + 1
  entry.interval = interval
  entry.ease = clamp(previousEase + (grade === 1 ? -0.15 : grade === 3 ? 0.15 : 0.05), 1.3, 2.8)
  entry.dueAt = now + interval * DAY_MS
  return entry
}

function describeEntry(word, progress, note, isNew, now) {
  return {
    id: word.id,
    word: word.word,
    phonetic: word.phonetic,
    pos: word.pos,
    cn: word.cn,
    en: word.en,
    example: word.example,
    exampleCn: word.exampleCn,
    topic: word.topic,
    note: note || '',
    isNew: Boolean(isNew),
    dueAt: progress?.dueAt || null,
    lastGrade: progress?.lastGrade ?? null,
    reps: progress?.reps || 0,
    interval: progress?.interval || 0,
  }
}

export function createStore(filePath) {
  let state = null
  let dirty = false

  function read() {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      return normalizeState(parsed)
    } catch (error) {
      if (error && error.code === 'ENOENT') return emptyState()
      try {
        const broken = `${filePath}.corrupt-${Date.now()}`
        fs.renameSync(filePath, broken)
      } catch {}
      return emptyState()
    }
  }

  function load() {
    if (!state) state = read()
    return state
  }

  function save() {
    const target = filePath
    const directory = path.dirname(target)
    fs.mkdirSync(directory, { recursive: true })
    const temporary = `${target}.tmp`
    fs.writeFileSync(temporary, JSON.stringify(state, null, 2), 'utf8')
    fs.renameSync(temporary, target)
    dirty = false
  }

  function ensureDaily(current) {
    const today = dayKey()
    if (current.daily.date !== today) {
      current.daily = { date: today, newIds: [] }
      dirty = true
    }
    const target = current.settings.dailyTarget
    const allocated = new Set(current.daily.newIds)
    if (current.daily.newIds.length < target) {
      for (const word of WORDS) {
        if (current.daily.newIds.length >= target) break
        if (current.progress[word.id] || allocated.has(word.id)) continue
        current.daily.newIds.push(word.id)
        allocated.add(word.id)
        dirty = true
      }
    }
    if (dirty) save()
  }

  function summarizePlan(current) {
    const now = Date.now()
    const target = current.settings.dailyTarget
    const due = Object.entries(current.progress)
      .filter(([id, entry]) => WORD_BY_ID.has(id) && entry && entry.dueAt && entry.dueAt <= now)
      .sort((left, right) => left[1].dueAt - right[1].dueAt)
      .slice(0, MAX_PLAN)
      .map(([id, entry]) => describeEntry(WORD_BY_ID.get(id), entry, current.notes[id], false, now))
    const fresh = current.daily.newIds
      .filter((id) => !current.progress[id])
      .slice(0, target)
      .map((id) => describeEntry(WORD_BY_ID.get(id), null, current.notes[id], true, now))
    return [...due, ...fresh].slice(0, MAX_PLAN)
  }

  function summarizeStats(current) {
    const now = Date.now()
    const today = dayKey()
    let learned = 0
    let mastered = 0
    let due = 0
    for (const entry of Object.values(current.progress)) {
      if (!entry || typeof entry !== 'object') continue
      if ((entry.reps || 0) > 0) learned++
      if ((entry.interval || 0) >= 21) mastered++
      if (entry.dueAt && entry.dueAt <= now) due++
    }
    const reviewsToday = current.days[today]?.reviews || 0
    const correctToday = current.days[today]?.correct || 0
    let streak = 0
    let cursor = today
    if (!(current.days[cursor]?.reviews > 0)) cursor = shiftDayKey(cursor, -1)
    while (current.days[cursor]?.reviews > 0) {
      streak++
      cursor = shiftDayKey(cursor, -1)
    }
    return {
      total: WORDS.length,
      learned,
      mastered,
      due,
      reviewsToday,
      correctToday,
      streak,
    }
  }

  function summarizeAmbient(current, plan) {
    const picked = []
    const seen = new Set()
    for (const entry of plan) {
      if (picked.length >= 10) break
      if (seen.has(entry.id)) continue
      seen.add(entry.id)
      picked.push({ word: entry.word, cn: entry.cn, topic: entry.topic })
    }
    if (picked.length < 10) {
      const dayNumber = Math.floor(Date.now() / DAY_MS)
      const offset = (dayNumber * 7) % WORDS.length
      for (let index = 0; index < WORDS.length && picked.length < 10; index++) {
        const word = WORDS[(offset + index) % WORDS.length]
        if (seen.has(word.id)) continue
        seen.add(word.id)
        picked.push({ word: word.word, cn: word.cn, topic: word.topic })
      }
    }
    return picked
  }

  function buildState() {
    const current = load()
    ensureDaily(current)
    const plan = summarizePlan(current)
    return {
      serverDate: dayKey(),
      settings: { ...current.settings },
      stats: summarizeStats(current),
      plan,
      ambient: summarizeAmbient(current, plan),
    }
  }

  function review(id, grade) {
    const word = WORD_BY_ID.get(String(id || ''))
    if (!word) throw new StoreError('Unknown word id.', 404, 'unknown-word')
    const numericGrade = Number(grade)
    if (!Number.isInteger(numericGrade) || numericGrade < 0 || numericGrade > 3) {
      throw new StoreError('grade must be an integer from 0 to 3.', 400, 'invalid-grade')
    }
    const current = load()
    ensureDaily(current)
    const now = Date.now()
    const next = nextReview(current.progress[word.id], numericGrade, now)
    next.seenAt = current.progress[word.id]?.seenAt || now
    next.lastAt = now
    current.progress[word.id] = next
    const today = dayKey()
    const day = current.days[today] && typeof current.days[today] === 'object' ? current.days[today] : { reviews: 0, correct: 0 }
    day.reviews = (Number(day.reviews) || 0) + 1
    day.correct = (Number(day.correct) || 0) + (numericGrade >= 2 ? 1 : 0)
    current.days[today] = day
    const cutoff = dayKey(new Date(Date.now() - 120 * DAY_MS))
    for (const key of Object.keys(current.days)) {
      if (key < cutoff) delete current.days[key]
    }
    save()
    return buildState()
  }

  function updateSettings(patch) {
    const current = load()
    if (patch && typeof patch === 'object') {
      if (patch.dailyTarget !== undefined) {
        current.settings.dailyTarget = clampSetting(patch.dailyTarget, 5, 60, current.settings.dailyTarget)
      }
      if (patch.ambient !== undefined) current.settings.ambient = Boolean(patch.ambient)
      if (patch.pill !== undefined) {
        if (patch.pill === null) current.settings.pill = null
        else {
          const pill = normalizePill(patch.pill)
          if (pill) current.settings.pill = pill
        }
      }
    }
    save()
    return buildState()
  }

  function saveNote(id, text) {
    const word = WORD_BY_ID.get(String(id || ''))
    if (!word) throw new StoreError('Unknown word id.', 404, 'unknown-word')
    const current = load()
    const note = String(text || '').trim().slice(0, 1200)
    if (!note) delete current.notes[word.id]
    else current.notes[word.id] = note
    save()
    return buildState()
  }

  function quiz(count) {
    const size = clampSetting(count, 1, 20, 5)
    const current = load()
    const learned = WORDS.filter((word) => current.progress[word.id] && (current.progress[word.id].reps || 0) > 0)
    const pool = learned.length >= 4 ? learned : WORDS
    const questions = []
    const used = new Set()
    for (let index = 0; index < size; index++) {
      const available = pool.filter((word) => !used.has(word.id))
      if (available.length === 0) break
      const word = available[Math.floor(Math.random() * available.length)]
      used.add(word.id)
      const distractorPool = WORDS.filter((candidate) => candidate.id !== word.id && candidate.cn !== word.cn)
      const distractors = []
      while (distractors.length < 3 && distractorPool.length > 0) {
        const candidate = distractorPool.splice(Math.floor(Math.random() * distractorPool.length), 1)[0]
        if (distractors.some((entry) => entry.cn === candidate.cn)) continue
        distractors.push(candidate)
      }
      const options = [word.cn, ...distractors.map((entry) => entry.cn)]
      for (let cursor = options.length - 1; cursor > 0; cursor--) {
        const swap = Math.floor(Math.random() * (cursor + 1))
        ;[options[cursor], options[swap]] = [options[swap], options[cursor]]
      }
      questions.push({
        id: word.id,
        word: word.word,
        phonetic: word.phonetic,
        options,
        answer: options.indexOf(word.cn),
      })
    }
    return { questions }
  }

  function findNote(id) {
    const current = load()
    return current.notes[id] || ''
  }

  function reset() {
    const current = load()
    const settings = { ...current.settings }
    state = emptyState()
    state.settings = settings
    save()
    return buildState()
  }

  return {
    filePath,
    load,
    buildState,
    review,
    updateSettings,
    saveNote,
    findNote,
    quiz,
    reset,
    nextReview: (id, grade, now) => nextReview(load().progress[id], grade, now),
  }
}

export function defaultStatePath() {
  const profileDirectory =
    process.env.DSH_PROFILE_DIR ||
    path.join(
      process.env.DSH_HOME || path.join(os.homedir(), '.dsh'),
      'profiles',
      process.env.DSH_PROFILE || 'desktop',
    )
  return path.join(profileDirectory, 'ielts-vocab', 'state.json')
}
