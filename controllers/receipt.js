const pool = require('../custom_modules/db').getPool();
const loginConfirm = require('./login-confirm');
const calcTotal = require('../custom_modules/calc-total');

// Writes HTTP response JSON
function run(req, res) {
  obj = loginConfirm.testSession(req);

  let callbackSelect = function(err, result) {
    if (err) {
      console.log('DB Error: ', err);
      res.render('pages/receipt', obj);
    }
    else {
      obj.items = result.rows;

      if (typeof result.rows !== 'undefined' && result.rows.length > 0) {
        // Delete items in cart after purchase
        const sql = "\
        DELETE FROM cart c \
        USING user_data u \
        WHERE u.id = c.user_id \
        AND u.username = $1";
        const params = [obj.username];
        pool.query(sql, params, callbackDelete);

        // Display the right information to the receipt
        calcTotal.calcValues(result.rows, result => {
          obj.total = result.total;
          obj.tax = result.tax;
          obj.shipping = result.shipping;

          res.render('pages/receipt', obj);
        });
      }
      else {
        res.render('pages/receipt', obj);
      }
    }
  }

  let callbackDelete = function(err, result) {
    if (err) {
      console.log(err);
    }
    // console.log(result);
  }

  if (obj.success) {
    const sql = "\
    SELECT i.* FROM item_data i \
    INNER JOIN cart c ON i.id = c.item_id \
    INNER JOIN user_data u ON c.user_id = u.id \
    WHERE u.username = $1";
    const params = [obj.username];

    pool.query(sql, params, callbackSelect);
  }
  else {
    res.render('pages/receipt', obj);
  }
}

module.exports = {run}