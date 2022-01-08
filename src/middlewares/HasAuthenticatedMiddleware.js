const jwt = require("jsonwebtoken")
const Constantes = require("../constants/App")
const cache  = require("../cache/cache")

const hasAuthenticated = async (request, response, next) => {
    let accessToken = request.get(Constantes.HEADER_PARAM_AUTH);
    if (accessToken == null || accessToken.length == 0) {
        return response.status(401).json({
            message: "You need pass accessToken when make request!"
        });
    }

    try  {
        const hasTokenInBlacklist = await cache.get(accessToken)
        if (hasTokenInBlacklist) {
            return response.status(403).json({ message: "Token invalid!" });
        }
        accessToken = accessToken.replace(Constantes.HEADER_PREFIX_TOKEN, "")
        await jwt.verify(accessToken, process.env.SECRET)
    } catch(error) {
        return response.status(403).json({ message: "Token invalid!" });
    }

    return next();
}

module.exports = hasAuthenticated;