const txtUsername = document.getElementById('txtUsername');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const loginError = document.getElementById('login-error');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnSingOut = document.getElementById('btnSignOut');

// Login Event
btnLogin.addEventListener('click', e => {
  // clear errors from before
  txtEmail.classList.remove('red-border');
  txtPassword.classList.remove('red-border');

  // logout any previous users
  // logout();

  const email = txtEmail.value;
  const pass = txtPassword.value;

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

  login(email, pass, response => {
    if (!response.success) {
      loginError.innerText = response.message;
      loginError.classList.remove('hidden');
      return;
    }
    console.log('going to app');
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
  loginError.classList.add('hidden');

  // logout any previous users
  // logout();

  const username = txtUsername.value;
  const email = txtEmail.value;
  const pass = txtPassword.value;

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

  signup(username, email, pass, response => {
    if (!response.success) {
      loginError.innerText = e.message;
      loginError.classList.remove('hidden');
      return;
    }

    window.location = '/app';
  })
});

btnLogout.addEventListener('click', e => {
  logout();
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