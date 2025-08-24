const Notification = ({ message, error }) => {
    const notificationstyle = {
        color: error ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    if (message === null ) {
        return null
    }

    return ( 
        <div style={notificationstyle} className="error">
            {message}
        </div>
    )
}

export default Notification