const Filter = ({newSearch, handler}) => {
    return (
        <div>
            <form>
                filter shown with <input value={newSearch} onChange={handler} />
            </form>
        </div>
    )
}

export default Filter