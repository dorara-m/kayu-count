import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { GlobalStyle } from './GlobalStyle'
import { CounterCard } from './components/CounterCard'
import { useCounters } from './hooks/useCounters'

export const App = () => {
  const { counters, increment, decrement, setCount, rename, add, remove } = useCounters()
  const listEnd = useRef<HTMLButtonElement>(null)
  const prevLength = useRef(counters.length)

  // 追加したときだけ新しいカウンターまでスクロール
  useEffect(() => {
    if (counters.length > prevLength.current) {
      listEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    prevLength.current = counters.length
  }, [counters.length])

  return (
    <>
      <GlobalStyle />
      <Page>
        <Wrap>
          <Title>かゆ-かう</Title>
          {counters.map((c) => (
            <CounterCard
              key={c.id}
              counter={c}
              onIncrement={() => increment(c.id)}
              onDecrement={() => decrement(c.id)}
              onSetCount={(n) => setCount(c.id, n)}
              onReset={() => setCount(c.id, 0)}
              onRename={(name) => rename(c.id, name)}
              onRemove={() => remove(c.id)}
            />
          ))}
          <AddButton ref={listEnd} onClick={add}>
            ＋ カウンターを追加
          </AddButton>
        </Wrap>
      </Page>
    </>
  )
}

const Page = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
`

const Wrap = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  text-align: center;
`

const AddButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 15px;
  border: 2px dashed var(--border);
  border-radius: 16px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  &:active {
    background: var(--border);
  }
`
