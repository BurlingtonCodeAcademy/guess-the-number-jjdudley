const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

start()  

async function start() {

    console.log('Let\'s play a game. I, the computer, will pick a random number between two numbers of your choosing. You will try to guess the number, and after each guess I will tell you whether your guess is correct, or if the number is higher or lower.');
    let bottomOfRange = await ask('To begin, what is the bottom number of the range?');
    let topOfRange = await ask('Ok, and what is the top number of the range?');
    let computerNum = randomNum(bottomOfRange, topOfRange);
    console.log('Ok, I have selected a number in that range.');

    playerGuess();

    async function playerGuess() {
        let guessInput = await ask('Guess!');
        let guess = parseInt(guessInput);
        if (guess === computerNum) {
            console.log('That\'s it! You guessed the number!');
            process.exit();
        }
        else if ( guess < computerNum) {
            console.log('That\'s not it. My number is higher.');
        }
        else if ( guess > computerNum) {
            console.log('That\'s not it. My number is lower.');
        }
        playerGuess();
    };
};
