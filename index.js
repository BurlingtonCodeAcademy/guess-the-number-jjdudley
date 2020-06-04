const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}


// create function to generate random number (the computer's guess)


function randomNum(min, max) {
  return Math.floor(((max - min) / 2) + min)
};

start();

async function start() {
  console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it. First, let's establish a range from which you choose your number (ex: 1 to 100)")
  let bottomOfRangeInput = await ask("First, what is the bottom number of the range?")
  let bottomOfRange = parseInt(bottomOfRangeInput);

  let topOfRangeInput = await ask("Ok. And what is the top number of the range?")
  let topOfRange = parseInt(topOfRangeInput);
  let secretNumber = await ask("Great. Now, what is your secret number?\nI won't peek, I promise...\n")
  console.log('You entered: ' + secretNumber);
  // Now try and complete the program.

  // computer guesses
  let computerGuess = randomNum(bottomOfRange, topOfRange);
  
  makeGuess();

  // ask human whether guess is correct or not

  async function makeGuess() {
    let guessResult = await ask(`Is your number ${computerGuess}? Enter Y for yes and N for no.`)
    
    // if guess is correct, end the game
    if (guessResult === 'Y') {
      console.log('Great, I guessed it!')
      process.exit();
    }
  // if guess is wrong, update range according to binary search 
  
    else {
      if (guessResult === 'N') {
        guessLoop();
      }

      async function guessLoop() {
        let rangeGuess = await ask('Is your number higher (H) or lower (L)?')
    
        // if secret number is higher than guess, remove all numbers below guess
        if (rangeGuess === 'H') {
          if (secretNumber < computerGuess) {
            console.log('The command line wizard just told me you\'re cheating! That\'s game over for me.');
            process.exit();
          }
          else {
            bottomOfRange = computerGuess + 1;
            let newGuess = randomNum(bottomOfRange, topOfRange);
            computerGuess = newGuess;
          }
        } 
    
        // likewise, if number is lower than guess, remove all numbers above guess
        else if (rangeGuess === 'L') {

          if (secretNumber > computerGuess) {
            console.log('The command line wizard just told me you\'re cheating! That\'s game over for me.');
            process.exit();
          }
          else {
          topOfRange = computerGuess -1;
          let newGuess = randomNum(bottomOfRange, topOfRange);
          computerGuess = newGuess;
          }
        };

        makeGuess();
      }; 
    };

  };
};