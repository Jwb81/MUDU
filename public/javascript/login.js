const txtUsername = document.getElementById('txtUsername');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const txtFirstname = document.getElementById('txtFirstName');
const txtLastName = document.getElementById('txtLastName');

const txtEmailLogin = document.getElementById('txtEmailLogin');
const txtPasswordLogin = document.getElementById('txtPasswordLogin');

// const txtZip = document.getElementById('txtZip');
const txtAge = document.getElementById('txtAge')
const loginError = document.getElementById('login-error');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
// const btnSignOut = document.getElementById('btnSignOut');
const toggleLoginForm = document.getElementById('toggle-login-forms');

// Login Event
btnLogin.addEventListener('click', e => {
  // clear errors from before
  txtEmail.classList.remove('red-border');
  txtPassword.classList.remove('red-border');

  // logout any previous users
  // logout();

  const email = txtEmailLogin.value;
  const pass = txtPasswordLogin.value;

  if (!email) {
    txtEmail.classList.add('red-border');
    loginError.innerText = `'Email' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  if (!pass) {
    txtPassword.classList.add('red-border');
    loginError.innerText = `'Password' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  // if (!age) {
  //   txtPassword.classList.add('red-border');
  //   loginError.innerText = `'Age' cannot be empty.`
  //   loginError.classList.remove('hidden');
  //   return;
  // }
  login(email, pass, response => {
    if (!response.success) {
      loginError.innerText = response.message;
      loginError.classList.remove('hidden');
      return;
    }
    // go to app if successful
    window.location = '/app';
  });
});


//Sign Up Event
btnSignUp.addEventListener('click', e => {
  // clear errors from before
  txtUsername.classList.remove('red-border');
  txtEmail.classList.remove('red-border');
  txtPassword.classList.remove('red-border');
  txtAge.classList.remove('red-border');

  loginError.classList.add('hidden');

  // logout any previous users
  // logout();

  const firstName = txtFirstname.value;
  const lastName = txtLastName.value;
  const username = txtUsername.value;
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const age = txtAge.value;

  if (!firstName) {
    txtFirstname.classList.add('red-border');
    loginError.innerText = `'First name' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  if (!lastName) {
    txtLastName.classList.add('red-border');
    loginError.innerText = `'Last Name' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  if (!username) {
    txtUsername.classList.add('red-border');
    loginError.innerText = `'Username' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  if (!email) {
    txtEmail.classList.add('red-border');
    loginError.innerText = `'Email' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  if (!pass) {
    txtPassword.classList.add('red-border');
    loginError.innerText = `'Password' cannot be empty.`
    loginError.classList.remove('hidden');
    return;
  }
  if (!age || isNaN(age)) {
    txtAge.classList.add('red-border');
    loginError.innerText = `'Age' must be a number.`
    loginError.classList.remove('hidden');
  }

  signup(firstName, lastName, username, email, pass, age, response => {
    if (!response.success) {
      loginError.innerText = response.message;
      loginError.classList.remove('hidden');
      return;
    }

    window.location = '/app';
  })
});

// btnLogout.addEventListener('click', e => {
//   logout();
// })

toggleLoginForm.addEventListener('click', (evt) => {
  const thisText = evt.currentTarget.innerText;

  // if its on the login form, switch to the signup form
  if (thisText == 'Signup instead?') {
    // change text
    evt.currentTarget.innerText = 'Login instead?';
    
    // hide the login form and show the signup form
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');

    // hide login button and show signup button
    document.getElementById('btnLogin').classList.add('hidden');
    document.getElementById('btnSignUp').classList.remove('hidden');
    return;
  }

  // change text
  evt.currentTarget.innerText = 'Signup instead?';
    
  // hide the login form and show the signup form
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');

  // hide login button and show signup button
  document.getElementById('btnLogin').classList.remove('hidden');
  document.getElementById('btnSignUp').classList.add('hidden');
})




// logout previous users on load
// logout();

// console.log(firebase.UserInfo())
firebase.auth().onAuthStateChanged(function (firebaseUser) {
  user = firebaseUser;
  if (firebaseUser) {

  } else {
    console.log('not logged in')
  }
});
