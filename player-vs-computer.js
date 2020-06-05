const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

function binarySearch(min, max) {
    return Math.floor(((max - min) / 2) + min)
};

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

start();

async function start() {

    console.log('Let\'s play a game. We both will pick a random number between two numbers of your choosing. We will take turns trying to guess each other\'s number. After each guess I will tell you whether your guess is correct, or if the number is higher or lower. You will do the same for me.');
    let rangeBottomInput = await ask('To begin, what is the bottom number of the range from which we will select our numbers?');
    let rangeBottom = parseInt(rangeBottomInput);
    let rangeTopInput = await ask('Ok, and what is the top number of the range?');
    let rangeTop = parseInt(rangeTopInput);
    let computerNum = randomNum(rangeBottom, rangeTop);
    console.log('Ok, I have selected a number in that range.');

    let playerNum = await ask("Great. Now, what is your secret number?\nI won't peek, I promise...\n")

    console.log('You entered: ' + playerNum);

    let computerGuess = binarySearch(rangeBottom, rangeTop);

    // player guesses first
    console.log(`Ok, let\'s begin. You can guess first. Go ahead and guess a number between ${rangeBottom} and ${rangeTop}.` )

    playerTurn();

    async function playerTurn() {
        let guessInput = await ask('Guess!');
        let guess = parseInt(guessInput);
        if (guess === computerNum) {
            console.log('That\'s it! You guessed the number!');
            process.exit();
        }
        else if (guess < computerNum) {
            console.log('That\'s not it. My number is higher.');
        }
        else if ( guess > computerNum) {
            console.log('That\'s not it. My number is lower.');
        }

        console.log('Ok, my turn!');
        computerTurn();
    };


    

    async function computerTurn() {
        let guessResult = await ask(`Is your number ${computerGuess}? Yes (Y) or no (N)?`)
        
        // if guess is correct, end the game
        if (guessResult === 'Y') {
          console.log('I win! Game over.')
          process.exit();
        }

        // if guess is wrong, update range & continue binary search 
        else {
          if (guessResult === 'N') {
            updateRange();
          }
        }
    
        async function updateRange() {
            let rangeGuess = await ask('Is your number higher (H) or lower (L)?');
        
            // if secret number is higher than guess, remove all numbers below guess
            if (rangeGuess === 'H') {
                cheatCheckLow();
                rangeBottom = computerGuess + 1;
                let newGuess = binarySearch(rangeBottom, rangeTop);
                computerGuess = newGuess;
            }

            // likewise, if number is lower than guess, remove all numbers above guess
            else if (rangeGuess === 'L') {
                cheatCheckHigh();
                rangeTop = computerGuess -1;
                let newGuess = binarySearch(rangeBottom, rangeTop);
                computerGuess = newGuess;
            };

            function cheatCheckLow() {
                if (playerNum < computerGuess) {
                    console.log('The command line wizard just told me you\'re cheating! That\'s game over for me.');
                    process.exit();
                };
            };
            
            function cheatCheckHigh() {
                if (playerNum > computerGuess) {
                    console.log('The command line wizard just told me you\'re cheating! That\'s game over for me.');
                    process.exit();
                };
            };
            
            console.log('Ok, your turn.')
            playerTurn();
        }; 
    };
};
