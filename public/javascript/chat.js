// use firebase config from auth.js file

const database = firebase.database();


const getChatKey = (evt) => {
    const me = user.displayName;
    const them = $(evt.currentTarget).data('username');

    $.ajax({
        method: 'GET',
        url: `/chat-key/:me/:them`
    }).then(result => {
        if (result.success) {
            // open the chat and set a listener
            
            return;
        }

        // otherwise, create the chat and create a listener, and add the key to the database

    })
}

const updateChatKey = () => {
    
}