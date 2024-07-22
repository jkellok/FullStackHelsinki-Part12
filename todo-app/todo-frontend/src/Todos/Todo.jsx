const Todo = ({ todo }) => {
  return(
    <>
      <span className='todo-text'>
        {todo.text}
      </span>
    </>
  )
}

export default Todo