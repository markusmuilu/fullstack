import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByRole('textbox', { name: 'title:' })
  const author = screen.getByRole('textbox', { name: 'author:' })
  const url = screen.getByRole('textbox', { name: 'url:' })
  const sendButton = screen.getByRole('button', { name: 'create' })

  await user.type(title, 'The title')
  await user.type(author, 'me')
  await user.type(url, 'some.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('The title')
  expect(createBlog.mock.calls[0][0].author).toBe('me')
  expect(createBlog.mock.calls[0][0].url).toBe('some.com')
})