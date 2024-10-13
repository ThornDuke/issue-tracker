const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const everyFieldObj = {
  issue_title: "Issue aimed to test the test",
  issue_text: "POST this issue to see the test behavior",
  created_by: "Duke",
  assigned_to: "Duke",
  open: false,
  status_text: "Observing",
};

const requiredFieldsObj = {
  issue_title: "Only required fields",
  issue_text: "POST this issue to see the test behavior with a minimum number of fields",
  created_by: "Duke",
};

const missingRequiredFieldsObj = {
  issue_title: "Only required fields",
  created_by: "Duke",
};

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("Create issue", function () {
    test("Create issue with every field: test POST /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send(everyFieldObj)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "id");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          done();
        });
    });
    test("Create issue with only required fields: test POST /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send(requiredFieldsObj)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "id");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          done();
        });
    });
    test("Create issue with missing required fields: test POST /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send(missingRequiredFieldsObj)
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, '{"error":"required field(s) missing"}');
          done();
        });
    });
  });
  suite("View issue", function () {
    test("View issues on a project: `GET` request to `/api/issues/{project}`", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.isArray(res.body);
          done();
        });
    });
    test("View issues on a project with one filter: `GET` request to `/api/issues/{project}`", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest?open=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.isArray(res.body);
          done();
        });
    });
    test("View issues on a project with multiple filters: `GET` request to `/api/issues/{project}`", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest?open=true&created_by=Duke")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.isArray(res.body);
          done();
        });
    });
  });
  suite("Update issue", function () {
    test("Update one field on an issue: `PUT` request to `/api/issues/{project}`", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          id: "ptqdk7jcr324s739-g66od97a-ir0ytimo-xfl072llotm08vks",
          issue_title: "Reassigned issue",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.equal(res.body["issue_title"], "Reassigned issue");
          done();
        });
    });
    test("Update multiple fields on an issue: `PUT` request to `/api/issues/{project}`", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          id: "zpj81x9d4ukie9a1-0ivljhic-4n969i3s-eq7ji2uy8mierwbx",
          issue_title: "Reassigned issue",
          assigned_to: "Giuanin Lafanà",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.equal(res.body["issue_title"], "Reassigned issue");
          assert.equal(res.body["assigned_to"], "Giuanin Lafanà");
          done();
        });
    });
    test("Update an issue with missing `_id`: `PUT` request to `/api/issues/{project}`", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          issue_title: "Reassigned issue",
          assigned_to: "Giuanin Lafanà",
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, '{"error":"no id"}');
          done();
        });
    });
  });
});
