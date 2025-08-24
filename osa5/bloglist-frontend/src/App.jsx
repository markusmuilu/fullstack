import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification.jsx'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorState, setErrorState] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedblogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
      event.preventDefault()
      
      try {
        const user = await loginService.login({ username, password })
        window.localStorage.setItem(
        'loggedblogappUser', JSON.stringify(user)
      ) 
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      } catch {
        setErrorState(true)        
        setErrorMessage('wrong username or password')
        setTimeout(() => {
          setErrorMessage(null)
          setErrorState(false)
        }, 5000)
      }
    }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} error={errorState} />
        <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>
                username
                <input
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                password
                <input
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </label>
            </div>
            <button type="submit">login</button>
          </form>
      </div>
    )
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedblogappUser')
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {title, author, url, user}
    try {
      blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setAuthor('')
        setTitle('')
        setUrl('')
        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    } catch {
      
    }
    }

  return (
    <div>
      <Notification message={errorMessage} error={errorState} />
      <h2>blogs</h2>
      <p></p><div>{user.name} logged in</div><button onClick={handleLogOut}>logout</button><p></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title: 
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url: 
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App