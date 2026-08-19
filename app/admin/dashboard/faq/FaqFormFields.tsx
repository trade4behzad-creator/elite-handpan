'use client'

import { useState, useTransition } from 'react'
import { translateFaqText } from './actions'

const GOLD = '#3F3E7A'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#f5f5f5',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: '#888',
  marginBottom: '6px',
}

const translateBtnStyle: React.CSSProperties = {
  fontSize: '11px',
  color: GOLD,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
}

export default function FaqFormFields({
  defaults,
}: {
  defaults?: {
    question_en: string
    question_fa: string
    answer_en: string
    answer_fa: string
  }
}) {
  const [questionFa, setQuestionFa] = useState(defaults?.question_fa ?? '')
  const [questionEn, setQuestionEn] = useState(defaults?.question_en ?? '')
  const [answerFa, setAnswerFa] = useState(defaults?.answer_fa ?? '')
  const [answerEn, setAnswerEn] = useState(defaults?.answer_en ?? '')
  const [pendingQ, startQTransition] = useTransition()
  const [pendingA, startATransition] = useTransition()

  function handleTranslateQuestion() {
    if (!questionFa.trim()) return
    startQTransition(async () => {
      const result = await translateFaqText(questionFa)
      if (result) setQuestionEn(result)
    })
  }

  function handleTranslateAnswer() {
    if (!answerFa.trim()) return
    startATransition(async () => {
      const result = await translateFaqText(answerFa)
      if (result) setAnswerEn(result)
    })
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>
            <span>سوال (فارسی)</span>
          </label>
          <input
            name="question_fa"
            value={questionFa}
            onChange={(e) => setQuestionFa(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>
            <span>سوال (انگلیسی)</span>
            <button
              type="button"
              onClick={handleTranslateQuestion}
              disabled={pendingQ || !questionFa.trim()}
              style={{ ...translateBtnStyle, opacity: pendingQ || !questionFa.trim() ? 0.4 : 1 }}
            >
              {pendingQ ? 'در حال ترجمه…' : '↻ ترجمه خودکار از فارسی'}
            </button>
          </label>
          <input
            name="question_en"
            required
            value={questionEn}
            onChange={(e) => setQuestionEn(e.target.value)}
            style={{ ...inputStyle, direction: 'ltr' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>
            <span>پاسخ (فارسی)</span>
          </label>
          <textarea
            name="answer_fa"
            rows={3}
            value={answerFa}
            onChange={(e) => setAnswerFa(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={labelStyle}>
            <span>پاسخ (انگلیسی)</span>
            <button
              type="button"
              onClick={handleTranslateAnswer}
              disabled={pendingA || !answerFa.trim()}
              style={{ ...translateBtnStyle, opacity: pendingA || !answerFa.trim() ? 0.4 : 1 }}
            >
              {pendingA ? 'در حال ترجمه…' : '↻ ترجمه خودکار از فارسی'}
            </button>
          </label>
          <textarea
            name="answer_en"
            required
            rows={3}
            value={answerEn}
            onChange={(e) => setAnswerEn(e.target.value)}
            style={{ ...inputStyle, direction: 'ltr', resize: 'vertical' }}
          />
        </div>
      </div>
    </>
  )
}
