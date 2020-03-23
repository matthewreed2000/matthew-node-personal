const pool = require('../custom_modules/db').getPool();
const loginConfirm = require('./login-confirm');

function run(req, res) {
  userObj = loginConfirm.testSession(req);

  let callback = function(err, result) {
    if (err) {
      res.json({success:false, error:err});
    }
    else {
      res.json({success:true});
    }
  };

  if (testParamsExists(req)) {
    if (userObj.success) {
      const sqlGet = "SELECT id FROM user_data WHERE username = $1";
      const paramsGet = [obj.username];

      pool.query(sqlGet, paramsGet, function(err, result) {
        if (err) {
          res.json({success:false, error:err});
        }
        else if (typeof result.rows[0] !== 'undefined') {
          const sqlIns = "INSERT INTO cart (User_ID, Item_ID) VALUES ($1::int, $2::int)";
          const paramsIns = [result.rows[0].id, req.query.id];

          pool.query(sqlIns, paramsIns, callback);
        }
        else {
          res.json({success:false, err:"Nothing was returned from database for given username."});
        }
      });
    }
    else {
      res.json({success:false, err:"Session information invalid."});
    }
  }
  else {
    res.json({success:false, err:"Query information invalid."});
  }
}

// Returns bool
function testParamsExists(req) {
  if (typeof req.query !== 'undefined') {
    if (typeof req.query.id !== 'undefined') {
      // console.log(req.body);
      return true;
    }
    // console.log(req.body);
  }
  return false;
  // console.log(1);
}

module.exports = {run};