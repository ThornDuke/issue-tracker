"use strict";

function createId() {
  let result = "";
  const pool = "0123456789abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((char) => ({ sort: Math.random(), value: char }))
    .sort((prev, succ) => prev.sort - succ.sort)
    .map((item) => item.value)
    .join("");
  for (let i = 1; i <= 48; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const char = pool[index];
    result += char;
  }
  return result
    .split("")
    .map((char) => ({ sort: Math.random(), value: char }))
    .sort((prev, succ) => prev.sort - succ.sort)
    .map((item) => item.value)
    .join("");
}

function hasRequiredFields(obj) {
  return obj.issue_title && obj.issue_text && obj.created_by;
}

function currDate() {
  return new Date(Date.now()).toISOString();
}

function dbHandler(apiUrl) {
  this.apiUrl = apiUrl;

  this.getAllRecords = function (project, done) {
    fetch(this.apiUrl + "/" + project)
      .then((response) => {
        if (response.status == 404) {
          throw new Error("No data for the project '" + project + "'");
        }
        return response.json();
      })
      .then((data) => done(null, data))
      .catch((err) => done(err));
  };

  this.createRecord = function (project, record, done) {
    if (hasRequiredFields(record)) {
      const id = createId();
      const date = currDate();
      record.id = id;
      record.created_on = date;
      record.updated_on = date;
      record.open = true;

      fetch(this.apiUrl + "/" + project, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(record),
      })
        .then((response) => response.json())
        .then((data) => done(null, data))
        .catch((err) => done(err));
    } else {
      done("required field(s) missing");
    }
  };

  this.updateRecord = function (project, id, record, done) {
    const date = currDate();
    fetch(this.apiUrl + "/" + project + "/" + id)
      .then((response) => response.json())
      .then((data) => {
        const updatedRecord = {
          ...data,
          ...record,
          updated_on: date,
        };
        fetch(this.apiUrl + "/" + project + "/" + id, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(updatedRecord),
        })
          .then((response) => response.json())
          .then((data) => done(null, data))
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  };

  this.deleteRecord = function (project, id, done) {
    fetch(this.apiUrl + "/" + project + "/" + id, { method: "DELETE" })
      .then((response) => {
        return response.json();
      })
      .then((data) => done(null, data))
      .catch((err) => done(err));
  };
}

module.exports = dbHandler;
