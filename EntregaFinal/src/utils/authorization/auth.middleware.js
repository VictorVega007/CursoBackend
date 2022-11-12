const authorizationLevel = 0

const authCheck = (authRequired) => {
    if (authorizationLevel <= authRequired) {
        return {  authorized: true }
    }
    return { authorized: false }
}

module.exports = { authCheck }