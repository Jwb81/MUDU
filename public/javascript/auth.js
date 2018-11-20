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


// let user = null;
const auth = firebase.auth();
let user;

firebase.auth().onAuthStateChanged(function (firebaseUser) {
    user = firebaseUser;
    if (firebaseUser) {
        user = firebaseUser;
        // console.log(firebaseUser);
        // btnLogout.classList.remove('hide')

        // go to app page
        // window.location = '/app';
    } else {
        user = null;
        console.log('not logged in')
    }
});


const login = (email, password, cb) => {
    // const promise = auth.signInWithEmailAndPassword(email, pass);
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            return cb({
                success: true
            })
        })
        .catch(e => {
            cb({
                success: false,
                message: e.message
            })
        });
}

const logout = () => {
    console.log('logging out');
    auth.signOut();
}

const signup = (username, email, password, cb) => {
    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            firebase.auth().currentUser.updateProfile({
                displayName: username
            })
            cb({
                success: true
            });
        })
        .catch(e => {
            console.log(e.message);
            cb({
                success: false,
                message: e.message
            })
        });
}

const getUser = () => {
    return new Promise((resolve, reject) => {
        user = firebase.auth().currentUser;
        resolve();
    })
}