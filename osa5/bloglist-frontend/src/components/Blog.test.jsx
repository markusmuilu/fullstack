import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog', async () => {
  const blog = {
    title: 'Does it show',
    author: 'Me',
    user: {
      name: 'Testi',
      username: 'Testi'
    }
  }

  const user = {
    name: 'Testi',
    username: 'Testi'
  }

  render(<Blog blog={blog} user={user}/>)

  const title = await screen.findByText('Does it show Me')
  expect(title).toBeDefined()
})

test('renders blog extra info', async () => {
  const blog = {
    title: 'Does it show',
    author: 'Me',
    url: 'something.com',
    likes: 0,
    user: {
      name: 'Test',
      username: 'Testikäyttis'
    }
  }

  const Bloguser = {
    name: 'Testi',
    username: 'Testi'
  }

  render(<Blog blog={blog} user={Bloguser}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const url = await screen.findByText('something.com')
  const useradd = await screen.findByText('Test')
  const likes = await screen.findByText('likes 0')

  expect(url).toBeDefined()
  expect(useradd).toBeDefined()
  expect(likes).toBeDefined()
})

test('reacts to blog likes', async () => {
  const blog = {
    title: 'Does it show',
    author: 'Me',
    url: 'something.com',
    likes: 0,
    user: {
      name: 'Test',
      username: 'Testikäyttis'
    }
  }

  const Bloguser = {
    name: 'Testi',
    username: 'Testi'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={Bloguser} updateLikes={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const button2 = screen.getByText('like')
  await user.click(button2)
  await user.click(button2)

  expect(mockHandler.mock.calls).toHaveLength(2)
})