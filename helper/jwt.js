const { expressjwt: jwt } = require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return jwt({
        secret: secret,
        algorithms:['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
             {url: /\/public\/uploads(.*)/, method: ['GET', 'OPTIONS']},
            //  {url: /\/api\/v1\/product(.*)/, method: ['GET', 'OPTIONS']},
             {url: /\/api\/v1\/category(.*)/, method: ['GET', 'OPTIONS']},
             {url: /\/api\/v1\/user(.*)/, method: ['PUT', 'OPTIONS']},
            `${api}/user/login`,
            `${api}/user/register`,
            `${api}/products`
           
        ]
    });
};
async function isRevoked(req, token){
    if(!token.payLoad.isAdmin){
        return true;
    }

    return undefined;
}

module.exports = {
    authJwt,
};