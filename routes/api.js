"use strict";

const dbHandler = require("../queries/queries");

const apiUrl = "http://localhost:3001";

const db = new dbHandler(apiUrl);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const project = req.params.project;
      db.getAllRecords(project, (err, data) => {
        if (err) {
          res.json({ error: err });
        }
        res.send(data);
      });
    })

    .post(function (req, res) {
      const project = req.params.project;
      const body = req.body;
      db.createRecord(project, body, (err, data) => {
        if (err) {
          res.json({ error: err });
        }
        res.send(data);
      });
    })

    .put(function (req, res) {
      const project = req.params.project;
      const body = req.body;
      let newRecord = {};
      for (let key of Object.keys(body)) {
        if (body[key] != "") {
          newRecord[key] = body[key];
        }
      }
      db.updateRecord(project, body._id, newRecord, (err, data) => {
        if (err) {
          res.json({ error: err });
        }
        res.send(data);
      });
    })

    .delete(function (req, res) {
      const project = req.params.project;
      const id = body.id;
      db.deleteRecord(project, id, (err, data) => {
        if (err) {
          res.json({ error: err });
        }
        res.send(data);
      });
    });
};
