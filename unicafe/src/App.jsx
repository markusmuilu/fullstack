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

const Statisticsline = (props) => {
  const { text, count } = props
  return (<tr>
    <td>{ text }</td>
      <td> { count }</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad } = props
  if (bad == 0 && neutral == 0 && good == 0){
    return (
      <tbody>
        <tr>
          <th>
            statistics
          </th>
        </tr>
        <tr>
          <td>
            no feedback given
          </td>
        </tr>
      </tbody> 
  )
    }return (
      <tbody>
        <tr>
          <th>
            statistics
          </th>
        </tr>
        <Statisticsline text='good' count={good} />
        <Statisticsline text='neutral' count={neutral} />
        <Statisticsline text='bad' count={bad}/>

        <tr>
          <td>average</td>
          <td>{(good - bad) / (good + bad + neutral)}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td> {good * 100.0 / (good + bad + neutral)}%</td>
        </tr>   
      </tbody>
  )
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
      
      
      
      <table>
        <tbody>
          <tr>
            <th>
              give feedback
            </th>
          </tr>
          <tr>
            <td><Button onclick={goodup} text='good' /></td>
            <td><Button onclick={neutralup} text='neutral' /></td>
            <td><Button onclick={badup} text='bad' /></td>
          </tr>
        </tbody>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </table>
    </div>
  )
}


export default App
