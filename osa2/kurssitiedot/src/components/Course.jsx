const Header = (props) => {
  console.log(props)
  return <h2>{props.course}</h2>
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}

const Content = ({parts}) => {
  console.log("Content content", parts)
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
      <h4>total of { parts.map(e => e.exercises).reduce((sum, e) => sum + e, 0) } exercises</h4>
    </div>)
}


const Course = ({ course }) => {
  console.log("Course parts", course)
  return(<div>
    <Header course={course.name} />
    <Content parts={course.parts} />
  </div>  )
}

export default Course