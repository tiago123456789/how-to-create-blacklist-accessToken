const jwt = require("jsonwebtoken")

module.exports = {

    generateAccessToken(data) {
        return jwt.sign(data, process.env.SECRET, { expiresIn: process.env.EXPIRATION_TIME });
    },

    getValueByKeyInPayload(key, accessToken) {
        let payload = accessToken.split(".")[1]
        payload = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"))
        return payload[key] || null
    },

    getTimeExpiration(accessToken) {
        const exp = this.getValueByKeyInPayload("exp", accessToken)
        let timeExpiration = exp * 1000 - Date.now();
        timeExpiration = timeExpiration / 1000;
        timeExpiration = Math.ceil(timeExpiration);
        return timeExpiration;
    }
}