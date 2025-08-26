import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification.jsx'
import loginService from './services/login'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import Togglable from './components/Togglable.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorState, setErrorState] = useState(false)

  const blogFormRef = useRef()
  const loginFormRef = useRef()

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

  const addBlog = (blogObject) => {
    try {
      blogService
      .create(blogObject)
      .then(returnedBlog => {
        const blogAdded = {
        ...returnedBlog,
        user: {
          id: user.id,
          name: user.name,
          username: user.username
        }
      }
      console.log(blogAdded)
      setBlogs(blogs.concat(blogAdded))
        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        blogFormRef.current.toggleVisibility()
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    } catch (e) {
      setErrorState(true)
      setErrorMessage('Error creating blog')
      setTimeout(() => {
          setErrorMessage(null)
          setErrorState(false)
        }, 5000)
    }
    }

  const updateBlog = (blogObject) => {
    try {
      blogService
      .update(blogObject)
      .then(returnedBlog => {
        const originalBlog = blogs.find(blog => blog.id === returnedBlog.id);
        const updatedBlogWithUser = {
          ...returnedBlog,
          user: originalBlog.user 
        }
        setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? updatedBlogWithUser : blog))
        setErrorMessage(`blog ${returnedBlog.title} has now ${returnedBlog.likes}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        })
    } catch (e) {
      setErrorState(true)
      setErrorMessage('Like couldnt be added')
      setTimeout(() => {
          setErrorMessage(null)
          setErrorState(false)
        }, 5000)
    }
    }

  const deleteBlog = (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      try {
        blogService
        .deleteBlog(blogObject)
        .then( () => {
          setBlogs(blogs.filter(blog => blog.id != blogObject.id))
          setErrorMessage(`blog ${blogObject.title} was deleted`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          })
      } catch (e) {
        setErrorState(true)
        setErrorMessage('Like couldnt be added')
        setTimeout(() => {
            setErrorMessage(null)
            setErrorState(false)
          }, 5000)
      }
    }
  }

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

  const loginForm = () => (
    <Togglable buttonLabel="login" ref={loginFormRef}>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedblogappUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} error={errorState} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} error={errorState} />
      <h2>blogs</h2>
      <p></p><div>{user.name} logged in</div><button onClick={handleLogOut}>logout</button><p></p>
      {blogs.sort((a,b) => b.likes- a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={updateBlog} deleteBlog={deleteBlog} user={user}/>
      )}
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )
}

export default App