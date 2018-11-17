
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCvEGXGijfSUo6m-2s0GKS09ydr_Iz3BUA",
    authDomain: "beer-tinder.firebaseapp.com",
    databaseURL: "https://beer-tinder.firebaseio.com",
    projectId: "beer-tinder",
    storageBucket: "beer-tinder.appspot.com",
    messagingSenderId: "438524528610"
  };
  firebase.initializeApp(config);


  const textEmail = document.getElementById('txtEmail');
  const textPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUP');

  btnLogin.addEventListener('click', e => {

    const email = txtEmail.value;
    const pass = textPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    
    promise.catch(e => console.log(e.message));


  });