const bcrypt = require('bcrypt');

function generate(seedString, callback) {
  let saltRounds = 10
  bcrypt.hash(seedString, saltRounds, (err, hash) => {
    if (!err) {
      callback(hash);
    }
    else {
      console.log('Hash Generate Error: ', err);
    }
  });
}

function compare(seedString, hash, callback) {
  bcrypt.compare(seedString, hash, (err, res) => {
    if (!err) {
      callback(res)
    }
    else {
      console.log('Hash Compare Error: ', err);
    }
  });
}

// console.log(generate('password', console.log));

module.exports = {generate, compare};