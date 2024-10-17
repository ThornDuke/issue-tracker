"use strict";

function createId() {
  const hyphenated = function (str) {
    let result = str;
    result = result.substring(0, 16) + "-" + result.substring(16);
    result = result.substring(0, 25) + "-" + result.substring(25);
    result = result.substring(0, 34) + "-" + result.substring(34);
    return result;
  };

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
  result = result
    .split("")
    .map((char) => ({ sort: Math.random(), value: char }))
    .sort((prev, succ) => prev.sort - succ.sort)
    .map((item) => item.value)
    .join("");
  return hyphenated(result);
}

function hasRequiredFields(obj) {
  return obj.issue_title && obj.issue_text && obj.created_by;
}

function currDate() {
  return new Date(Date.now()).toISOString();
}

function dbHandler(apiUrl) {
  this.apiUrl = apiUrl;

  this.getAllRecords = function (project, query, done) {
    const queryContent = function (q) {
      if (JSON.stringify(q) == "{}") {
        return "";
      }
      return (
        "&" +
        Object.keys(q)
          .map((key) => `${key}=${q[key]}`)
          .join("&")
      );
    };
    const actualUrl = `${this.apiUrl}/issues?project=${project}${queryContent(query)}`;
    fetch(actualUrl)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => done(null, data))
      .catch((err) => done(err));
  };

  this.createRecord = function (project, record, done) {
    if (hasRequiredFields(record)) {
      const _id = createId();
      const date = currDate();
      record.project = project;
      record._id = _id;
      record.created_on = date;
      record.updated_on = date;
      record.open = true;
      fetch(this.apiUrl + "/issues", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(record),
      })
        .then((response) => {
          if (response.status >= 400) {
            // console.log("ERROR: =>", response);

            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => done(null, data))
        .catch((err) => done(err));
    } else {
      done("required field(s) missing");
    }
  };

  this.updateRecord = function (project, _id, record, done) {
    const date = currDate();
    if (Object.keys(record).length != 0 && _id == undefined) {
      done({ err: "missing _id" });
      return;
    }
    if (Object.keys(record).length == 1 && _id != undefined) {
      done({ err: "no update field(s) sent", _id: _id });
      return;
    }
    fetch(`${this.apiUrl}/issues/${_id}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (Object.keys(data).length == 0) {
          done("Invalid _id");
          return;
        }
        const updatedRecord = {
          ...data,
          ...record,
          project,
          updated_on: date,
        };
        fetch(`${this.apiUrl}/issues/${_id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(updatedRecord),
        })
          .then((response) => response.json())
          .then((data) => done(null, data))
          .catch((err) => done({ error: "could not update", _id: _id }));
      })
      .catch((err) => done(err));
  };

  this.deleteRecord = function (project, _id, done) {
    fetch(`${this.apiUrl}/issues/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => done(null, data))
      .catch((err) => done(err));
  };
}

module.exports = dbHandler;
