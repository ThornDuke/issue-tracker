const dbHandler = require("./queries/queries");

const db = new dbHandler("http://localhost:3001");

const rec = {
  issue_text: "Gently speaking can be better",
  created_by: "Rick Cavendish",
};
const id = "0aixmfcgd0a1vb0xtmztk9hkg8jrmv9uic667li7p040xgvh";

db.deleteRecord("apitest", "a0ujwyfyccfdjgy9n6rw12l99bsejp49yba6vevl2tlf0kwt", (err, data) =>
  console.log("*** =>", data)
);
// db.updateRecord("apitest", id, rec, (err, data) => console.log("***>", data));
// db.createRecord("apitest", rec, (err, data) => console.log("*** =>", err));
// db.getAllRecords("apitest", (err, data) => console.log("*** =>", data));
//
