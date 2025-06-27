const Header = (props) => {
  console.log(props)
  return <h1>{props.course}</h1>
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

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App