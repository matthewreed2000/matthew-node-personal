const hash = require('../custom_modules/hash');
const pool = require('../custom_modules/db').getPool();

// var pool = db.getPool();

// Writes HTTP response JSON
function run(req, res) {

  let failCallback = function() {
    res.json({success:false});
  }

  let successCallback = function(displayName=null) {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    if (displayName == null) {
      req.session.displayName = req.session.username;
    } else {
      req.session.displayName = displayName;
    }

    res.json({success:true});
  }

  if (testParamsExists(req)) {
    testUserPassword(req.body.username, req.body.password, failCallback, successCallback);
    // getUserPassword(req.body.username, (err, result) => {
    //   if (err) {
    //     console.log('DB Error: ', err);
    //   }
    //   else if (result.rows[0]) {
    //     hash.compare(req.body.password, result.rows[0].password, (testResult) => {
    //       if (testResult) {
    //         req.session.mnpUsername = req.body.username;
    //         req.session.mnpPassword = req.body.password;
    //         res.json({success:true});
    //       }
    //       else {
    //         res.json({success:false});
    //       }
    //     });
    //   }
    //   else {
    //     res.json({success:false});
    //   }
    // });
  }
  else {
    failCallback();
  }
}

// Tests session, returns JSON
function testSession(req) {
  obj = {success: false};

  if (req.session.username
    && req.session.password
    && req.session.displayName) {
    obj.success = true;
    obj.username = req.session.username;
    obj.displayName = req.session.displayName;
  }

  return obj;
}

// Calls one of two callbacks
function testUserPassword(username, password, failCallback, successCallback) {
  getUserPassword(username, (err, result) => {
    if (err) {
      console.log('DB Error: ', err);
    }
    else if (result.rows[0]) {
      hash.compare(password, result.rows[0].password, (testResult) => {
        if (testResult) {
          if (result.rows[0].display_name){
            successCallback(result.rows[0].display_name);
          } else {
            successCallback();
          }
        }
        else {
          failCallback();
        }
      });
    }
    else {
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
function getUserPassword(username, callback) {
  const sql = "SELECT password, display_name FROM user_data WHERE username = $1";
  const params = [username];

  pool.query(sql, params, callback);
}

module.exports = {run, testSession}