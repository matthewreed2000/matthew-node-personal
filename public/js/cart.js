function removeFromCart(button, id) {
  let url = '/removeCartItem?id=' + id;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let obj = JSON.parse(this.responseText);
      console.log(obj);
      if (obj.success) {
        onSuccess();
      }
      else {
        onFail();
      }
    }
  };

  let onSuccess = function() {
    parent = button.parentNode.parentNode;
    parent.classList = 'hidden';
    button.onclick = function(){};
  };

  let onFail = function() {
    button.innerHTML = 'Failed';
    button.style.backgroundColor = '#553333';
  };

  xhttp.open("GET", url, true);
  // xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send();
}