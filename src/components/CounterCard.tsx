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
      <Head>
        <Name
          type="text"
          maxLength={30}
          aria-label="カウンター名"
          value={counter.name}
          onChange={(e) => onRename(e.target.value)}
        />
        <DeleteButton armed={remove.armed} onClick={remove.trigger}>
          {remove.armed ? '本当に削除？' : '削除'}
        </DeleteButton>
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
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 16px 16px;
`

const Head = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const Name = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  padding: 4px 0;
  &:focus {
    outline: none;
    color: var(--text);
    border-bottom: 1px solid var(--border);
  }
`

const DeleteButton = styled('button', {
  shouldForwardProp: (p) => p !== 'armed',
})<{ armed?: boolean }>`
  border: none;
  background: transparent;
  color: ${(p) => (p.armed ? 'var(--danger)' : 'var(--muted)')};
  font-weight: ${(p) => (p.armed ? 700 : 400)};
  font-size: 12px;
  cursor: pointer;
  padding: 4px;
  white-space: nowrap;
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
