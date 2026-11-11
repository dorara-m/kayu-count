import { useState, type KeyboardEvent } from 'react'
import styled from '@emotion/styled'
import type { Counter } from '../types'
import { useTwoStep } from '../hooks/useTwoStep'

type Props = {
  counter: Counter
  onIncrement: () => void
  onDecrement: () => void
  onSetCount: (n: number) => void
  onReset: () => void
  onRename: (name: string) => void
  onRemove: () => void
}

export const CounterCard = ({
  counter,
  onIncrement,
  onDecrement,
  onSetCount,
  onReset,
  onRename,
  onRemove,
}: Props) => {
  const [initValue, setInitValue] = useState('')
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(counter.name)

  const startEdit = () => {
    setDraftName(counter.name)
    setEditing(true)
  }

  const commitName = () => {
    const name = draftName.trim()
    if (name) onRename(name)
    setEditing(false)
  }

  const onNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitName()
    } else if (e.key === 'Escape') {
      setEditing(false)
    }
  }
  const reset = useTwoStep(onReset)
  const remove = useTwoStep(onRemove)

  const applyInit = () => {
    const v = parseInt(initValue, 10)
    if (Number.isNaN(v)) return
    onSetCount(v)
    setInitValue('')
  }

  const onInitKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      applyInit()
      e.currentTarget.blur()
    }
  }

  return (
    <Card>
      <DeleteButton
        armed={remove.armed}
        onClick={remove.trigger}
        aria-label={remove.armed ? 'もう一度押すと削除' : 'カウンターを削除'}
        title={remove.armed ? 'もう一度押すと削除' : 'カウンターを削除'}
      >
        {remove.armed ? '削除する？' : <CloseIcon />}
      </DeleteButton>
      <Head>
        {editing ? (
          <NameInput
            type="text"
            maxLength={30}
            aria-label="カウンター名"
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={onNameKeyDown}
            onBlur={commitName}
          />
        ) : (
          <NameView>
            <NameText>{counter.name}</NameText>
            <EditButton aria-label="名前を変更" title="名前を変更" onClick={startEdit}>
              <PencilIcon />
            </EditButton>
          </NameView>
        )}
      </Head>

      <Count>{counter.count.toLocaleString('ja-JP')}</Count>

      <PlusButton onClick={onIncrement}>+1</PlusButton>

      <Row>
        <InitInput
          type="number"
          inputMode="numeric"
          placeholder="初期値（例: 50）"
          value={initValue}
          onChange={(e) => setInitValue(e.target.value)}
          onKeyDown={onInitKeyDown}
        />
        <SubButton fit onClick={applyInit}>
          設定
        </SubButton>
      </Row>
      <Row>
        <SubButton onClick={onDecrement}>−1 戻す</SubButton>
        <SubButton armed={reset.armed} onClick={reset.trigger}>
          {reset.armed ? 'もう一度で0に' : 'リセット'}
        </SubButton>
      </Row>
    </Card>
  )
}

const Card = styled.div`
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 16px 16px;
`

const Head = styled.div`
  display: flex;
  padding-right: 28px;
  gap: 8px;
  align-items: center;
`

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

const NameView = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`

const NameText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  padding: 5px 0;
`

const EditButton = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  &:hover {
    color: var(--text);
    background: var(--border);
  }
`

const NameInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  border-bottom: 1px solid var(--accent);
  background: transparent;
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  padding: 4px 0;
  &:focus {
    outline: none;
  }
`

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

const DeleteButton = styled('button', {
  shouldForwardProp: (p) => p !== 'armed',
})<{ armed?: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: ${(p) => (p.armed ? '0 10px' : '0')};
  border: none;
  border-radius: 13px;
  background: ${(p) => (p.armed ? 'var(--danger)' : 'transparent')};
  color: ${(p) => (p.armed ? '#fff' : 'var(--muted)')};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: ${(p) => (p.armed ? '#fff' : 'var(--danger)')};
    background: ${(p) => (p.armed ? 'var(--danger)' : 'var(--border)')};
  }
`

const Count = styled.div`
  font-size: 56px;
  font-weight: 700;
  text-align: center;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin: 4px 0 12px;
  word-break: break-all;
`

const PlusButton = styled.button`
  width: 100%;
  height: 88px;
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  &:active {
    background: var(--accent-press);
    transform: scale(0.98);
  }
`

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`

const InitInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px;
  font-size: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text);
`

const SubButton = styled('button', {
  shouldForwardProp: (p) => p !== 'armed' && p !== 'fit',
})<{ armed?: boolean; fit?: boolean }>`
  flex: ${(p) => (p.fit ? '0 0 auto' : '1')};
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid ${(p) => (p.armed ? 'var(--danger)' : 'var(--border)')};
  border-radius: 8px;
  background: transparent;
  color: ${(p) => (p.armed ? 'var(--danger)' : 'var(--text)')};
  font-weight: ${(p) => (p.armed ? 700 : 400)};
  cursor: pointer;
  white-space: nowrap;
  &:active {
    background: var(--border);
  }
`
