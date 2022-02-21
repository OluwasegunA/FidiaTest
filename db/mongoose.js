/**
 * Creates connection with the local mongodb
 * on "monitor" database
 */
 const mongoose = require('mongoose');
 require("dotenv").config();

 const mongoConnectionUrl = process.env.NODE_ENV == "dev"  ?   `mongodb://${process.env.MDB_HOST}:${process.env.MDB_PORT}/${process.env.MDB_DB}` : process.env.MDB_HOST;
 
 console.log("mongoConnectionUrl :: ", mongoConnectionUrl);
 //mongoose.set('useCreateIndex', true);
 mongoose.connect(mongoConnectionUrl, {
   user: process.env.MDB_USER,
   pass: process.env.MDB_PASS,
   keepAlive: 1,
   connectTimeoutMS: 300000,
   useNewUrlParser: true,
   useUnifiedTopology: true
 });
 
 const db = mongoose.connection;
 
 db.on('error', console.error.bind(console, 'connection error:'));
 mongoose.set('debug', true);
 
 exports.mongoose = mongoose;
 