import { useEffect, useRef, useState } from 'react'

/**
 * 誤操作防止：1回目で確認状態にし、timeout 以内にもう一度押すと action を実行する
 */
export const useTwoStep = (action: () => void, timeout = 3000) => {
  const [armed, setArmed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const trigger = () => {
    clearTimeout(timer.current)
    if (armed) {
      setArmed(false)
      action()
      return
    }
    setArmed(true)
    timer.current = setTimeout(() => setArmed(false), timeout)
  }

  return { armed, trigger }
}
