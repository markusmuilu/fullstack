import axios from "axios"
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    console.log(request)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    const toreturn = request
    console.log(toreturn.data)
    return toreturn
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default {getAll, create, update, remove}