function submitForm(e) {
  e.preventDefault();
  var formData = new FormData(document.getElementById('signupForm'));

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let obj = JSON.parse(this.responseText);
      if (obj.success) {
        succeedSignup();
      }
      else {
        failSignup(document.getElementById("signupInfoUser"));
      }
    }
  };

  if (formData.get('password') == formData.get('password-valid')) {
    let obj = {username: formData.get('username'),
       password: formData.get('password')}
    if (formData.get('display-name') != '') {
      obj.displayName = formData.get('display-name');
    }

    xhttp.open("POST", 'signup-confirm', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(obj));
  }
  else {
    failSignup(document.getElementById("signupInfoPass"));
  }
  // xhttp.send(formData);
}

function succeedSignup() {
  location.replace('/');
}

function failSignup(infoField) {
  // console.log('login failed');
  // form = document.getElementById("loginForm");
  userField = document.getElementById("signupUser");
  passField = document.getElementById("signupPass");
  passValidField = document.getElementById("signupPassValid");
  
  // form.classList.add("was-validated");
  // form.checkValidity();

  // infoField.classList.remove("invisible");
  infoField.style.display = "block";

  passField.classList.add("is-invalid");
  passValidField.classList.add("is-invalid");
  // passField.setAttribute("isvalid", "true");
  // passField.focus();

  userField.classList.add("is-invalid");
  userField.focus();
}

document.getElementById("signupForm").addEventListener("submit", submitForm);
// document.getElementById("loginButton").addEventListener("click", submitForm);