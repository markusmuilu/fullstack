const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'markus', name: 'Markus Test', passwordHash })
    await user.save()
})

describe('when there is initially some blogs saved', async () => {
    test('blog are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned without token', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('ids are in correct form', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body[0].hasOwnProperty('id'))
    } )
    describe('adding blogs with login', () => {
        test('blog can be added when logged in', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'markus', password: 'secret' })

            const auth = `Bearer ${login.body.token}`

            const newBlog = {
                title:'Tester',
                author: 'me',
                likes: 0,
                url: 'me.com'
            }

            await api
                .post('/api/blogs')
                .set('Authorization', auth)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert(titles.includes('Tester'))
        })

        test('blog without likes can be added while logged in', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'markus', password: 'secret' })

            const auth = `Bearer ${login.body.token}`

            const newBlog = {
                title: 'Tester',
                author: 'me',
                url: 'me.com',
            }

            await api
                .post('/api/blogs')
                .set('Authorization', auth)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const addedBlog = blogsAtEnd.find(b => b.title === 'Tester')
            assert.strictEqual(addedBlog.likes, 0)
        })

        test('blog without title cant be added', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'markus', password: 'secret' })

            const auth = `Bearer ${login.body.token}`

            const newBlog = {
                author: 'me',
                url: 'me.com',
            }

            await api
                .post('/api/blogs')
                .set('Authorization', auth)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('blog without url cant be added', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'markus', password: 'secret' })

            const auth = `Bearer ${login.body.token}`

            const newBlog = {
                title: 'Tester',
                author: 'me'
            }

            await api
                .post('/api/blogs')
                .set('Authorization', auth)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
            })

        test('blog cant be added if not logged in', async () => {
            const newBlog = {
                title:'Tester',
                author: 'me',
                likes: 0,
                url: 'me.com'
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length) 

            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes('Tester'))
        })
    })

    describe('deletion of a blog with login', () => {
        test('deleting one blog logged in', async () => {
            const login = await api
                .post('/api/login')
                .send({ username: 'markus', password: 'secret' })

            const auth = `Bearer ${login.body.token}`

            const newBlogToDelete = {
                title:'Tester',
                author: 'me',
                likes: 0,
                url: 'me.com'
            }

            const savedBlog = await api
                .post('/api/blogs')
                .set('Authorization', auth)
                .send(newBlogToDelete)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtBetween = await helper.blogsInDb()
            assert.strictEqual(blogsAtBetween.length, helper.initialBlogs.length + 1)
            const titles = blogsAtBetween.map(b => b.title)
            assert(titles.includes(savedBlog.body.title))

            await api
                .delete(`/api/blogs/${savedBlog.body.id}`)
                .set('Authorization', auth)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const titlesAtEnd = blogsAtEnd.map(b => b.title)
            assert(!titlesAtEnd.includes(savedBlog.title))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('updating blog', () => {
        test('updating one blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const updatedBlogData = {
                ...blogToUpdate,
                likes: blogToUpdate.likes + 1
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlogData)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

            assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)
        })
    })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
    await mongoose.connection.close()
})
