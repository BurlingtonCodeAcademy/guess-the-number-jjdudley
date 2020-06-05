const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//create function for computer guess
function binarySearch(min, max) {
    return Math.floor(((max - min) / 2) + min)
};

//create function to generate random number
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

start();

// function containing all game logic
async function start() {

    console.log('Let\'s play a game.\nWe both will pick a random number between two numbers of your choosing, and will take turns trying to guess each other\'s number. After each guess I will tell you whether your guess is correct, or if the number is higher or lower. You will do the same for me. Make sure to only use integers... I\'ll catch you if you cheat!\n');

    // establish foundational variables

    let rangeBottom;
    let rangeTop;
    let playerNum;


    await getBottomRange();
    
    //get range bottom
    async function getBottomRange() {
        let rangeBottomInput = await ask('\nTo begin, what is the bottom number of the range from which we will select our numbers?\n');
        rangeBottom = parseInt(rangeBottomInput);
        await checkBottomRange(rangeBottomInput);
        return;
    };

    //make sure range bottom is valid
    async function checkBottomRange(input) {
        if (!isNumeric(input)) {
            console.log(`\n${input} is not a valid number. Enter something else please!\n`);
            await getBottomRange();
        }
        
        else if ((isNumeric(input) === true) && (((parseFloat(input)) % 1) != 0)) {
            console.log('\nIntegers only, please!\n');
            await getBottomRange();
        } 
        else {
            return;
        };
    };


    await getTopRange();
    //get range top
    async function getTopRange() {
        let rangeTopInput = await ask('\nOk, and what is the top number of the range?\n');
        rangeTop = parseInt(rangeTopInput);
        checkTopRange(rangeTopInput);
        return;
    }

    // ensure range top is valid
    async function checkTopRange(input) {
        if (!isNumeric(input)) {
            console.log(`\n${input} is not a valid number. Enter something else please!\n`);
            await getTopRange();
        }

        else if ((isNumeric(input) === true) && (((parseFloat(input)) % 1) != 0)) {
            console.log('\nIntegers only, please!\n');
            await getTopRange();
        }
        else {
            return;
        };
    };
    
    // function to prevent user from entering anything other than a "numerical string", e.g. "dghdfgd"
    function isNumeric(num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
      }
    

    //generate computer's 'secret number'
    let computerNum = randomNum(rangeBottom, rangeTop);

    //generate computer's guess
    let computerGuess = binarySearch(rangeBottom, rangeTop);
    console.log('\nOk, I have selected my secret number out of that range.\n');


    await getPlayerNum();

    async function getPlayerNum() {
        playerNum = await ask("\nNow, what is your secret number?\nI won't peek, I promise...\n")
        checkPlayerNum(playerNum)
    }

    async function checkPlayerNum (input) {
        if (!isNumeric(input)) {
            console.log(`${input} is not a valid number. Enter something else please!`);
            await getPlayerNum();
        }

        else if ((isNumeric(input) === true) && (((parseFloat(input)) % 1) != 0)) {
            console.log('Integers only, please!');
            await getPlayerNum();
        }
    }


    // print player's choice for accountability (no cheating!)
    console.log('\nYou entered: ' + playerNum);


    // player guesses first
    console.log(`\nOk, let\'s begin. You can guess first. Go ahead and guess a number between ${rangeBottom} and ${rangeTop}.\n` )

    playerTurn();

    // all logic for player turn
    async function playerTurn() {
        let guessInput = await ask('\nGuess!\n');
        let guess = parseInt(guessInput);
        if (guess === computerNum) {
            console.log('\nThat\'s it! You guessed the number!\n');
            process.exit();
        }
        else if (guess < computerNum) {
            console.log('\nThat\'s not it. My number is higher.');
        }
        else if ( guess > computerNum) {
            console.log('\nThat\'s not it. My number is lower.');
        }

        console.log('\nOk, my turn!');
        computerTurn();
    };


    
    // all logic for computer turn
    async function computerTurn() {
        let guessResult = await ask(`\nIs your number ${computerGuess}? Yes (Y) or no (N)?\n`)
        
        // if guess is correct, end the game
        if (guessResult.toUpperCase() === 'Y') {
          console.log('\nI win! Game over.\n')
          process.exit();
        }

        // if guess is wrong, update range & continue binary search 
        else if (guessResult.toUpperCase() === 'N') {
            updateRange();
        }

        else if (guessResult.toUpperCase() !== 'Y') {
            if (guessResult.toUpperCase() !== 'N') {
                console.log('You didn\'t answer my question... let\'s try that again.');
                computerTurn();
            }
        }
    
        async function updateRange() {
            let rangeGuess = await ask('\nIs your number higher (H) or lower (L)?\n');
        
            // if secret number is higher than guess, remove all numbers below guess
            if (rangeGuess.toUpperCase() === 'H') {
                cheatCheckLow();
                rangeBottom = computerGuess + 1;
                let newGuess = binarySearch(rangeBottom, rangeTop);
                computerGuess = newGuess;
            }

            // likewise, if number is lower than guess, remove all numbers above guess
            else if (rangeGuess.toUpperCase() === 'L') {
                cheatCheckHigh();
                rangeTop = computerGuess -1;
                let newGuess = binarySearch(rangeBottom, rangeTop);
                computerGuess = newGuess;
            }

            else if (rangeGuess.toUpperCase() !== 'H') {
                if (rangeGuess.toUpperCase() !== 'L') {
                console.log('You didn\'t answer my question... let\'s try again.');
                updateRange();
                }
            }

            function cheatCheckLow() {
                if (playerNum < computerGuess) {
                    console.log('\nThe command line wizard just told me you\'re cheating! That\'s game over for me.\n');
                    process.exit();
                };
            };
            
            function cheatCheckHigh() {
                if (playerNum > computerGuess) {
                    console.log('\nThe command line wizard just told me you\'re cheating! That\'s game over for me.\n');
                    process.exit();
                };
            };
            
            console.log('\nOk, your turn.\n')
            playerTurn();
        }; 
    };
};
