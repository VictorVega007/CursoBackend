const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 8080

const userOk = {
    username: 'victorvega.v@gmail.com',
    password: 'Victor1234'
}

const userNok = {
    username: 'victorvega.v@gmail.com',
    password: 'Victor123'
}

const newUser = {
    nombre: 'Victor',
    apellido: 'Vega',
    username: 'victorvega',
    password: 'VictorV1234',
    edad: 36,
    direccion: 'Avenida Corriente 1324',
    telefono: 56936547654,
    foto: 'google.com'
}

const testLogin = async (user) => {
    let ans = null
    await Promise.resolve(axios.post(`http://localhost:${PORT}/users/login`, user))
        .then(res => {
            ans = res.data
        })
        .catch(error => { return error.message })
    
        return ans
}

const testUserInfo = user => {
    axios.post(`http://localhost:${PORT}/users/login`, user)
        .then(res => {
            return axios.get(`http://localhost:${PORT}/users/info`,
                {
                    headers: { 'cookie': res.headers['set-cookie'] }
                }
            )
        })
        .then(res => {
            console.log('SUCCESS')
        })
        .catch(error => {
            console.error('FAILED ', error.message)
        })
}

const testLogout = user => {
    axios.post(`http://localhost:${PORT}/users/login`, user)
        .then(res => {
            return axios.post(`http://localhost:${PORT}/users/logout`,
                {
                    headers: { 'cookie': res.headers['set-cookie'] }
                }
            )
        })
        .then(res => {
            console.log('SUCCESS: ', res.data.messsage)
        })
        .catch(error => {
            console.error('FAILED: ', error.message)
        })
}

module.exports = { testLogin }