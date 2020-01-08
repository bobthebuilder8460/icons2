const express = require("express");
const fetch = require("node-fetch");
const app = express();
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
init();


function init() {
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
  
  
  app.use((req, resq, next) =>{
    const now = new Date();
    const time = `${now.toLocaleDateString()} - $(now.toLocalTimeString()}`;
    const path = `$"{req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} -${path}`;
    
    console.log(m);
    next();
  });
  app.use(express.static("public"));
   const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
  });
}