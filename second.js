const { log } = require("console");
const EventEmitter = require("events");
const path = require("path");
express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

myEmitter = new EventEmitter();

myEmitter.on("eventname", (a) => {
  console.log(`its listening ${a}`);
});

myEmitter.emit("eventname", "helloworld");
