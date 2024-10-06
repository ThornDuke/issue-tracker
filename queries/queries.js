"use strict";

function createId() {
  let result = "";
  const pool = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 1; i <= 48; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const char = pool[index];
    result += char;
  }
  return result;
}

function db(apiUrl) {
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
}

module.exports = db;
