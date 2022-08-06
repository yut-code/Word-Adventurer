// cssi final project
// august 2022

// declaring variables and selecting html elements
const saved = document.querySelector('#topright')
const best = document.querySelector('#topright2')
const balloonguy = document.querySelector('.balloonguy');
const beast = document.querySelector('.beast');
const lettersDiv = document.querySelector("#guess");
const definitionDiv = document.querySelector('#definition')
const button = document.querySelector('.button')
const keyboard = document.querySelectorAll('.alpha-letter')
const hintDiv = document.querySelector("#hint")
const maxBalloons = 10;
let balloons = maxBalloons;
let incorrect = 0;
let highscore = 0;


// helper func - generate a random int 
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// helper function - check if letter is in the alphabet
function isalpha(c) {
  return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
}

// possible endpoints in word generator api
const endpoints = ['noun', 'adjective', 'animal'];

// choose a random endpoint
const randomQuery = endpoints[getRandomInt(2)];

// creating a list that determines the users current state of their guess
let currentGuess = [];

// fetching one random word from api
async function getRandomWord() {
  const response = await fetch(`https://random-word-form.herokuapp.com/random/${randomQuery}`);
	// sending get request and wait for response in a json
  const data = await response.json();
	// load definition link based on generated word
  definitionDiv.innerHTML = `Take a look at the definition: <a href=https://www.merriam-webster.com/dictionary/${data[0]} target="_blank">here</a>`
  
  // check if each letter is... 
  for (let i = 0; i < data[0].length; i++) {
	  // automatically insert non-alphabetic letters (hyphens, letters w accents, etc)
    if (!isalpha(data[0].charAt(i))) {
      currentGuess[i] = data[0].charAt(i);
    }
	  // a letter of the english alphabet is an unguessed letter, hence an underscore
    else {
      currentGuess[i] = "_";
    }
  }
// call on updateDisplay function to show the words on the screen
  updateDisplay(data[0], currentGuess,);
	// return generated word
  return data[0];
}

// update display function with the generated word, currentGuess array and letter inputted that was correct
function updateDisplay(value, currentGuess, correctLetter) {
	// loop through the generated word 
    for (let i = 0; i < value.length; i++) {
	    // check the index(es) of the correct letter and change the corresponding index in the guessing array
      if (correctLetter === value.charAt(i)) { 
        currentGuess[i] = value.charAt(i);
	    // could make a correctKeypress() function to make code more concise here; TODO
        let alphaDiv = document.getElementById(correctLetter.toUpperCase());
        alphaDiv.classList.add("guessed-correct", "pressed");
      }
    }
    lettersDiv.innerHTML = currentGuess.join(' '); // display the current guess array as a string
    saved.innerHTML = `Balloons saved: ${balloons}`; // update the navbar
    console.log(value, currentGuess, correctLetter);
    // show definition and change images if user wins the game
    if (currentGuess.join('') === value) {
      // console.log('e')
      definitionDiv.classList.remove('hidden');
      setTimeout(() => alert("Good Job!")); 
      balloonguy.src = `images/win${balloons}.png`
      beast.src = `images/beast3.png`
    }
  }

// once game is over, the word generated will be revealed
  function revealWord(value) {
	// the value of the promise is a parameter to loop through the word and make the word an array that displays in the underscores div
    let answerArr = [];
    for (let i = 0; i < value.length; i++) {
      answerArr[i] = value.charAt(i);
    }
    lettersDiv.innerHTML = answerArr.join(' ');
	  // show the definition of the word
    definitionDiv.classList.remove('hidden');
    // console.log("saved element=" + saved);
	  // update navbar
    saved.innerHTML = `Balloons saved: ${balloons}`;
  }

// user replays the game? we must...
  function refreshGame() {
	  // empty our guessing array 
    currentGuess = [];
	  // get a new word
    currentWord = getRandomWord();
	  // remove classes to remove background color and that the letter have been guessed already
    keyboard.forEach(key => key.classList.remove('guessed-wrong', 'guessed-correct', 'pressed'));
	  // hide the definition again
    definitionDiv.classList.add('hidden');
	  // show correct images
    balloonguy.src = `images/10.png`;
    beast.src = `images/beast.png`;
	  // update navbar
    if (balloons > highscore) {
      highscore = balloons;
      best.innerHTML = `Best: ${highscore} balloons`;
    }
    balloons = maxBalloons;
    incorrect = 0;
  }


// call on function to get the generated word (this will be a promise)
let currentWord = getRandomWord();



// keyboard on the screen is clickable
keyboard.forEach(letter => letter.addEventListener('click', (e) => {
	// to know the letter clicked, we save the id in lowercase
  clickedLetter = letter.id.toLowerCase();
	// wait for the value of currentWord variable since it is a promise. the value of the promise is converted into a string
  currentWord.then(value => {
    value = String(value);
//     console.log(value.length);
//     console.log("you pressed : " + clickedLetter, typeof(clickedLetter));
	  
	  // if the inputed letter is in the generated word then update the display
    if (value.includes(clickedLetter)) {
//       console.log("yay");
      updateDisplay(value, currentGuess, clickedLetter);
    }
	  // if the letter is not in the word
    else {
	    // access the specific letter's div on the keyboard and add class 'guessed-wrong' which changes the background color to red
      let alphaDiv = document.getElementById(clickedLetter.toUpperCase());
      alphaDiv.classList.add("guessed-wrong");
	// if the user still has chances left to play and the user didn't re enter a key 
      if (balloons >= 0 && !alphaDiv.classList.contains("pressed")) {
	      // increment accordingly and change the balloon image
        incorrect++;
        balloons--;
        saved.innerHTML = `Balloons saved: ${balloons}`;
        balloonguy.src = `images/${balloons}.png`;
      }
	// always add class pressed to the div if the letter was inputted
      alphaDiv.classList.add("pressed");
	// game over once balloons are popped - reveal the word to the user, change the images and alert the user 
      if (balloons <= 0) {
        revealWord(value);
        balloonguy.src = `images/0.png`;
        beast.src = `images/beast2.png`;
        setTimeout(() => alert("👹GAME OVER👹"));
      }
    }
  }
                   )
}))

//verifies each guessed letter typed on the keyboard as an input
// same logic as click event listener
window.addEventListener("keypress", (e) => {
	// wait for promise to resolve
    currentWord.then(value => {
//       console.log("word is " + value);
      value = String(value);
      // console.log(value.length);
      // console.log("you pressed : " + e.key);
      if (value.includes(e.key)) {
        // console.log("yay");
        updateDisplay(value, currentGuess, e.key);
      }
      else if (isalpha(e.key)) {
        let alphaDiv = document.getElementById(e.key.toUpperCase());
        alphaDiv.classList.add("guessed-wrong");
        if (balloons >= 0 && !alphaDiv.classList.contains("pressed")) {
          incorrect++;
          balloons--;
          saved.innerHTML = `Balloons saved: ${balloons}`;
          balloonguy.src = `images/${balloons}.png`;
        }
        alphaDiv.classList.add("pressed");
        if (balloons <= 0) {
          revealWord(value);
          balloonguy.src = `images/0.png`;
          beast.src = `images/beast2.png`;
          setTimeout(() => alert("👹GAME OVER👹"));
        }
      }
    })
  })

// if the button is clicked, create a new game
  button.addEventListener("click", refreshGame);
