"use strict";

const DB = require("../queries/queries");

const apiUrl = "http://localhost:3001";

const db = new DB(apiUrl);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      db.getAllRecords(project, (err, data) => {
        if (err) {
          res.send("error fetching data => " + err);
        }
        res.send(data);
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
