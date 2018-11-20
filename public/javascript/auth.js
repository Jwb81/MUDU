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
// let startFunctionsRan = false;

// const setAuthChangeListener = (functionArr) => {
//     firebase.auth().onAuthStateChanged(function (firebaseUser) {
//         user = firebaseUser;
//         if (firebaseUser) {
//             user = firebaseUser;
//             if (!startFunctionsRan) {
//                 functionArr.forEach(func => func());
//                 startFunctionsRan = true;
//             }

//         } else {
//             user = null;
//             console.log('not logged in')
//         }
//     });

// }


const login = (email, password, cb) => {
    // const promise = auth.signInWithEmailAndPassword(email, pass);
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            cb({
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
    auth.signOut();
}

const signup = (firstName, lastName, username, email, password, age, cb) => {
    // check if username is taken
    $.ajax({
        method: 'POST',
        url: `/new-user`,
        data: {
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            age
        }
    }).then(data => {
        console.log(data);
        if (!data.success) {
            // username is taken
            return cb({
                success: false,
                message: 'Username already taken'
            })
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                firebase.auth().currentUser.updateProfile({
                    displayName: username
                })
                return cb({
                    success: true
                });
            })
            .catch(e => {
                console.log(e);
                return cb({
                    success: false,
                    message: e.message
                })
            });

    })


}

const getUser = () => {
    return new Promise((resolve, reject) => {
        user = firebase.auth().currentUser;
        resolve(user);
    })
}