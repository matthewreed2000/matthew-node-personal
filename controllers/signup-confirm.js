const hash = require('../custom_modules/hash');
const pool = require('../custom_modules/db').getPool();
const loginConfirm = require('./login-confirm');

// var pool = db.getPool();

// Writes HTTP response JSON
function run(req, res) {

  let failCallback = function() {
    // console.log("Fail Callback");
    res.json({success:false});
  }

  if (testParamsExists(req)) {
    if (typeof req.body.displayName !== 'undefined') {
      create(req.body.username, req.body.password, req.body.displayName, failCallback, (displayName=null) => { loginConfirm.setSession(req, res, displayName); });
    }
    else {
      create(req.body.username, req.body.password, null, failCallback, (displayName=null) => { loginConfirm.setSession(req, res, displayName); });
    }
  }
  else {
    failCallback();
  }
}

// Calls one of two callbacks
function create(username, password, displayName=null, failCallback, successCallback) {
  insertUserPassword(username, password, displayName, (success) => {
    if (success) {
      // console.log("insertUserPassword Success");
      successCallback(displayName);
    }
    else {
      // console.log("insertUserPassword Fail");
      failCallback();
    }
  });
}

// Returns bool
function testParamsExists(req) {
  if (typeof req.body !== 'undefined') {
    if ((typeof req.body.username !== 'undefined') &&
       (typeof req.body.password !== 'undefined')) {
      // console.log(req.body);
      return true;
    }
    // console.log(req.body);
  }
  return false;
  // console.log(1);
}

// Calls callback
function testUserExists(username, callback) {
  const sql = "SELECT id FROM user_data WHERE username = $1";
  const params = [username];

  pool.query(sql, params, (err, result) => {
    // console.log(result);
    if (result.rows[0]) {
      // console.log("Should return true");
      callback(true);
    }
    else {
      callback(false)
    }
  });
}

// Calls callback
function insertUserPassword(username, password, displayName=null, callback) {
  testUserExists(username, exists => {
    if (exists) {
      callback(false);
      return;
    }

    // console.log("User doesn't exist")

    hash.generate(password, hashPass => {
      let sql = "";
      let params = [];

      if (displayName) {
        // console.log("thing1");
        sql = "INSERT INTO user_data(username, password, display_name) VALUES ($1, $2, $3)";
        params = [username, hashPass, displayName];
      }
      else {
        // console.log("thing2");
        sql = "INSERT INTO user_data(username, password) VALUES ($1, $2)";
        params = [username, hashPass];
      }

      // console.log(sql);

      pool.query(sql, params, (err, response) => {
        if (err) {
          console.log("DB Error: ", err);
          callback(false);
        }
        else {
          callback(true);
        }
      });
    });
  });
}

module.exports = {run}