const pool = require('../custom_modules/db').getPool();
const loginConfirm = require('./login-confirm');
const calcTotal = require('../custom_modules/calc-total');

// Writes HTTP response JSON
function run(req, res) {
  obj = loginConfirm.testSession(req);

  let callback = function(err, result) {
    if (err) {
      console.log('DB Error: ', err);
      res.render('pages/confirm', obj);
    }
    else {
      obj.items = result.rows;

      if (typeof result.rows !== 'undefined') {
        calcTotal.calcValues(result.rows, result => {
          obj.total = result.total;
          obj.tax = result.tax;
          obj.shipping = result.shipping;

          res.render('pages/confirm', obj);
        });
      }
      else {
        res.render('pages/confirm', obj);
      }
    }
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
    res.render('pages/confirm', obj);
  }
}

module.exports = {run}