const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', async () => {
    test('blog are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('ids are in correct form', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body[0].hasOwnProperty('id'))
    } )
    describe('adding blogs', () => {
        test('blog can be added', async () => {
            const newBlog = {
                title:'Tester',
                author: 'me',
                likes: 0,
                url: 'me.com'
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert(titles.includes('Tester'))
        })

        test('blog without likes can be added', async () => {
        const newBlog = {
            title: 'Tester',
            author: 'me',
            url: 'me.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const addedBlog = blogsAtEnd.find(b => b.title === 'Tester')
        assert.strictEqual(addedBlog.likes, 0)
        })

        test('blog without title cant be added', async () => {
        const newBlog = {
            author: 'me',
            url: 'me.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('blog without url cant be added', async () => {
        const newBlog = {
            title: 'Tester',
            author: 'me'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('deleting one blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes(blogToDelete.title))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
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

after(async () => {
    await mongoose.connection.close()
})
