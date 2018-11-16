// get more cards from the server
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
const getMatchedBeers = () => {
    const username = 'jay';
    $.ajax({
        method: 'GET',
        url: `/matched-beers/${username}`
    }).then(beers => {
        console.log(beers);
        Array.from(beers).forEach(beer => {
            const newLayer = createAccordionLayer(beer);
            $('#user-matches').append(newLayer);
        })
    })
    .catch(err => {
        console.log(err);
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
        .attr('src', beer.labels ? beer.labels.large || beer.labels[0] : '');



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
        .text('Category: ' + beer.style.category.name || '');

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
    $(allCards[0]).remove();                // remove current card
    if (allCards.length > 1) {
        $(allCards[1]).removeClass('hidden');   // show the next card
    }
    else {
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
        .val(match.name)
        .click(handleAccordionEvent);

    const dropdown = $('<div>')
        .addClass('panel');
    
    const abv = $('<p>')
        .text(`ABV: ${match.abv || '-'}`);

    const category = $('<p>')
        .text(`Category: ${match.style ? match.style.category.name : '-'}`);

    const description = $('<p>')
        .text(match.description);

    const brewery = $('<p>')
        .text(`Brewery: ${match.breweries ? match.breweries[0].name : '-'}`);

    // append each layer
    $(dropdown)
        .append(abv)
        .append(category)
        .append(brewery)
        .append(description)

    return $('<div>')
        .append(button)
        .append(dropdown);
}


const handleAccordionEvent = (evt) => {
    // get this layer
    const thisLayer = $(evt.currentTarget)[0];

    // close all other layers 
    const allPanels = Array.from($('.panel'));
    allPanels.forEach(currentPanel => {
        currentPanel.style.display = 'none';
    })

    /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        thisLayer.classList.toggle("active-panel");

        /* Toggle between hiding and showing the active panel */
        var panel = thisLayer.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
}

// ACCORDION HANDLERS
var acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", handleAccordionEvent) 
    
} 



// STARTUP FUNCTIONS
getUnmatchedBeers();
getMatchedBeers();