// get more cards from the server
//returns beers that are not seen by the user
const getUnmatchedBeers = () => {
    const username = 'jay'; // get username here
    $.ajax({
        method: 'GET',
        url: `/unmatched-beers/${username}`
    }).then(beers => {
        beers.forEach((beer, idx) => {
            const newCard = createBeerCard(beer);

            // hide all card except for the first
            if (idx) {
                newCard
                    .addClass('hidden');
            }

            // Append to the card container
            $('#card-container')
                .append(newCard);

        })

    })
};

// create accordion for matched beers
//includes ajax returns beers that are liked by the user
const getMatchedBeers = () => {
    const username = 'jay';
    $.ajax({
            method: 'GET',
            url: `/matched-beers/${username}`
        }).then(beers => {
            Array.from(beers).forEach(beer => {
                //panel is hidden at start
                //accoridan shows alls the beers requested that are liked, accordian drops down info and creates the button and the panel that opens
                const newLayer = createAccordionLayer(beer);
                $('#beer-matches').append(newLayer);
            })
        })
        .catch(err => {
            console.log(err);
        })
}

// get drinking buddies for this user
const getDrinkingBuddies = () => {
    const username = 'jay';

    $.ajax({
        method: 'GET',
        url: `/drinking-buddies/${username}`
    }).then(result => {
        console.log(result.data);
        result.data.forEach(buddy => {
            const newBuddyLayer = createBuddyLayer(buddy);

            $('#buddy-matches').append(newBuddyLayer);
        })
    })
}

// create beer cards
const createBeerCard = (beer) => {
    // create card div
    const card = $('<div>')
        .addClass('card')
        .data('beer-id', beer.id);


    // IMAGE -------------------------------------------------
    const cardImage = $('<img>')
        .addClass('card-img-top beer-image ')
        .attr('src', beer.labels ? beer.labels.large || beer.labels[0] : './images/no_image_available.png');



    // BODY ----------------------------------------------------
    const cardBody = $('<div>');

    const cardTitle = $('<h4>')
        .text(beer.name);

    const cardBodyText = $('<p>')
        .addClass('card-text')
    // .text(beer.description || 'No description provided')

    const infoPanel = $('<div>')
        .addClass('hidden info-panel')
        .text(beer.description || 'No description provided...');
    //if beer description is avalible it takes the beer description, if not return string 

    cardBody
        .append(cardTitle)
        .append(cardBodyText)
        .append(infoPanel);


    // LIST ----------------------------------------------------
    const list = $('<ul>')
        .addClass('list-group list-group-flush');

    const abv = $('<li>')
        .addClass('list-group-item')
        .text('ABV: ' + beer.abv || '');

    const category = $('<li>')
        .addClass('list-group-item')
        .text('Category: ' + (beer.style ? beer.style.category.name : '-')); // inline if state statement (ternerary operator), if statement ,?, if true, , if fals

    list
        .append(abv)
        .append(category);


    // BUTTONS -------------------------------------------------- 
    const buttonsContainer = $('<div>')
        .addClass('card-body center absolute-bottom');

    const buttonLike = $('<button>')
        .addClass('btn btn-success')
        .text('Bottoms Up')
        .data('beer-id', beer.id)
        .data('match', true)
        .click(handleBeerSelection);

    const buttonDislike = $('<button>')
        .addClass('btn btn-danger')
        .text('No Thanks...')
        .data('beer-id', beer.id)
        .data('match', false)
        .click(handleBeerSelection);

    buttonsContainer
        .append(buttonLike)
        .append(buttonDislike);

    const infoButton = $('<img>')
        .addClass('info-image')
        .attr('src', './images/info.png')
        .click(toggleInfoPanel);


    // FINISH -----------------------------------------------------
    card
        .append(cardImage)
        .append(cardBody)
        .append(list)
        .append(buttonsContainer)
        .append(infoButton);

    return card;
}


const handleBeerSelection = (evt) => {
    // get the beer id
    const beerID = $(evt.currentTarget).data('beer-id');
    const username = 'jay';
    const match = $(evt.currentTarget).data('match');

    // send the match to the database
    $.ajax({
        method: 'POST',
        url: '/beer-match',
        data: {
            username,
            beer_id: beerID,
            match
        }
    })

    const allCards = $('.card');
    $(allCards[0]).remove(); // remove current card
    if (allCards.length > 1) {
        $(allCards[1]).removeClass('hidden'); // show the next card
    } else {
        getUnmatchedBeers();
    }
}

const toggleInfoPanel = () => {
    const thisCard = $('.card')[0];
    const panel = $(thisCard).find('.info-panel');

    $(panel).hasClass('hidden') ? $(panel).removeClass('hidden') : $(panel).addClass('hidden');

}


const createAccordionLayer = (match) => {
    const button = $('<button>')
        .addClass('accordion')
        .text(match.name)
        .click(handleAccordionEvent);

    const dropdown = $('<div>')
        .addClass('panel');

    const abv = $('<p>')
        .html(`<strong>ABV</strong>: ${match.abv || '-'}`);

    const category = $('<p>')
        .html(`<strong>Category:</strong> ${match.style ? match.style.category.name : '-'}`);

    const description = $('<p>')
        .text(match.description ? match.description : 'Description unavailable...');

    const brewery = $('<p>')
        .html(`<strong>Brewery</strong>: ${match.breweries ? match.breweries[0].name : '-'}`);

    const removeButton = $('<button>')
        .addClass('btn btn-danger')
        .data('beer-id', match.id)
        .text(`I don't like this anymore`)
        .click(handleRemoveMatch);

    // append each layer
    $(dropdown)
        .append(abv)
        .append(category)
        .append(brewery)
        .append(description)
        .append(removeButton)

    return $('<div>')
        .append(button)
        .append(dropdown);
}


// create new card for matched buddies
const createBuddyLayer = buddy => {
    const button = $('<button>')
        .addClass('accordion')
        .text(`${buddy.first_name} ${buddy.last_name}`)
        .click(handleAccordionEvent);

    const dropdown = $('<div>')
        .addClass('panel');

    const username = $('<p>')
        .html(`<strong>Username:</strong> ${buddy.username || '-'}`);

    const age = $('<p>')
        .html(`<strong>AGE</strong>: ${buddy.age || '-'}`);

    const chatButton = $('<button>')
        .addClass('btn btn-info')
        .data('buddy-username', buddy.username)
        .text(`Chat with them!`)
        .click(handleChatEvent);

    // append each layer
    $(dropdown)
        .append(age)
        .append(username)
        .append(chatButton)

    return $('<div>')
        .append(button)
        .append(dropdown);
}


const handleRemoveMatch = (evt) => {
    const beerID = $(evt.currentTarget).data('beer-id');
    const username = 'jay';

    $.ajax({
        method: 'PUT',
        url: '/beer-match',
        data: {
            username,
            beer_id: beerID,
            match: false
        }
    }).then(result => {
        // remove this button and the panel from the page
        evt.currentTarget.parentElement.previousSibling.remove();
        evt.currentTarget.parentElement.remove();
    })
}


const handleAccordionEvent = (evt) => {
    // get this layer
    const thisLayer = $(evt.currentTarget)[0];

    // hide all panels
    const allPanels = Array.from($('.panel'));
    allPanels.forEach(pan => {
        pan.style.display = 'none';
    })
    // show the active panel
    var panel = thisLayer.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }

    //  de-activate all buttons
    const allButtons = Array.from($('.accordion'));
    allButtons.forEach(button => {
        button.classList.remove('active-panel');
    })
    // change the color on the active button
    thisLayer.classList.toggle('active-panel');
}

// ACCORDION HANDLERS
var acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", handleAccordionEvent)

}

const handleChatEvent = evt => {
    const thisButton = evt.currentTarget;
    const thisUsername = 'jay';
    const buddyUsername = $(thisButton).data('buddy-username');

    console.log(`${thisUsername} wants to chat with ${buddyUsername}`);
}

// user account button event handlers
$('#toggle-beer-matches').click(evt => {
    const thisBtn = evt.currentTarget;

    // check if this button is already toggled on
    if ($(thisBtn).hasClass('btn-dark')) {
        return;
    }

    // make this button look untoggled
    $(thisBtn)
        .addClass('btn-dark')
        .removeClass('btn-outline-dark')

    // toggle the 'show buddies' button
    $('#toggle-buddy-matches')
        .removeClass('btn-dark')
        .addClass('btn-outline-dark')

    // hide the panel of beer matches
    $('#beer-matches').removeClass('hidden');

    // show the buddy panel
    $('#buddy-matches').addClass('hidden');
})

$('#toggle-buddy-matches').click(evt => {
    const thisBtn = evt.currentTarget;

    // check if this button is already toggled on
    if ($(thisBtn).hasClass('btn-dark')) {
        return;
    }
    // make this button look untoggled
    $(thisBtn)
        .addClass('btn-dark')
        .removeClass('btn-outline-dark')

    // toggle the 'show buddies' button
    $('#toggle-beer-matches')
        .removeClass('btn-dark')
        .addClass('btn-outline-dark')

    // hide the panel of beer matches
    $('#buddy-matches').removeClass('hidden');

    // show the buddy panel
    $('#beer-matches').addClass('hidden');
})

$('#calculate-buddies').click(evt => {
    const username = 'jay';
    $.ajax({
        method: 'PUT',
        url: '/drinking-buddies',
        data: {
            username
        }
    }).then(result => {
        console.log(result);
    })
})



// STARTUP FUNCTIONS
getUnmatchedBeers();
getMatchedBeers();
getDrinkingBuddies();