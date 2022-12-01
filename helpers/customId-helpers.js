const customId = (length = 5, firstletter = '') => {
    let inputs = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ'

    let randomString = '';
    for (var i, i = 0; i < length; i++) {
        randomString += inputs.charAt(Math.floor(Math.random() * inputs.length))
    }
    return firstletter + randomString
}

module.exports = { customId }