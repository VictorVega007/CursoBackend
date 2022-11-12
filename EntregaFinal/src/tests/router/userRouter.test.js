const assert = require('assert').strict
const { testLogin } = require('./axiosUserRouter')

describe('Test User Router', () => {
    it('Login test', async () => {
        const userOk = {
            username: 'victorvega.v@gmail.com',
            password: 'Victor1234'
        }
        const resp = await testLogin(userOk)
        
        assert.equal(resp.message, 'Sesion iniciada con exito')
    })
})