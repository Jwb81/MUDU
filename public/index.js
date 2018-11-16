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

getUnmatchedBeers();