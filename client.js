window.__ModuleLoader__.load({
  id: 'dsh-ielts-vocab',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useCallback, useEffect, useRef, useState } = React

    const API_BASE = '/ielts-vocab/api'

    const DICT = {
      zh: {
        appTitle: '雅思单词',
        appSubtitle: '每日核心词 · 间隔重复',
        today: '今日',
        remaining: '待复习',
        newWord: '新词',
        reviewWord: '复习',
        learned: '已学',
        mastered: '掌握',
        streak: '连续',
        days: '天',
        studyTab: '学习',
        quizTab: '测验',
        settingsTab: '设置',
        close: '关闭',
        again: '忘记',
        hard: '模糊',
        good: '认识',
        easy: '太简单',
        againHint: '10 分钟后',
        hardHint: '明天',
        goodHint: '按记忆曲线',
        easyHint: '更久之后',
        emptyTitle: '今日已完成',
        emptyHint: '明天再来，或者现在做一组测验巩固一下。',
        startQuiz: '开始测验',
        quizIntroTitle: '词汇测验',
        quizIntroHint: '5 道选择题，从学过的词中抽取。',
        quizHint: '选择正确的中文释义',
        next: '下一题',
        seeResult: '查看结果',
        quizDone: '测验完成',
        quizAgain: '再来一组',
        backToStudy: '回到学习',
        correct: '答对了',
        wrong: '答错了',
        answerIs: '正确答案：{answer}',
        score: '得分 {score}/{total}',
        settingsTitle: '学习设置',
        dailyTarget: '每日新词',
        ambient: '背景单词',
        ambientHint: '在界面背景中淡淡显示今日单词',
        pillPosition: '胶囊位置',
        pillPositionHint: '直接拖动胶囊即可移动，位置会自动记住。',
        resetPill: '恢复默认位置',
        dragHint: '拖动移动位置',
        reset: '重置学习记录',
        resetConfirm: '确定清空所有学习进度？',
        resetDone: '已重置',
        cancel: '取消',
        confirm: '确认',
        dataNote: '学习记录保存在本机，间隔重复会自动安排复习。',
        aiNote: 'AI 记忆法',
        aiAgain: '重新生成',
        aiThinking: '正在生成…',
        aiDone: '已保存记忆法',
        aiFail: 'AI 生成失败，可复制提问到对话',
        aiUnavailable: '当前没有可用的 AI 模型',
        copyPrompt: '复制提问',
        copied: '已复制，粘贴到对话发送即可',
        noteLabel: '记忆法',
        exampleLabel: '例句',
        promptTemplate: '用雅思单词插件讲解「{word}」，生成记忆法和一个雅思例句，并保存到插件里。',
        aiHint: '也可以随时在对话里说「讲解 abandon」，让 AI 生成并保存。',
        loadFail: '加载失败',
        retry: '重试',
        offline: '学习服务未连接',
        wordsTotal: '词库 {count} 词',
        todayCount: '今日 {count} 词',
        recorded: '已记录',
        actionFail: '操作失败，请重试',
        dueLater: '稍后复习',
        newBadge: '新',
        minute: '分钟',
        loading: '加载中…',
        openPill: '打开雅思单词',
        progressLabel: '今日进度',
      },
      en: {
        appTitle: 'IELTS Words',
        appSubtitle: 'Daily core words · spaced repetition',
        today: 'Today',
        remaining: 'to review',
        newWord: 'New',
        reviewWord: 'Review',
        learned: 'Learned',
        mastered: 'Mastered',
        streak: 'Streak',
        days: 'days',
        studyTab: 'Study',
        quizTab: 'Quiz',
        settingsTab: 'Settings',
        close: 'Close',
        again: 'Forgot',
        hard: 'Fuzzy',
        good: 'Known',
        easy: 'Easy',
        againHint: 'in 10 min',
        hardHint: 'tomorrow',
        goodHint: 'by memory curve',
        easyHint: 'much later',
        emptyTitle: 'All done for today',
        emptyHint: 'Come back tomorrow, or take a quiz to lock it in.',
        startQuiz: 'Start quiz',
        quizIntroTitle: 'Vocabulary quiz',
        quizIntroHint: 'Five multiple-choice questions drawn from words you have studied.',
        quizHint: 'Pick the correct Chinese meaning',
        next: 'Next',
        seeResult: 'See result',
        quizDone: 'Quiz complete',
        quizAgain: 'Another round',
        backToStudy: 'Back to study',
        correct: 'Correct',
        wrong: 'Not quite',
        answerIs: 'Correct answer: {answer}',
        score: 'Score {score}/{total}',
        settingsTitle: 'Study settings',
        dailyTarget: 'New words per day',
        ambient: 'Background words',
        ambientHint: 'Show today words faintly behind the interface',
        pillPosition: 'Pill position',
        pillPositionHint: 'Drag the pill to move it; the position is remembered.',
        resetPill: 'Reset position',
        dragHint: 'Drag to move',
        reset: 'Reset study progress',
        resetConfirm: 'Clear all study progress?',
        resetDone: 'Progress reset',
        cancel: 'Cancel',
        confirm: 'Confirm',
        dataNote: 'Progress is stored locally; reviews are scheduled automatically.',
        aiNote: 'AI mnemonic',
        aiAgain: 'Regenerate',
        aiThinking: 'Generating…',
        aiDone: 'Mnemonic saved',
        aiFail: 'AI failed — copy the prompt into chat',
        aiUnavailable: 'No AI model is available',
        copyPrompt: 'Copy prompt',
        copied: 'Copied — paste it into the chat',
        noteLabel: 'Mnemonic',
        exampleLabel: 'Example',
        promptTemplate: 'Explain “{word}” with the IELTS vocabulary plugin, create a mnemonic and an IELTS example, and save them to the plugin.',
        aiHint: 'You can also ask the agent in chat to explain any word.',
        loadFail: 'Could not load',
        retry: 'Retry',
        offline: 'Study service unavailable',
        wordsTotal: '{count} words',
        todayCount: '{count} today',
        recorded: 'Saved',
        actionFail: 'Something went wrong — try again',
        dueLater: 'due later',
        newBadge: 'NEW',
        minute: 'min',
        loading: 'Loading…',
        openPill: 'Open IELTS vocabulary',
        progressLabel: 'Today progress',
      },
    }

    const AMBIENT_LAYOUT = [
      { left: '3%', top: '13%', size: 46, rotate: -7 },
      { left: '7%', top: '52%', size: 66, rotate: 4 },
      { left: '4%', top: '81%', size: 38, rotate: -3 },
      { left: '74%', top: '9%', size: 56, rotate: 5 },
      { left: '86%', top: '31%', size: 40, rotate: -6 },
      { left: '78%', top: '59%', size: 74, rotate: 3 },
      { left: '70%', top: '85%', size: 36, rotate: -4 },
      { left: '31%', top: '5%', size: 34, rotate: 2 },
      { left: '46%', top: '93%', size: 46, rotate: -2 },
      { left: '58%', top: '12%', size: 32, rotate: 6 },
    ]

    const CSS = `
.ieltsv-root { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
.ieltsv-ambient { position: absolute; inset: 0; pointer-events: none; }
.ieltsv-ghost { position: absolute; font-family: Georgia, "Times New Roman", "Songti SC", serif; font-weight: 600; line-height: 1; color: var(--dsw-alias-label-primary); opacity: .055; white-space: nowrap; user-select: none; transform-origin: center; letter-spacing: -.02em; }
.ieltsv-pill { position: absolute; right: 16px; top: 64px; pointer-events: auto; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px 0 6px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: grab; touch-action: none; user-select: none; box-shadow: 0 8px 24px rgba(0,0,0,.14); transition: transform .15s ease, box-shadow .15s ease; }
.ieltsv-pill:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(0,0,0,.2); }
.ieltsv-pill:active { cursor: grabbing; }
.ieltsv-pill.is-dragging, .ieltsv-pill.is-dragging:hover { cursor: grabbing; transform: none; transition: none; }
.ieltsv-pill-orb { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: var(--dsw-alias-brand-primary); color: #fff; font-size: 11px; font-weight: 600; font-family: Georgia, "Songti SC", serif; }
.ieltsv-pill strong { color: var(--dsw-alias-label-primary); font-weight: 600; }
.ieltsv-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-state-warn-primary); }
.ieltsv-scrim { position: fixed; inset: 0; z-index: 40; pointer-events: auto; background: rgba(0,0,0,.36); display: flex; align-items: center; justify-content: center; padding: 18px; }
.ieltsv-modal { width: 560px; max-width: 100%; max-height: 86vh; overflow: auto; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); box-shadow: 0 30px 90px rgba(0,0,0,.4); padding: 20px; font-family: inherit; }
.ieltsv-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.ieltsv-title { font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
.ieltsv-subtitle { margin-top: 3px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.ieltsv-close { border: 0; background: transparent; color: var(--dsw-alias-label-secondary); font-size: 22px; line-height: 1; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; }
.ieltsv-close:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.ieltsv-tabs { display: flex; gap: 4px; padding: 3px; margin-bottom: 16px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2); }
.ieltsv-tab { flex: 1; border: 0; border-radius: 8px; padding: 7px 10px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; }
.ieltsv-tab.is-active { background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); box-shadow: 0 1px 3px rgba(0,0,0,.12); font-weight: 600; }
.ieltsv-progress-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.ieltsv-progress-row b { color: var(--dsw-alias-label-primary); font-weight: 600; }
.ieltsv-bar { height: 5px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; margin-bottom: 18px; }
.ieltsv-bar-fill { height: 100%; border-radius: 999px; background: var(--dsw-alias-brand-primary); transition: width .25s ease; }
.ieltsv-card { border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; padding: 18px; background: var(--dsw-alias-bg-layer-1); }
.ieltsv-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.ieltsv-tag { padding: 2px 7px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); }
.ieltsv-tag.is-new { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent); color: var(--dsw-alias-brand-primary); }
.ieltsv-topic { padding: 2px 7px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); }
.ieltsv-count { margin-left: auto; }
.ieltsv-word { font-family: Georgia, "Times New Roman", "Songti SC", serif; font-size: 44px; line-height: 1.08; letter-spacing: -.02em; margin-bottom: 4px; }
.ieltsv-phonetic { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); margin-bottom: 10px; }
.ieltsv-cn { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
.ieltsv-en { font-size: 13px; line-height: 1.55; color: var(--dsw-alias-label-secondary); margin-bottom: 14px; }
.ieltsv-example { border-left: 3px solid var(--dsw-alias-brand-primary); border-radius: 0 10px 10px 0; background: var(--dsw-alias-bg-layer-2); padding: 11px 13px; margin-bottom: 12px; }
.ieltsv-example-en { font-family: Georgia, "Times New Roman", serif; font-size: 14px; line-height: 1.5; margin-bottom: 4px; }
.ieltsv-example-cn { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
.ieltsv-note { border: 1px dashed var(--dsw-alias-border-l2); border-radius: 10px; padding: 10px 12px; font-size: 13px; line-height: 1.55; margin-bottom: 12px; color: var(--dsw-alias-label-primary); }
.ieltsv-note b { color: var(--dsw-alias-brand-primary); font-weight: 600; }
.ieltsv-ai-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ieltsv-ai-btn { border: 1px solid var(--dsw-alias-brand-primary); background: transparent; color: var(--dsw-alias-brand-primary); border-radius: 8px; padding: 6px 11px; font: inherit; font-size: 12px; cursor: pointer; }
.ieltsv-ai-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
.ieltsv-ai-btn:disabled { opacity: .6; cursor: default; }
.ieltsv-link { border: 0; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.ieltsv-link:hover { color: var(--dsw-alias-label-primary); }
.ieltsv-grades { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.ieltsv-grade { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 9px 4px; border-radius: 10px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); font: inherit; cursor: pointer; }
.ieltsv-grade:hover:not(:disabled) { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); }
.ieltsv-grade:disabled { opacity: .55; cursor: default; }
.ieltsv-grade-label { font-size: 13px; font-weight: 600; }
.ieltsv-grade-hint { font-size: 10px; color: var(--dsw-alias-label-secondary); }
.ieltsv-grade.is-again .ieltsv-grade-label { color: var(--dsw-alias-state-error-primary); }
.ieltsv-grade.is-hard .ieltsv-grade-label { color: var(--dsw-alias-state-warn-primary); }
.ieltsv-grade.is-good .ieltsv-grade-label { color: var(--dsw-alias-state-success-primary); }
.ieltsv-grade.is-easy .ieltsv-grade-label { color: var(--dsw-alias-brand-primary); }
.ieltsv-empty { text-align: center; padding: 22px 10px 8px; }
.ieltsv-empty-icon { width: 54px; height: 54px; margin: 0 auto 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent); color: var(--dsw-alias-state-success-primary); }
.ieltsv-empty-title { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.ieltsv-empty-hint { font-size: 13px; line-height: 1.6; color: var(--dsw-alias-label-secondary); max-width: 340px; margin: 0 auto 16px; }
.ieltsv-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
.ieltsv-stat { border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 10px 6px; }
.ieltsv-stat-value { font-size: 18px; font-weight: 600; }
.ieltsv-stat-label { margin-top: 2px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.ieltsv-empty-actions { display: flex; gap: 8px; justify-content: center; }
.ieltsv-primary { border: 0; border-radius: 9px; padding: 9px 16px; background: var(--dsw-alias-brand-primary); color: #fff; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.ieltsv-primary:hover { filter: brightness(1.06); }
.ieltsv-secondary { border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; padding: 9px 16px; background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 13px; cursor: pointer; }
.ieltsv-secondary:hover { background: var(--dsw-alias-bg-layer-2); }
.ieltsv-quiz-intro { text-align: center; padding: 18px 8px 10px; }
.ieltsv-quiz-intro-title { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.ieltsv-quiz-intro-hint { font-size: 13px; color: var(--dsw-alias-label-secondary); margin-bottom: 16px; }
.ieltsv-quiz-word { font-family: Georgia, "Times New Roman", serif; font-size: 34px; margin-bottom: 2px; }
.ieltsv-quiz-phonetic { font-size: 12px; color: var(--dsw-alias-label-secondary); font-family: ui-monospace, Consolas, monospace; margin-bottom: 14px; }
.ieltsv-option { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 11px 12px; margin-bottom: 8px; border-radius: 10px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); font: inherit; font-size: 14px; cursor: pointer; }
.ieltsv-option:hover:not(:disabled) { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); }
.ieltsv-option:disabled { cursor: default; }
.ieltsv-option.is-correct { border-color: var(--dsw-alias-state-success-primary); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent); }
.ieltsv-option.is-wrong { border-color: var(--dsw-alias-state-error-primary); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); }
.ieltsv-option.is-dim { opacity: .55; }
.ieltsv-option-letter { flex: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-layer-2); font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
.ieltsv-feedback { margin: 6px 0 12px; font-size: 13px; }
.ieltsv-feedback.is-correct { color: var(--dsw-alias-state-success-primary); }
.ieltsv-feedback.is-wrong { color: var(--dsw-alias-state-error-primary); }
.ieltsv-quiz-actions { display: flex; justify-content: flex-end; gap: 8px; }
.ieltsv-result { text-align: center; padding: 16px 8px; }
.ieltsv-result-score { font-size: 40px; font-family: Georgia, serif; font-weight: 600; margin-bottom: 4px; }
.ieltsv-result-label { font-size: 13px; color: var(--dsw-alias-label-secondary); margin-bottom: 18px; }
.ieltsv-setting { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 13px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.ieltsv-setting:last-child { border-bottom: 0; }
.ieltsv-setting-title { font-size: 13px; font-weight: 600; }
.ieltsv-setting-hint { margin-top: 3px; font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
.ieltsv-targets { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
.ieltsv-target { min-width: 38px; padding: 6px 9px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; cursor: pointer; }
.ieltsv-target.is-active { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
.ieltsv-switch { position: relative; width: 40px; height: 24px; flex: none; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-2); cursor: pointer; padding: 0; }
.ieltsv-switch.is-on { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }
.ieltsv-switch-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: transform .16s ease; }
.ieltsv-switch.is-on .ieltsv-switch-knob { transform: translateX(16px); }
.ieltsv-danger { border: 1px solid var(--dsw-alias-state-error-primary); background: transparent; color: var(--dsw-alias-state-error-primary); border-radius: 8px; padding: 6px 10px; font: inherit; font-size: 12px; cursor: pointer; }
.ieltsv-danger:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent); }
.ieltsv-danger-row { display: flex; gap: 6px; align-items: center; }
.ieltsv-reset-hint { font-size: 11px; color: var(--dsw-alias-state-error-primary); }
.ieltsv-data-note { margin-top: 16px; font-size: 11px; line-height: 1.55; color: var(--dsw-alias-label-secondary); }
.ieltsv-ai-hint { margin-top: 10px; font-size: 11px; line-height: 1.55; color: var(--dsw-alias-label-secondary); }
.ieltsv-toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 60; padding: 8px 14px; border-radius: 999px; background: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); font-size: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.3); pointer-events: none; }
.ieltsv-loading { padding: 40px 10px; text-align: center; font-size: 13px; color: var(--dsw-alias-label-secondary); }
.ieltsv-error { padding: 28px 12px; text-align: center; }
.ieltsv-error-text { font-size: 13px; color: var(--dsw-alias-state-error-primary); margin-bottom: 12px; }
@media (max-width: 900px) { .ieltsv-ghost { display: none; } }
@media (max-width: 720px) { .ieltsv-modal { padding: 16px; } .ieltsv-word { font-size: 36px; } .ieltsv-grades { grid-template-columns: repeat(2, 1fr); } .ieltsv-setting { flex-direction: column; gap: 8px; } .ieltsv-targets { justify-content: flex-start; } }
`

    async function api(path, body) {
      let response
      try {
        response = await fetch(`${API_BASE}${path}`, {
          method: body === undefined ? 'GET' : 'POST',
          headers:
            body === undefined
              ? { accept: 'application/json' }
              : { accept: 'application/json', 'content-type': 'application/json' },
          body: body === undefined ? undefined : JSON.stringify(body),
          credentials: 'same-origin',
        })
      } catch {
        const error = new Error('offline')
        error.code = 'offline'
        throw error
      }
      let payload = null
      try {
        payload = await response.json()
      } catch {}
      if (!response.ok) {
        const error = new Error(payload?.message || `HTTP ${response.status}`)
        error.status = response.status
        error.code = payload?.error || 'http-error'
        throw error
      }
      return payload
    }

    function copyText(text) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          return navigator.clipboard.writeText(text).then(
            () => true,
            () => false,
          )
        }
      } catch {}
      try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const copied = document.execCommand('copy')
        document.body.removeChild(area)
        return Promise.resolve(copied)
      } catch {
        return Promise.resolve(false)
      }
    }

    function makeTranslate(getBound, fallback) {
      return (key, vars) => {
        let value
        try {
          const bound = getBound()
          value = bound ? bound(key) : undefined
        } catch {}
        if (!value || value === key) value = fallback[key]
        if (!value) value = key
        if (vars) {
          value = value.replace(/\{(\w+)\}/g, (match, name) =>
            vars[name] === undefined ? match : String(vars[name]),
          )
        }
        return value
      }
    }

    function Overlay(props) {
      const { ctx, t } = props
      const [data, setData] = useState(null)
      const [loadError, setLoadError] = useState('')
      const [open, setOpen] = useState(false)
      const [tab, setTab] = useState('study')
      const [toast, setToast] = useState('')
      const [grading, setGrading] = useState(false)
      const [aiBusy, setAiBusy] = useState(false)
      const [savingSettings, setSavingSettings] = useState(false)
      const [confirmReset, setConfirmReset] = useState(false)
      const [quiz, setQuiz] = useState(null)
      const [quizIndex, setQuizIndex] = useState(0)
      const [picked, setPicked] = useState(null)
      const [score, setScore] = useState(0)
      const [quizDone, setQuizDone] = useState(false)
      const [quizBusy, setQuizBusy] = useState(false)
      const closeRef = useRef(null)
      const toastTimer = useRef(null)
      const pillRef = useRef(null)
      const dragRef = useRef(null)
      const draggedRef = useRef(false)
      const lastDragAt = useRef(0)
      const [, setLocaleTick] = useState(0)
      const [position, setPosition] = useState(null)
      const [dragPos, setDragPos] = useState(null)
      const [dragging, setDragging] = useState(false)

      useEffect(() => {
        if (!ctx.locale || typeof ctx.locale.subscribe !== 'function') return undefined
        return ctx.locale.subscribe(() => setLocaleTick((value) => value + 1))
      }, [ctx])

      const notify = useCallback((message) => {
        setToast(message)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(''), 2600)
      }, [])

      useEffect(
        () => () => {
          if (toastTimer.current) clearTimeout(toastTimer.current)
        },
        [],
      )

      const reload = useCallback(async () => {
        try {
          const next = await api('/state')
          setData(next)
          setLoadError('')
        } catch (error) {
          setLoadError(error && error.code === 'offline' ? 'offline' : 'loadFail')
        }
      }, [])

      useEffect(() => {
        let active = true
        const run = () => {
          api('/state')
            .then((next) => {
              if (!active) return
              setData(next)
              setLoadError('')
            })
            .catch((error) => {
              if (!active) return
              setLoadError(error && error.code === 'offline' ? 'offline' : 'loadFail')
            })
        }
        run()
        const timer = setInterval(() => {
          if (!document.hidden) run()
        }, 60000)
        const onVisibility = () => {
          if (!document.hidden) run()
        }
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          active = false
          clearInterval(timer)
          document.removeEventListener('visibilitychange', onVisibility)
        }
      }, [])

      const clampPill = useCallback((x, y) => {
        const element = pillRef.current
        const width = element ? element.offsetWidth : 120
        const height = element ? element.offsetHeight : 34
        return {
          x: Math.max(8, Math.min(Math.round(x), Math.max(8, window.innerWidth - width - 8))),
          y: Math.max(8, Math.min(Math.round(y), Math.max(8, window.innerHeight - height - 8))),
        }
      }, [])

      const persistPill = useCallback(
        async (pill) => {
          try {
            const next = await api('/settings', { pill })
            setData(next)
          } catch {
            notify(t('actionFail'))
          }
        },
        [notify, t],
      )

      const savedPill = data && data.settings ? data.settings.pill : null

      useEffect(() => {
        if (!savedPill) return
        setPosition((current) => current || clampPill(savedPill.x, savedPill.y))
      }, [savedPill, clampPill])

      useEffect(() => {
        const onResize = () => {
          setPosition((current) => (current ? clampPill(current.x, current.y) : current))
          setDragPos((current) => (current ? clampPill(current.x, current.y) : current))
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
      }, [clampPill])

      const startPillDrag = (event) => {
        if (event.button !== 0 || !pillRef.current) return
        const rect = pillRef.current.getBoundingClientRect()
        dragRef.current = {
          startX: event.clientX,
          startY: event.clientY,
          originX: rect.left,
          originY: rect.top,
          pointerId: event.pointerId,
        }
        draggedRef.current = false
        setDragging(true)
        setDragPos({ x: rect.left, y: rect.top })
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {}
      }

      const movePill = (event) => {
        const drag = dragRef.current
        if (!drag) return
        const deltaX = event.clientX - drag.startX
        const deltaY = event.clientY - drag.startY
        if (!draggedRef.current && Math.abs(deltaX) + Math.abs(deltaY) >= 4) draggedRef.current = true
        if (!draggedRef.current) return
        event.preventDefault()
        setDragPos(clampPill(drag.originX + deltaX, drag.originY + deltaY))
      }

      const endPillDrag = (event) => {
        const drag = dragRef.current
        if (!drag) return
        dragRef.current = null
        setDragging(false)
        try {
          event.currentTarget.releasePointerCapture(drag.pointerId)
        } catch {}
        if (!draggedRef.current) {
          setDragPos(null)
          return
        }
        const final = clampPill(
          drag.originX + (event.clientX - drag.startX),
          drag.originY + (event.clientY - drag.startY),
        )
        setDragPos(null)
        setPosition(final)
        lastDragAt.current = Date.now()
        persistPill(final)
      }

      const cancelPillDrag = (event) => {
        const drag = dragRef.current
        if (!drag) return
        dragRef.current = null
        setDragging(false)
        setDragPos(null)
        try {
          event.currentTarget.releasePointerCapture(drag.pointerId)
        } catch {}
      }

      useEffect(() => {
        if (open && closeRef.current) closeRef.current.focus()
      }, [open])

      const current = data && data.plan && data.plan[0] ? data.plan[0] : null

      const submitGrade = useCallback(
        async (grade) => {
          if (grading || !current) return
          setGrading(true)
          try {
            const next = await api('/review', { id: current.id, grade })
            setData(next)
            notify(t('recorded'))
          } catch {
            notify(t('actionFail'))
          } finally {
            setGrading(false)
          }
        },
        [current, grading, notify, t],
      )

      useEffect(() => {
        if (!open) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            return
          }
          const target = event.target
          if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
          if (tab !== 'study' || !current || grading) return
          const shortcut = { '1': 0, '2': 1, '3': 2, '4': 3 }[event.key]
          if (shortcut !== undefined) {
            event.preventDefault()
            submitGrade(shortcut)
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [open, tab, current, grading, submitGrade])

      const runAi = async (refresh) => {
        if (!current || aiBusy) return
        setAiBusy(true)
        try {
          const next = await api('/ai-note', { id: current.id, refresh: Boolean(refresh) })
          setData(next)
          notify(t('aiDone'))
        } catch (error) {
          notify(error && error.code === 'ai-unavailable' ? t('aiUnavailable') : t('aiFail'))
        } finally {
          setAiBusy(false)
        }
      }

      const copyPrompt = async () => {
        if (!current) return
        const copied = await copyText(t('promptTemplate', { word: current.word }))
        notify(copied ? t('copied') : t('actionFail'))
      }

      const updateSettings = async (patch) => {
        if (savingSettings) return
        setSavingSettings(true)
        try {
          const next = await api('/settings', patch)
          setData(next)
        } catch {
          notify(t('actionFail'))
        } finally {
          setSavingSettings(false)
        }
      }

      const resetProgress = async () => {
        if (!confirmReset) {
          setConfirmReset(true)
          return
        }
        try {
          const next = await api('/reset', {})
          setData(next)
          setConfirmReset(false)
          setTab('study')
          setQuiz(null)
          notify(t('resetDone'))
        } catch {
          notify(t('actionFail'))
        }
      }

      const startQuiz = async () => {
        if (quizBusy) return
        setQuizBusy(true)
        try {
          const result = await api('/quiz', { count: 5 })
          setQuiz(result.questions || [])
          setQuizIndex(0)
          setPicked(null)
          setScore(0)
          setQuizDone(false)
        } catch {
          notify(t('actionFail'))
        } finally {
          setQuizBusy(false)
        }
      }

      const chooseOption = (index) => {
        if (picked !== null || !quiz || !quiz[quizIndex]) return
        setPicked(index)
        if (index === quiz[quizIndex].answer) setScore((value) => value + 1)
      }

      const advanceQuiz = () => {
        if (!quiz) return
        if (quizIndex + 1 >= quiz.length) {
          setQuizDone(true)
          return
        }
        setQuizIndex((value) => value + 1)
        setPicked(null)
      }

      const reviewedToday = data ? data.stats.reviewsToday : 0
      const remaining = data ? data.plan.length : 0
      const totalToday = reviewedToday + remaining
      const percent = totalToday > 0 ? Math.min(100, Math.round((reviewedToday / totalToday) * 100)) : 100

      const pillOffset = dragPos || position
      const pillStyle = pillOffset
        ? { left: `${pillOffset.x}px`, top: `${pillOffset.y}px`, right: 'auto' }
        : undefined
      const pill = h(
        'button',
        {
          ref: pillRef,
          type: 'button',
          className: `ieltsv-pill${dragging ? ' is-dragging' : ''}`,
          style: pillStyle,
          onPointerDown: startPillDrag,
          onPointerMove: movePill,
          onPointerUp: endPillDrag,
          onPointerCancel: cancelPillDrag,
          onClick: (event) => {
            if (Date.now() - lastDragAt.current < 400) {
              event.preventDefault()
              return
            }
            setOpen(true)
            reload()
          },
          title: `${t('openPill')} · ${t('dragHint')}`,
          'aria-label': t('openPill'),
        },
        h('span', { className: 'ieltsv-pill-orb', 'aria-hidden': 'true' }, 'Aa'),
        h('span', null, t('appTitle')),
        h('strong', null, String(reviewedToday)),
        remaining > 0 ? h('span', { className: 'ieltsv-pill-dot', 'aria-hidden': 'true' }) : null,
      )

      const ambientLayer = h(
        'div',
        { className: 'ieltsv-ambient', 'aria-hidden': 'true' },
        data && data.settings.ambient && Array.isArray(data.ambient)
          ? data.ambient.slice(0, AMBIENT_LAYOUT.length).map((item, index) => {
              const slot = AMBIENT_LAYOUT[index]
              return h(
                'span',
                {
                  key: `${item.word}-${index}`,
                  className: 'ieltsv-ghost',
                  style: {
                    left: slot.left,
                    top: slot.top,
                    fontSize: `${slot.size}px`,
                    transform: `rotate(${slot.rotate}deg)`,
                  },
                },
                item.word,
              )
            })
          : null,
      )

      const tabButton = (id, label) =>
        h(
          'button',
          {
            key: id,
            type: 'button',
            role: 'tab',
            'aria-selected': tab === id,
            className: `ieltsv-tab${tab === id ? ' is-active' : ''}`,
            onClick: () => setTab(id),
          },
          label,
        )

      const gradeButton = (value, label, hint, kind) =>
        h(
          'button',
          {
            key: value,
            type: 'button',
            className: `ieltsv-grade is-${kind}`,
            onClick: () => submitGrade(value),
            disabled: grading,
          },
          h('span', { className: 'ieltsv-grade-label' }, label),
          h('span', { className: 'ieltsv-grade-hint' }, hint),
        )

      const statBlock = (label, value) =>
        h(
          'div',
          { className: 'ieltsv-stat', key: label },
          h('div', { className: 'ieltsv-stat-value' }, String(value)),
          h('div', { className: 'ieltsv-stat-label' }, label),
        )

      const renderStudy = () => {
        if (!data) {
          if (loadError) {
            return h(
              'div',
              { className: 'ieltsv-error' },
              h('div', { className: 'ieltsv-error-text' }, loadError === 'offline' ? t('offline') : t('loadFail')),
              h('button', { type: 'button', className: 'ieltsv-primary', onClick: reload }, t('retry')),
            )
          }
          return h('div', { className: 'ieltsv-loading' }, t('loading'))
        }
        const progress = h(
          'div',
          { key: 'progress' },
          h(
            'div',
            { className: 'ieltsv-progress-row' },
            h('span', null, t('progressLabel')),
            h('span', null, h('b', null, `${reviewedToday}`), ` / ${totalToday}`),
          ),
          h('div', { className: 'ieltsv-bar' }, h('div', { className: 'ieltsv-bar-fill', style: { width: `${percent}%` } })),
        )
        if (!current) {
          return h(
            'div',
            null,
            progress,
            h(
              'div',
              { className: 'ieltsv-empty' },
              h('div', { className: 'ieltsv-empty-icon' }, '✓'),
              h('div', { className: 'ieltsv-empty-title' }, t('emptyTitle')),
              h('p', { className: 'ieltsv-empty-hint' }, t('emptyHint')),
              h(
                'div',
                { className: 'ieltsv-stats' },
                statBlock(t('learned'), data.stats.learned),
                statBlock(t('mastered'), data.stats.mastered),
                statBlock(t('streak'), `${data.stats.streak} ${t('days')}`),
              ),
              h(
                'div',
                { className: 'ieltsv-empty-actions' },
                h('button', {
                  type: 'button',
                  className: 'ieltsv-primary',
                  onClick: () => {
                    setTab('quiz')
                    startQuiz()
                  },
                }, t('startQuiz')),
                h('button', { type: 'button', className: 'ieltsv-secondary', onClick: () => setTab('settings') }, t('settingsTitle')),
              ),
            ),
          )
        }
        return h(
          'div',
          null,
          progress,
          h(
            'div',
            { className: 'ieltsv-card' },
            h(
              'div',
              { className: 'ieltsv-meta' },
              h('span', { className: `ieltsv-tag${current.isNew ? ' is-new' : ''}` }, current.isNew ? t('newBadge') : t('reviewWord')),
              h('span', { className: 'ieltsv-topic' }, current.topic),
              h('span', { className: 'ieltsv-count' }, `${remaining} ${t('remaining')}`),
            ),
            h('div', { className: 'ieltsv-word' }, current.word),
            h('div', { className: 'ieltsv-phonetic' }, `${current.phonetic}  ${current.pos}`),
            h('div', { className: 'ieltsv-cn' }, current.cn),
            h('div', { className: 'ieltsv-en' }, current.en),
            h(
              'div',
              { className: 'ieltsv-example' },
              h('div', { className: 'ieltsv-example-en' }, current.example),
              h('div', { className: 'ieltsv-example-cn' }, current.exampleCn),
            ),
            current.note
              ? h('div', { className: 'ieltsv-note' }, h('b', null, `${t('noteLabel')}：`), current.note)
              : null,
            h(
              'div',
              { className: 'ieltsv-ai-row' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'ieltsv-ai-btn',
                  onClick: () => runAi(Boolean(current.note)),
                  disabled: aiBusy,
                },
                aiBusy ? t('aiThinking') : current.note ? t('aiAgain') : t('aiNote'),
              ),
              h('button', { type: 'button', className: 'ieltsv-link', onClick: copyPrompt }, t('copyPrompt')),
            ),
            h(
              'div',
              { className: 'ieltsv-grades' },
              gradeButton(0, t('again'), t('againHint'), 'again'),
              gradeButton(1, t('hard'), t('hardHint'), 'hard'),
              gradeButton(2, t('good'), t('goodHint'), 'good'),
              gradeButton(3, t('easy'), t('easyHint'), 'easy'),
            ),
          ),
        )
      }

      const renderQuiz = () => {
        if (quizBusy) return h('div', { className: 'ieltsv-loading' }, t('loading'))
        if (!quiz) {
          return h(
            'div',
            { className: 'ieltsv-quiz-intro' },
            h('div', { className: 'ieltsv-quiz-intro-title' }, t('quizIntroTitle')),
            h('p', { className: 'ieltsv-quiz-intro-hint' }, t('quizIntroHint')),
            h('button', { type: 'button', className: 'ieltsv-primary', onClick: startQuiz }, t('startQuiz')),
          )
        }
        if (quizDone) {
          const total = quiz.length
          return h(
            'div',
            { className: 'ieltsv-result' },
            h('div', { className: 'ieltsv-result-score' }, `${score} / ${total}`),
            h('div', { className: 'ieltsv-result-label' }, t('quizDone')),
            h(
              'div',
              { className: 'ieltsv-quiz-actions', style: { justifyContent: 'center' } },
              h('button', { type: 'button', className: 'ieltsv-secondary', onClick: startQuiz }, t('quizAgain')),
              h('button', { type: 'button', className: 'ieltsv-primary', onClick: () => setTab('study') }, t('backToStudy')),
            ),
          )
        }
        const question = quiz[quizIndex]
        if (!question) return null
        const answered = picked !== null
        const isCorrect = answered && picked === question.answer
        const options = question.options.map((option, index) => {
          let extra = ''
          if (answered) {
            if (index === question.answer) extra = ' is-correct'
            else if (index === picked) extra = ' is-wrong'
            else extra = ' is-dim'
          }
          return h(
            'button',
            {
              key: option,
              type: 'button',
              className: `ieltsv-option${extra}`,
              onClick: () => chooseOption(index),
              disabled: answered,
            },
            h('span', { className: 'ieltsv-option-letter' }, String.fromCharCode(65 + index)),
            h('span', null, option),
          )
        })
        return h(
          'div',
          null,
          h('div', { className: 'ieltsv-quiz-word' }, question.word),
          h('div', { className: 'ieltsv-quiz-phonetic' }, question.phonetic),
          h('div', { className: 'ieltsv-setting-hint', style: { marginBottom: '10px' } }, t('quizHint')),
          ...options,
          answered
            ? h(
                'div',
                { className: `ieltsv-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}` },
                isCorrect
                  ? t('correct')
                  : `${t('wrong')} · ${t('answerIs', { answer: question.options[question.answer] })}`,
              )
            : null,
          h(
            'div',
            { className: 'ieltsv-quiz-actions' },
            h(
              'button',
              {
                type: 'button',
                className: 'ieltsv-primary',
                onClick: advanceQuiz,
                disabled: !answered,
              },
              quizIndex + 1 >= quiz.length ? t('seeResult') : t('next'),
            ),
          ),
        )
      }

      const renderSettings = () => {
        if (!data) return h('div', { className: 'ieltsv-loading' }, t('loading'))
        const target = data.settings.dailyTarget
        const targets = [10, 15, 20, 30, 50]
        if (!targets.includes(target)) targets.push(target)
        return h(
          'div',
          null,
          h(
            'div',
            { className: 'ieltsv-setting' },
            h(
              'div',
              null,
              h('div', { className: 'ieltsv-setting-title' }, t('dailyTarget')),
              h('div', { className: 'ieltsv-setting-hint' }, t('wordsTotal', { count: data.stats.total })),
            ),
            h(
              'div',
              { className: 'ieltsv-targets' },
              targets.map((value) =>
                h(
                  'button',
                  {
                    key: value,
                    type: 'button',
                    className: `ieltsv-target${value === target ? ' is-active' : ''}`,
                    onClick: () => updateSettings({ dailyTarget: value }),
                    disabled: savingSettings,
                  },
                  String(value),
                ),
              ),
            ),
          ),
          h(
            'div',
            { className: 'ieltsv-setting' },
            h(
              'div',
              null,
              h('div', { className: 'ieltsv-setting-title' }, t('ambient')),
              h('div', { className: 'ieltsv-setting-hint' }, t('ambientHint')),
            ),
            h(
              'button',
              {
                type: 'button',
                role: 'switch',
                'aria-checked': data.settings.ambient,
                className: `ieltsv-switch${data.settings.ambient ? ' is-on' : ''}`,
                onClick: () => updateSettings({ ambient: !data.settings.ambient }),
                disabled: savingSettings,
              },
              h('span', { className: 'ieltsv-switch-knob' }),
            ),
          ),
          h(
            'div',
            { className: 'ieltsv-setting' },
            h(
              'div',
              null,
              h('div', { className: 'ieltsv-setting-title' }, t('pillPosition')),
              h('div', { className: 'ieltsv-setting-hint' }, t('pillPositionHint')),
            ),
            h(
              'div',
              { className: 'ieltsv-danger-row' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'ieltsv-secondary',
                  onClick: () => {
                    setPosition(null)
                    setDragPos(null)
                    persistPill(null)
                  },
                },
                t('resetPill'),
              ),
            ),
          ),
          h(
            'div',
            { className: 'ieltsv-setting' },
            h(
              'div',
              null,
              h('div', { className: 'ieltsv-setting-title' }, t('reset')),
              h('div', { className: 'ieltsv-setting-hint' }, confirmReset ? t('resetConfirm') : t('dataNote')),
            ),
            h(
              'div',
              { className: 'ieltsv-danger-row' },
              confirmReset
                ? h('button', { type: 'button', className: 'ieltsv-secondary', onClick: () => setConfirmReset(false) }, t('cancel'))
                : null,
              h('button', { type: 'button', className: 'ieltsv-danger', onClick: resetProgress }, confirmReset ? t('confirm') : t('reset')),
            ),
          ),
          h('p', { className: 'ieltsv-ai-hint' }, t('aiHint')),
          h('div', { className: 'ieltsv-data-note' }, t('dataNote')),
        )
      }

      const renderContent = () => {
        if (loadError && !data) return renderStudy()
        if (tab === 'quiz') return renderQuiz()
        if (tab === 'settings') return renderSettings()
        return renderStudy()
      }

      const modal = open
        ? h(
            'div',
            {
              className: 'ieltsv-scrim',
              onMouseDown: (event) => {
                if (event.target === event.currentTarget) setOpen(false)
              },
            },
            h(
              'div',
              { className: 'ieltsv-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('appTitle') },
              h(
                'div',
                { className: 'ieltsv-head' },
                h(
                  'div',
                  null,
                  h('div', { className: 'ieltsv-title' }, t('appTitle')),
                  h('div', { className: 'ieltsv-subtitle' }, t('appSubtitle')),
                ),
                h(
                  'button',
                  { type: 'button', className: 'ieltsv-close', onClick: () => setOpen(false), 'aria-label': t('close'), ref: closeRef },
                  '×',
                ),
              ),
              h(
                'div',
                { className: 'ieltsv-tabs', role: 'tablist' },
                tabButton('study', t('studyTab')),
                tabButton('quiz', t('quizTab')),
                tabButton('settings', t('settingsTab')),
              ),
              loadError && data
                ? h('div', { className: 'ieltsv-error-text', style: { marginBottom: '10px' } }, loadError === 'offline' ? t('offline') : t('loadFail'))
                : null,
              renderContent(),
            ),
          )
        : null

      return h(
        React.Fragment,
        null,
        h('style', null, CSS),
        h('div', { className: 'ieltsv-root' }, ambientLayer, pill),
        modal,
        toast ? h('div', { className: 'ieltsv-toast', role: 'status' }, toast) : null,
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        let bound = null
        try {
          ctx.effect(
            () => ctx.locale.register('ieltsVocabulary', { zh: DICT.zh, en: DICT.en }),
            'ielts-vocab: locale dictionary',
          )
          bound = ctx.locale.bind('ieltsVocabulary')
          ctx.effect(
            () =>
              ctx.locale.subscribe(() => {
                try {
                  bound = ctx.locale.bind('ieltsVocabulary')
                } catch {}
              }),
            'ielts-vocab: locale subscription',
          )
        } catch (error) {
          console.warn('[ielts-vocab] locale registration failed; using built-in Chinese strings.', error)
        }
        const t = makeTranslate(() => bound, DICT.zh)
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'ielts-vocab', order: 20 },
            () => h(Overlay, { ctx, t }),
          ),
        )
      },
    }
  },
})
