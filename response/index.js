const message = (content) => {
    return { "message": content }
}

const send = (res, status, content) => {
    res.status(status)
    res.json(content)
}

module.exports = { send, message }