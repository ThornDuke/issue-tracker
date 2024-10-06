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

  this.getAllRecords = function (done) {
    fetch(this.apiUrl + "/projects")
      .then((data) => data.json())
      .then((res) => done(null, res))
      .catch((err) => done(err));
  };
}

module.exports = db;
