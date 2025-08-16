import { useState, useEffect } from "react"
import axios from "axios"

const Weather = ({capital}) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then((response) => setWeather(response.data))
  }, [capital, api_key])

  if (!weather) {
    return <p>Loadin weather...</p>
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {weather.main.temp} celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}alt="weather icon"/>
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({country}) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital?.[0]}</p>
    <p>Area {country.area}</p>
    <h2>Langueages</h2>
    <ul>
      {Object.values(country.languages  || {}).map((l) => (
        <li key={l}>{l}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt="flag" width="250" />
    {country.capital && <Weather capital={country.capital[0]} />}
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data))
  }, [])

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const filtered = countries.filter((c) => 
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  let content = null

  if (filter !== "") {
    if (filtered.length > 10) {
      content = <p>Too many matches, specify another filter</p>
    } else if (filtered.length > 1) {
      content = (
        <div>
          <ul>
            {filtered.map((c) => 
              <li key={c.code + c.name.common}>
                {c.name.common}
                <button onClick={() => setFilter(c.name.common)}>show</button>
              </li>
            )}
          </ul>
        </div>
      )
    } else if (filtered.length === 1) {
      content = <Country country={filtered[0]} />
    } else {
      content = <p>No matches found</p>
    }
  }

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleChange} />
      </div>
      {content}
    </div>
  )
}

export default App