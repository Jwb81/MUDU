  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCvEGXGijfSUo6m-2s0GKS09ydr_Iz3BUA",
    authDomain: "beer-tinder.firebaseapp.com",
    databaseURL: "https://beer-tinder.firebaseio.com",
    projectId: "beer-tinder",
    storageBucket: "beer-tinder.appspot.com",
    messagingSenderId: "438524528610"
  };
  firebase.initializeApp(config);

  const txtUsername = document.getElementById('txtUsername');
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const loginError = document.getElementById('login-error');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnSingOut = document.getElementById('btnSignOut');
  let user; // holds the current user


  // Login Event
  btnLogin.addEventListener('click', e => {
    // clear errors from before
    txtEmail.classList.remove('red-border');
    txtPassword.classList.remove('red-border');

    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

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

    const promise = auth.signInWithEmailAndPassword(email, pass);

    promise.catch(e => console.log(e.message));

  });


  //Sign Up Event
  btnSignUp.addEventListener('click', e => {
    // clear errors from before
    txtUsername.classList.remove('red-border');
    txtEmail.classList.remove('red-border');
    txtPassword.classList.remove('red-border');
    loginError.classList.add('hidden');

    const username = txtUsername.value;
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

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

    auth.createUserWithEmailAndPassword(email, pass)
      .then(user => {
        firebase.auth().currentUser.updateProfile({
          displayName: username
        })
      })
      .catch(e => {
        console.log(e.message);
        loginError.innerText = e.message;
        loginError.classList.remove('hidden');
      });
  });

  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  })


  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      user = firebaseUser;
      console.log(firebaseUser);
      // btnLogout.classList.remove('hide')
    } else {
      user = null;
      console.log('not logged in')
    }
  });

  // console.log(firebase.UserInfo())