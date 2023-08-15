const jwt = require('jsonwebtoken');
require('dotenv').config();
 
async function withTokenToUser(api_token){
    let data ;
    await jwt.verify(api_token, process.env.SECRET_KEY, (err, user) => {
        data = user
    })
    return data
}
module.exports = {
    withTokenToUser
};
