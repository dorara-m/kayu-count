import { Global, css } from '@emotion/react'

const styles = css`
  :root {
    --bg: #f6f4ef;
    --card: #ffffff;
    --text: #222;
    --muted: #888;
    --accent: #e8735a;
    --accent-press: #d05f47;
    --danger: #c0392b;
    --border: #e2ded6;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #1c1b19;
      --card: #2a2926;
      --text: #f0ede6;
      --muted: #9a968d;
      --danger: #e5675a;
      --border: #3c3a36;
    }
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, -apple-system, 'Hiragino Sans', sans-serif;
  }
`

export const GlobalStyle = () => <Global styles={styles} />
