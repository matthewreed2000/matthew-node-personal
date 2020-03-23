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
    res.render('pages/cart', obj);
  }

  if (obj.success) {
    const sql = "\
    SELECT i.* FROM item_data i \
    INNER JOIN cart c ON i.id = c.item_id \
    INNER JOIN user_data u ON c.user_id = u.id \
    WHERE u.username = $1";
    const params = [obj.username];

    pool.query(sql, params, callback);
  }
  else {
    res.render('pages/cart', obj);
  }
}

module.exports = {run}