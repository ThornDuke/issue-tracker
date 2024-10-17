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
    test("Create issue with every field: POST", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send(everyFieldObj)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          done();
        });
    });
    test("Create issue with only required fields: POST", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send(requiredFieldsObj)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          done();
        });
    });
    test("Create issue with missing required fields: POST", function (done) {
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
    test("View issues on a project: GET", function (done) {
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
    test("View issues on a project with one filter: GET", function (done) {
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
    test("View issues on a project with multiple filters: GET", function (done) {
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
    test("Update one field on an issue: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "i82c6u17wnemwzm59fr7g81cevxa06qsoqectng1y8lu5425",
          issue_title: "Reassigned issue",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.equal(res.body["result"], "successfully updated");
          assert.equal(res.body["_id"], "i82c6u17wnemwzm59fr7g81cevxa06qsoqectng1y8lu5425");
          done();
        });
    });
    test("Update multiple fields on an issue: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "i82c6u17wnemwzm59fr7g81cevxa06qsoqectng1y8lu5425",
          issue_title: "Reassigned issue to multiple",
          assigned_to: "Giuanin Lafanà",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.exists(res.body);
          assert.equal(res.body["result"], "successfully updated");
          assert.equal(res.body["_id"], "i82c6u17wnemwzm59fr7g81cevxa06qsoqectng1y8lu5425");
          done();
        });
    });
    test("Update an issue with missing `_id`: PUT", function (done) {
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
          assert.equal(res.text, '{"error":"missing _id"}');
          done();
        });
    });
    test("Update an issue with no fields to update: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({ _id: "i82c6u17wnemwzm59fr7g81cevxa06qsoqectng1y8lu5425" })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, "i82c6u17wnemwzm59fr7g81cevxa06qsoqectng1y8lu5425");
          done();
        });
    });
    test("Update an issue with an invalid `_id`: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "zpj81x9d4ukie9a1",
          issue_title: "Reassigned issue",
          assigned_to: "Giuanin Lafanà",
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.isTrue(res.badRequest);
          done();
        });
    });
  });
  suite("Delete issue", function () {
    test("Delete an issue: DELETE", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Functional Test",
          issue_text: "Test delete of a just created record",
          created_by: "Duke",
        })
        .end(function (err, res) {
          const currId = res.body._id;
          chai
            .request(server)
            .delete("/api/issues/apitest")
            .send({ _id: currId })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully deleted");
              assert.equal(res.body._id, currId);
              done();
            });
        });
    });
    test("Delete an issue with an invalid `_id`: DELETE", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: "cippalippa",
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "cippalippa");
          done();
        });
    });
    test("Delete an issue with missing `_id`: DELETE", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
