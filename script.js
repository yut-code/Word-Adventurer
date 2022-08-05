import "thesaurus-synonyms";
const saved = document.querySelector('#topright')
const best = document.querySelector('#topright2')
const balloonguy = document.querySelector('.balloonguy');
const beast = document.querySelector('.beast');
const lettersDiv = document.querySelector("#guess");
const maxBalloons = 10;
let balloons = maxBalloons;
let incorrect = 0;
let highscore = 0;
const definitionDiv = document.querySelector('#definition')
const button = document.querySelector('.button')
const keyboard = document.querySelectorAll('.alpha-letter')
var thesaurus = require('thesaurus-synonyms');
const hintDiv = document.querySelector("#hint")

// helper func - generate a random int 
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function isalpha(c) {
  return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
}

// possible endpoints in word generator api
const endpoints = ['noun', 'adjective', 'animal'];
// choose a random endpoint
const randomQuery = endpoints[getRandomInt(2)];
let currentGuess = [];

// fetching one random word from api
async function getRandomWord() {
  // show loading 
  const response = await fetch(`https://random-word-form.herokuapp.com/random/${randomQuery}`);
  const data = await response.json();
  definitionDiv.innerHTML = `Take a look at the definition: <a href=https://www.merriam-webster.com/dictionary/${data[0]} target="_blank">here</a>`
  synonym = thesaurus.search(data[0])
    .then(hintDiv.innerHTML = `Synonym: ${synonym}`);
  
  for (let i = 0; i < data[0].length; i++) {
    if (!isalpha(data[0].charAt(i))) {
      currentGuess[i] = data[0].charAt(i);
    }
    else {
      currentGuess[i] = "_";
    }
  }
  updateDisplay(data[0], currentGuess,);
  return data;
}
let currentWord = getRandomWord();

//verifies each guessed letter

// keyboard click
keyboard.forEach(letter => letter.addEventListener('click', (e) => {
  clickedLetter = letter.id.toLowerCase();
  currentWord.then(value => {
    value = String(value);
    console.log(value.length);
    console.log("you pressed : " + clickedLetter, typeof(clickedLetter));
    if (value.includes(clickedLetter)) {
      console.log("yay");
      updateDisplay(value, currentGuess, clickedLetter);
    }
    else if (isalpha(clickedLetter)) {
      let alphaDiv = document.getElementById(clickedLetter.toUpperCase());
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
  }
                   )
}))

window.addEventListener("keypress", (e) => {
    currentWord.then(value => {
      console.log("word is " + value);
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



  function updateDisplay(value, currentGuess, correctLetter) {
    for (let i = 0; i < value.length; i++) {
      if (correctLetter === value.charAt(i)) { //try to ignore case when checking
        currentGuess[i] = value.charAt(i);
        let alphaDiv = document.getElementById(correctLetter.toUpperCase());
        alphaDiv.classList.add("guessed-correct", "pressed");
      }
    }
    lettersDiv.innerHTML = currentGuess.join(' ');
    saved.innerHTML = `Balloons saved: ${balloons}`;
    console.log(value, currentGuess, correctLetter);
    // show definition if guessed correctly
    if (currentGuess.join('') === value) {
      console.log('e')
      definitionDiv.classList.remove('hidden');
    }
  }

  function revealWord(value) {
    let answerArr = [];
    for (let i = 0; i < value.length; i++) {
      answerArr[i] = value.charAt(i);
    }
    lettersDiv.innerHTML = answerArr.join(' ');
    definitionDiv.classList.remove('hidden');
    // console.log("saved element=" + saved);
    saved.innerHTML = `Balloons saved: ${balloons}`;
  }

  function refreshGame() {
    currentGuess = []
    currentWord = getRandomWord();
    keys = document.querySelectorAll(".alpha-letter");
    keys.forEach(key => key.classList.remove('guessed-wrong', 'guessed-correct', 'pressed'));
    definitionDiv.classList.add('hidden')
    balloonguy.src = `images/10.png`
    beast.src = `images/beast.png`;
    if (balloons > highscore) {
      highscore = balloons;
      best.innerHTML = `Best: ${highscore} balloons`;
      //also display a you win alert???
    }
    balloons = maxBalloons;
    incorrect = 0;
  }


  button.addEventListener("click", refreshGame);