function formatMessage(username, text){
    return {
        username,
        text,
        arguments,
        time
    };
}
module.exports = formatMessage;