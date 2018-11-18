


  const textEmail = document.getElementById('txtEmail');
  const textPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUP');

  btnLogin.addEventListener('click', signUp => {

    const email = txtEmail.value;
    const pass = textPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    


    
    promise.catch(e => console.log(e.message));


  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log(firebaseUser);
    } else {
      console.log('not logged in')
    }
  });
