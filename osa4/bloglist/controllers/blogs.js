const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blogToDelete = await Blog.findById(request.params.id)
  if (blogToDelete === null) {
    response.status(404).json({error: 'Blog not found'})
  } else if ( blogToDelete.user.toString() === user._id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).json({error: 'You can only delete your own blogs'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body 

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = body.likes

  const savedBlog = await blog.save()
  response.json(savedBlog)
})

module.exports = blogsRouter