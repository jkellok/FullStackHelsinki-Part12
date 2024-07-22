import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders todo text', () => {
  const todo = {
    text: "Testing Todo component",
    done: false
  }

  render(<Todo todo={todo} />)

  const element = screen.getByText('Testing Todo component')
  expect(element).toBeDefined()
})