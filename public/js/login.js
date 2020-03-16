function submitForm(e) {
  e.preventDefault();
  var formData = new FormData(document.getElementById('loginForm'));

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let obj = JSON.parse(this.responseText);
      if (obj.success) {
        succeedLogin();
      }
      else {
        failLogin();
      }
    }
  };
  xhttp.open("POST", 'login-confirm', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(
    {username: formData.get('username'),
     password: formData.get('password')}
    ));
  // xhttp.send(formData);
}

function succeedLogin() {
  location.replace('/');
}

function failLogin() {
  // console.log('login failed');
  // form = document.getElementById("loginForm");
  userField = document.getElementById("loginUser");
  passField = document.getElementById("loginPass");
  infoField = document.getElementById("loginInfo");

  // form.classList.add("was-validated");
  // form.checkValidity();

  // infoField.classList.remove("invisible");
  infoField.style.display = "block";

  passField.classList.add("is-invalid");
  // passField.setAttribute("isvalid", "true");
  // passField.focus();

  userField.classList.add("is-invalid");
  userField.focus();
}

document.getElementById("loginForm").addEventListener("submit", submitForm);
// document.getElementById("loginButton").addEventListener("click", submitForm);