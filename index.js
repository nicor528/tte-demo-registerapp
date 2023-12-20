const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.client_secret,
  baseURL: process.env.url,
  clientID: process.env.clientID,
  issuerBaseURL: 'https://talktoeve.eu.auth0.com'
};

const port = process.env.PORT || 3000;


const app = express();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get("/test", (req, res) => {
  res.send("test ok")
})

app.get("/try-login", (req, res) => {
  const token = req.query.token;
  if(token == process.env.auth_token){
    res.redirect(`${process.env.url}/login`);
  }else{
    res.status(404).send({message: "Bad auth_token", status: false})
  }
})

/*
app.get('/callback', (req, res) => {
  // Autenticación y generación de token aquí...
  const token = generarToken();  // Lógica para generar el token
  res.redirect(`http://localhost:3000/registro?token=${token}`);
});*/

/*
app.get("/callback", (req, res) => {
  console.log("test")
})*/

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  console.log(req.oidc.user)
  //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  if(req.oidc.isAuthenticated()){
    res.redirect(`frontend?nickname=${req.oidc.user.nickname}&email=${req.oidc.user.email}`)
    //res.status(200).send({status: true, message: "ok", user: {nickname : req.oidc.user.nickname, email: req.oidc.user.email}})
  }else{
    res.redirect(`${process.env.url}/login`);
  }
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
