import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Button = (props) => {
  const { onclick, text } = props
    return(<button onClick = {onclick} >{text}</button>)
}

const Increase = (props) => {

}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const goodup = () => setGood(good + 1)
  const neutralup = () => setNeutral(neutral + 1)
  const badup = () => setBad(bad + 1)
  return (
    <div>
      <h1>
        give feedback
      </h1>
      <Button onclick={goodup} text='good' />
      <Button onclick={neutralup} text='neutral' />
      <Button onclick={badup} text='bad' />
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}


export default App
