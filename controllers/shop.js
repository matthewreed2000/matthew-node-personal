const pool = require('../custom_modules/db').getPool();
const loginConfirm = require('./login-confirm');

// Writes HTTP response JSON
function run(req, res) {
  obj = loginConfirm.testSession(req);

  let callback = function(err, result) {
    if (err) {
      console.log('DB Error: ', err);
    }
    else {
      obj.items = result.rows;
    }
    res.render('pages/shop', obj);
  }

  const sql = "SELECT * FROM item_data";
  pool.query(sql, callback);
}

module.exports = {run}