let BGame = {
    'you': { 'elementID': '#you-result', 'div': '.addcard-you', 'score': 0 },
    'dealer': { 'elementID': '#dealer-result', 'div': '.addcard-dealer', 'score': 0 },
    'card': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'loses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false
};

const YOU = BGame['you'];
const DEALER = BGame['dealer'];

const hitSound = new Audio('/home/youssef/Web Development/Project 5/blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('/home/youssef/Web Development/Project 5/blackjack_assets/sounds/cash.mp3');
const loseSound = new Audio('/home/youssef/Web Development/Project 5/blackjack_assets/sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', hit_button);
document.querySelector('#deal').addEventListener('click', deal_button);
document.querySelector('#stand').addEventListener('click', stand_button);

function hit_button() {
    if (BGame['isStand'] === false) {
        let c = randomCard();
        showCard(c, YOU);
        updateScore(c, YOU);
    }
}

function showCard(card, player) {
    if (player['score'] <= 21) {
        hitSound.play();
        let cardImage = document.createElement('img');
        cardImage.src = `/home/youssef/Web Development/Project 5/blackjack_assets/images/${card}.png`;
        cardImage.height = 130;
        cardImage.width = 100;
        document.querySelector(player['div']).appendChild(cardImage);
    }
}

function randomCard() {
    let rnad = Math.floor(Math.random() * 13);
    return BGame['card'][rnad];
}

function deal_button() {
    if (BGame['turnOver'] === true) {
        BGame['isStand'] = false;
        let you_images = document.querySelector(YOU['div']).querySelectorAll('img');
        let dealer_images = document.querySelector(DEALER['div']).querySelectorAll('img');
        for (let i = 0; i < you_images.length; i++) {
            you_images[i].remove();
        }

        for (let i = 0; i < dealer_images.length; i++) {
            dealer_images[i].remove();
        }
        document.querySelector(YOU['elementID']).textContent = '0';
        document.querySelector(YOU['elementID']).style.color = 'white';
        YOU['score'] = 0;
        document.querySelector(DEALER['elementID']).textContent = '0';
        document.querySelector(DEALER['elementID']).style.color = 'white';
        DEALER['score'] = 0;
        document.querySelector('#result-message').textContent = "Let's play";
        document.querySelector('#result-message').style.color = 'black';
        BGame['turnOver'] = true;
    }
}

function updateScore(card, player) {
    if (card == 'A') {
        if (player['score'] + 11 <= 21) {
            player['score'] += 11;
        } else {
            player['score'] += 1;
        }
    } else {
        player['score'] += BGame['cardsMap'][card];
    }
    if (player['score'] > 21) {
        document.querySelector(player['elementID']).textContent = 'BUST!';
        document.querySelector(player['elementID']).style.color = 'red';
    } else {
        document.querySelector(player['elementID']).textContent = player['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function stand_button() {
    BGame['isStand'] = true;
    while (DEALER['score'] <= 15 && BGame['isStand'] == true) {
        let c = randomCard();
        showCard(c, DEALER);
        updateScore(c, DEALER);
        await sleep(700);
    }

    if (DEALER['score'] > 15) {
        BGame['turnOver'] = true;
        showResult(computeWinner());
    }
}

function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            //draw
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        //draw
    }
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if (BGame['turnOver'] == true) {
        if (winner == YOU) {
            message = ' You Won!';
            messageColor = 'green';
            winSound.play();
            BGame['wins']++;
            document.querySelector('#wins').textContent = BGame['wins'];
        } else if (winner == DEALER) {
            message = 'You Lost!';
            messageColor = 'red';
            loseSound.play();
            BGame['loses']++;
            document.querySelector('#loses').textContent = BGame['loses'];
        } else {
            message = 'You Drew!';
            messageColor = 'black';
            BGame['draws']++;
            document.querySelector('#draws').textContent = BGame['draws'];
        }

        document.querySelector('#result-message').textContent = message;
        document.querySelector('#result-message').style.color = messageColor;
    }
}