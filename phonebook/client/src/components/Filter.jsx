const Filter = ({ searchValue, handleSearchChange }) => (
    <form>
      <div>
        filter shown with <input
          value={searchValue}
          onChange={handleSearchChange} />
      </div>
    </form>
  )

  export default Filter