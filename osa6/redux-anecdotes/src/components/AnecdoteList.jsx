import { useDispatch, useSelector } from 'react-redux'
import { likeAnecdote } from '../reducers/anecdoteReducer'


const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  return(
    <div>
      {anecdotes.sort((a,b)=> b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(likeAnecdote(anecdote.id))}>vote</button>
          </div>
        </div>
        )
    }
    </div> 
  )}

export default Anecdotes