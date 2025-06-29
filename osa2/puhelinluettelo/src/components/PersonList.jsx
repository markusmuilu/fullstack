const Content = ({ person }) => {
  return (<p>{person.name} {person.number }</p>)
}

const PersonList = ({ personlist }) => {
  return(<div>
        {personlist.map(person => <Content key={person.name} person={person} />)}
    </div>)
}

export default PersonList