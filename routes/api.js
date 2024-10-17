"use strict";

const dbHandler = require("../queries/queries");

const apiUrl = "http://localhost:3001";

const db = new dbHandler(apiUrl);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const project = req.params.project;
      const query = req.query;

      db.getAllRecords(project, query, (err, data) => {
        if (err) {
          res.status(404).json({ error: err });
        }
        res.send(data);
      });
    })

    .post(function (req, res) {
      // console.log("§=>", req.params, req.body);

      const project = req.params.project;
      const body = req.body;
      db.createRecord(project, body, (err, data) => {
        if (err) {
          res.status(400).send({ error: err });
        }
        res.send(data);
      });
    })

    .put(function (req, res) {
      const project = req.params.project;
      const body = req.body;
      const _id = body._id;
      let newRecord = {};
      for (let key of Object.keys(body)) {
        if (body[key] != "") {
          newRecord[key] = body[key];
        }
      }
      db.updateRecord(project, _id, newRecord, (err, data) => {
        if (err) {
          const errResult = err._id
            ? { error: err.err, _id: err._id || "NO-ID" }
            : { error: err.err };
          res.status(400).send(errResult);
        }
        res.send({ result: "successfully updated", _id: _id });
      });
    })

    .delete(function (req, res) {
      const project = req.params.project;
      const _id = req.body._id;
      if (!_id) {
        res.status(400).send({ error: "missing _id" });
        return;
      }

      db.deleteRecord(project, _id, (err, data) => {
        if (err) {
          res.status(400).json({ error: "could not delete", _id: _id });
        }
        res.send({ result: "successfully deleted", _id: _id });
      });
    });
};
