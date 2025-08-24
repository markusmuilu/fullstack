const fp = require('lodash/fp')
const blog = require('../models/blog')
 
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((p, c) => p + c.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((m, b) => m.likes < b.likes ? b : m)
}

const mostBlogs = (blogs) => {
  const blogCounts = fp.flow(
    fp.groupBy('author'),
    fp.mapValues(fp.size),
    fp.toPairs,
    fp.map(([author, count]) => ({ author, blogs: count })),
    fp.maxBy('blogs')
  )(blogs)

  return blogCounts
}

const mostLikes = (blogs) => {
  const blogCounts = fp.flow(
    fp.groupBy('author'),
    fp.toPairs,
    fp.map(([author, bloglist]) => ({ author, likes: bloglist.reduce((sum, blog) => sum + blog.likes, 0) })),
    fp.maxBy('likes')
  )(blogs)

  return blogCounts
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}