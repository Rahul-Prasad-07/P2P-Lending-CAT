'use strict';

// npm modules that need for this project

const http=require('http');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config/config.js');
const app = express();
const cors = require('cors');
const MyLogger = require("./tools/logging"); // Init Logging
const routes = require('./routes/index');

// create HTTP server
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json()) // to support json encoded bodies
app.use(bodyParser.urlencoded({extended:true})) // to support Url-encoded bodies

// logging
if(config.env ==="ddevelopment"){app.use(logger('dev'))}
else if(config.env === "staging"){ app.use(logger)('dev')}
else if(config.env === "production"){app.use(logger('combined'))}
console.log("---------------------------");
console.log("Environment ==========>",config.env, "<==========")

// HTTP Handlers : exposing sertain routes --> inside  routes file
app.use('/',routes);

// 404
app.get('*', function(req,res){
  res.status(404).send({})
});

// start server at specific server --> define inside config file
server.listen(config.server.port, config.server.host, ()=>{
  console.log("---------------------");
  console.log('listening on http://' + (config.server.host) + ":" + (config.server.port));
})


module.export = app;