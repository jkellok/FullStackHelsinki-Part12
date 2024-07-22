const Notification = ({ message, notificationClassName }) => {
    if (message === null) {
      return null
    }

    return (
      <div className={notificationClassName}>
        {message}
      </div>
    )
  }

  export default Notification