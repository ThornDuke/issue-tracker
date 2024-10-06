"use strict";

const dbHandler = require("../queries/queries");

const apiUrl = "http://localhost:3001";

const db = new dbHandler(apiUrl);

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
      const body = req.body;
      db.createRecord(project, body, (err, data) => {
        if (err) {
          res.json({ error: err });
        }
        res.send(data);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      let body = req.body;
      console.log("§§§=>", body);

      let newRecord = {};
      for (let key of Object.keys(body)) {
        if (body[key] != "") {
          newRecord[key] = body[key];
        }
      }
      newRecord.id = body._id;
      delete newRecord._id;
      db.updateRecord(project, body._id, newRecord, (err, data) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.send(data);
        }
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
