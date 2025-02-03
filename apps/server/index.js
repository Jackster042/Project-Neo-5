const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

const errorController = require("./controllers/errorController");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(logger("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));

//  ROUTES
app.get("/", (req, res) => res.send("Hello Project NEO 5"));

// 404 HANDLER
app.use((req, res, next) => {
  return res.status(400).json({ message: "Page not found" });
});

//  GENERAL ERROR HANDLER
app.use(errorController);

module.exports = app;
