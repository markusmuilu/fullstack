import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root')).render(<App />)
/*
const refresh = () => {
  root.render(<App counter={counter} />)
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
*/