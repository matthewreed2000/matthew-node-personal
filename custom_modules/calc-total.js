function calcValues(items, callback) {
  let obj = {};
  let sum = 0;
  let count = 0;

  items.forEach(item => {
    sum += item.price;
    count++;
    if (count == items.length) {
      obj.tax = calcTax(sum);
      obj.shipping = calcShipping(sum);
      obj.total = sum + obj.tax + obj.shipping;

      callback(obj);
    }
  });
}

function calcTax(sum) {
  return sum * 0.06;
}

function calcShipping(sum) {
  return 0;
}

module.exports = {calcValues};