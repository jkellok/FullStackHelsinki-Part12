const Person = ({ person, number, deletePerson }) => {
    const label = 'delete'

    return (
        <div>
            {person} {number}
            <button onClick={deletePerson}>{label}</button>
        </div>
    )
}
export default Person