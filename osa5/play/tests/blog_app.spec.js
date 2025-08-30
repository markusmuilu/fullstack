const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi',
        username: 'Testi',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'login' }).click()

    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')

      await loginWith(page, 'Testi', 'secret')

      await expect(page.getByText('Testi logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')

      await loginWith(page, 'Testi', 'salainen')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await loginWith(page, 'Testi', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Me', 'test.com')

      await expect(page.locator('.blog', { hasText: 'a blog created by playwright' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Me', 'test.com')

      const blog = page.locator('.blog', { hasText: 'a blog created by playwright' })
      const viewButton = blog.getByRole('button', { name: 'view' })
      await viewButton.click()

      const likeButton = blog.getByRole('button', { name: 'like' })
      await likeButton.click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Me', 'test.com')

      const blog = page.locator('.blog', { hasText: 'a blog created by playwright' })
      await blog.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept());
      await blog.getByRole('button', { name: 'Remove' }).click();

      await expect(blog).not.toBeVisible()
    })

    test('blogs are ordered according to likes', async ({ page }) => {
      await createBlog(page, 'first blog', 'Me', 'test.com')
      await createBlog(page, 'second blog', 'Me', 'test.com')
      await createBlog(page, 'third blog', 'Me', 'test.com')

      const blog1 = page.locator('.blog', { hasText: 'first blog' })
      
      const blog2 = page.locator('.blog', { hasText: 'second blog' })
      const blog3 = page.locator('.blog', { hasText: 'third blog' })

      await blog3.getByRole('button', { name: 'view' }).click()

      await blog3.locator('button', { hasText: 'like' }).click()
      await expect(blog3.getByText('likes 1')).toBeVisible()  

      await blog3.locator('button', { hasText: 'like' }).click()
      await expect(blog3.getByText('likes 2')).toBeVisible()  

      await blog2.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 1')).toBeVisible()  

      await blog1.getByRole('button', { name: 'view' }).click()
      await expect(blog1.getByText('likes 0')).toBeVisible()

      const blogs = await page.locator('.blog').all()
      expect(blogs).toHaveLength(3)
      await expect(blogs[0]).toContainText('third blog')
      await expect(blogs[1]).toContainText('second blog')
      await expect(blogs[2]).toContainText('first blog')
    })
  })

  describe('When other account has created the blog', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Other',
        username: 'Other',
        password: 'secrets'
      }
    })

      await page.goto('http://localhost:5173')
      await loginWith(page, 'Other', 'secrets')

      await createBlog(page, 'Blog created by other', 'Other', 'test.com')

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'Testi', 'secret')
    })

    test('the blog remove button is not visible', async ({ page }) => {
      const blog = page.locator('.blog', { hasText: 'Blog created by other' })
      await blog.getByRole('button', { name: 'view' }).click()

      await expect(blog.getByRole('button', { name: 'Remove' })).not.toBeVisible()
    })
  })
})