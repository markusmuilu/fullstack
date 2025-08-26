import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  let [infoVisible, setInfoVisible] = useState(false)
  const showWhenVisible = { display: infoVisible ? '' : 'none' }
  const hideWhenVisible = { display: infoVisible ? 'none' : '' }
  const name = blog.user.name

  const handleLike = () => {
    console.log(blog)
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user
    }
    updateLikes(updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog)
  }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={() => setInfoVisible(!infoVisible)}> view</button>
        <button style={showWhenVisible} onClick={() => setInfoVisible(!infoVisible)}> hide</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
        <p>{name}</p>
        {user.username === blog.user.username ? <button onClick={handleDelete}>Remove</button>: <div></div> }
      </div>
    </div>
  )}

export default Blog