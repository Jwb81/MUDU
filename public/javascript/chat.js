// use firebase config from auth.js file

const database = firebase.database();
let chatRef;
let initialMessageLoadDone = false;


const getChatKey = (me, them) => {
    // set 'chatting with' person at top of page
    $('#chatting-with').text(them);

    $.ajax({
        method: 'GET',
        url: `/chat-key/${me}/${them}`
    }).then(result => {

        console.log(`chat key: ${result.chat_key}`);

        if (result.chat_key) {
            // console.log(`found key: ${result.chat_key}`)

            // set chat key in cookies for later use
            sessionStorage.setItem('chat-key', result.chat_key);

            // set the chat room listener for new messages
            // setChatRoomListener(result.chat_key);

            // open the chat and set a listener
            getInitialMessages(result.chat_key);
            setChatRoomListener(result.chat_key);
            return;
        }



        // otherwise, create the chat and create a listener, and add the key to the database
        database.ref()
            .push({
                usernames: [me, them],
                chat: []
            })
            .then(snap => {
                console.log('new object pushed');
                
                // set the chat room listener for new messages
                // setChatRoomListener(snap.key);

                // add chat keys to s=cookies
                sessionStorage.setItem('chat-key', snap.chat_key);
                updateChatKey(me, them, snap.key);
                getInitialMessages(snap.key);
                setChatRoomListener(snap.key);
            })

        // updateChatKey(me, them, chatKey);
    })
}

const updateChatKey = (me, them, chatKey) => {
    $.ajax({
        method: 'PUT',
        url: '/chat-key',
        data: {
            me: me,
            them,
            them,
            chat_key: chatKey
        }
    }).then(response => {

    })
}

const getInitialMessages = (chatKey) => {
    chatRef = database.ref(`${chatKey}/chat`);

    // get all messages once
    chatRef.orderByChild('timeAdded').once('value', snap => {
        const info = snap.val();
        initialMessageLoadDone = true;

        // make sure there are messages to display
        if (!info) {
            return;
        }

        const messages = Object.keys(info).map(key => {
            return info[key];
        })

        messages.forEach(m => addMessageToPage(m));


    })



}


const setChatRoomListener = (chatKey) => {
    // get new messages as they arrive
    database.ref(`${chatKey}/chat`).orderByChild('timeAdded').limitToLast(1).on('child_added', snap => {
        if (!initialMessageLoadDone) {
            return;
        }

        const info = snap.val();

        addMessageToPage(info);

        console.log(info);
    })

}

const addMessageToPage = (messageObj) => {
    // get the username and style it
    let username = $('<span>').text(messageObj.username);
    if (messageObj.username == user.displayName) {
        username.addClass('blue-text');
    } else {
        username.addClass('red-text');
    }

    // get the message 
    let message = $('<span>').text(`: ${messageObj.message}`);

    // append the parts 
    let p = $('<p>')
        .append(username)
        .append(message);

    $('#chat-messages').append(p);
}

const pushMessage = (message) => {
    const chatKey = sessionStorage.getItem('chat-key');
    const username = user.displayName;

    if (!chatKey || !username) {
        return alert('Something went wrong...');
    }
    database.ref(`${chatKey}/chat`).push({
        username,
        message,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
}


// EVENT LISTENERS
$('#leave-chat').click(() => window.location = '/app');
$('#logout-app').click(() => {
    logout();
    window.location = '/';
})
$('#messages-form').submit((evt) => {
    // prevent the form from submitting
    evt.preventDefault();

    // get the message from the input box
    const newMessage = $('#message-input').val();
    // clear the input box
    $('#message-input').val('');
    // send the new message to Firebase
    pushMessage(newMessage);
})

// STARTUP FUNCTIONS
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    user = firebaseUser;
    if (firebaseUser) {
        let me = user.displayName;
        let them = sessionStorage.getItem('them');
        // put functions to run here
        getChatKey(me, them);
    } else {
        console.log('not logged in')
    }
});