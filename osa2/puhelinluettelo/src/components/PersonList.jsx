const Content = ({ person }) => {
  console.log('2')
  console.log(person)
  return (
    <div>
      <p>{person.name} {person.number} </p> 
    </div>
  )
}

const PersonList = ({ personlist, remove }) => {
  console.log(personlist)
  console.log('1')
  return(<div>
    {personlist.map(person => {
      return (
        <div key={`${person.name}3`}>
          <Content key={`${person.name}1`} person={person} /> 
          <button key={`${person.name}2`} onClick={() => remove(person.id)}>Delete</button>
        </div>
      )
    })}
    </div>)
}

export default PersonList