require("dotenv").config()
const express = require("express")
const jwt = require("jsonwebtoken")
const userFake = require("./mocks/User")
const Constantes = require("./constants/App")
const cache  = require("./cache/cache")
const token = require("./utils/Token")
const hasAuthenticated = require("./middlewares/HasAuthenticatedMiddleware")
const app = express()

app.use(express.json())

app.post("/auth/login", (request, response) => {
    const credentials = request.body;
    if (credentials.email != userFake.email || credentials.password != userFake.password) {
        return response.status(400).json({ message: 'Invalid credentials' })
    }

    const accessToken = token.generateAccessToken({ email: credentials.email })
    return response.json({ accessToken })
})

app.get("/auth/logout", hasAuthenticated, async (request, response) => {
    let accessToken = request.get(Constantes.HEADER_PARAM_AUTH);
    const timeExpiration = token.getTimeExpiration(accessToken);
    await cache.set(accessToken, true, timeExpiration)
    response.status(200).json({
        message: "Logout success!"
    })
})

app.get("/is-authenticated", hasAuthenticated, (request, response) => {
    return response.json({ message: "Hi, you are authenticated!" })
})


app.listen(3000, () => console.log("Server is running at: http://localhost:3000"))