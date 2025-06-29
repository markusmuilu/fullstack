const PersonForm = ({ numval, numhandl, nameval, namehandl, adder }) => {
  
  return(<form onSubmit={adder}>
        <div>
          name: <input value={nameval} onChange={namehandl} />
        </div>
        <div>
          number: <input value={numval} onChange={numhandl} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

export default PersonForm