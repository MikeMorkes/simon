// worked from http://codeperspectives.com/front-end/simon-says-sequences/ when I was struggling with working with asymetric programming, but made sure I understood the code (hence the copious inline notes) - and tweaked/improved it. Also renamed functions and variables to make more sense.

// Global
var simon = {};

var strictBoo = false;

// strict, on/off button functions
function strictBtn() {
  document.getElementById("strict-button-on").style.display = "block";
  document.getElementById("strict-button").style.display = "none";  
  strictBoo = true;
}

function strictBtnOn() {
  document.getElementById("strict-button-on").style.display = "none";
  document.getElementById("strict-button").style.display = "block";
  strictBoo = false;
}

function switchBtn() {
  document.getElementById("switch").style.display = "none";
  document.getElementById("switchoff").style.display = "block";
  document.getElementById("display-count").style.display = "block";
  document.getElementById("display-count").innerHTML = "00";
}

function switchBtnOff() {
  document.getElementById("switch").style.display = "block";
  document.getElementById("switchoff").style.display = "none";
  document.getElementById("display-count").style.display = "none";
  gameOver();
}

// set up the button images
function initializebtnImages() {
  simon.imgOff = ["http://www.mikemorkes.com/codepen/simon/green_btn_off.png", "http://www.mikemorkes.com/codepen/simon/red_btn_off.png", "http://www.mikemorkes.com/codepen/simon/yellow_btn_off.png", "http://www.mikemorkes.com/codepen/simon/blue_btn_off.png"];

  simon.imgOn = ["http://www.mikemorkes.com/codepen/simon/green_btn_on.png", "http://www.mikemorkes.com/codepen/simon/red_btn_on.png", "http://www.mikemorkes.com/codepen/simon/yellow_btn_on.png", "http://www.mikemorkes.com/codepen/simon/blue_btn_on.png"];

  simon.imgDelay = 800; // sets up how long light comes on
}

// set up the sounds
function initializeSounds() {
  // win/error tones
  simon.successSound = new Audio("http://www.mikemorkes.com/codepen/simon/sounds/tada.wav");
  simon.failureSound = new Audio("http://www.mikemorkes.com/codepen/simon/sounds/buzzerheavy.wav");
  
  //button tones
  simon.btnSound = [new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    new Audio("http://www.mikemorkes.com/codepen/simon/sounds/simonSound3.mp3"),
    new Audio("http://www.mikemorkes.com/codepen/simon/sounds/simonSound2.mp3"),
    new Audio("http://www.mikemorkes.com/codepen/simon/sounds/simonSound1.mp3")
  ];

}


// set up intialization of sequence - this also resets everything between games
function initializeSeq() {
  simon.sequence = new Array(); // get sequence; 0 = green, 1 = red, 2 = yellow, 3 = blue
  for (var i = 0; i < 20; i++) {
    simon.sequence[i] = Math.floor(Math.random() * 4);
  }
  simon.sequenceLength; // track current sequence length  
  simon.btnsPlayed; // track what notes were played
  simon.btnsClicked; // track what notes were clicked by user
  simon.count = 1;
  document.getElementById("display-count").innerHTML = "0" + simon.count; // set display to current round

}

// set up event listener
function initializeListener() {
  document.addEventListener("click", onClick);
}


// plays the current sequence of notes
function playSequence() {
  simon.btnsPlayed = 0;
  simon.btnsClicked = 0;
  simon.intervalSetup = setInterval(function() {
      if (simon.btnsPlayed < simon.sequenceLength) { // compare # of notes played to current sequence length
    	btnPlay(simon.sequence[simon.btnsPlayed]);
    	simon.btnsPlayed = simon.btnsPlayed + 1;
  	} else { // if sequence length, reached, clear the interval
    	clearInterval(simon.intervalSetup);
  	}
  }, 900);
}

// function to turn on light and play note, using i, which is determined by onClick
function turnBtnOn(i, btnImage) {
  simon.btnSound[i].play(); // play sound
  btnImage.src = simon.imgOn[i]; // img source is grabbed from array imgOn
}

// function to switch light off again
function turnBtnOff(i, btnImage) {
  btnImage.src = simon.imgOff[i]; // get img source from array imgOff
}

// function to turn on light and play sound when button should play
function btnPlay(i) {
  var imgID = "btn_" + String(i); // generate btnImage id, i is puled from onClick
  var btnImage = document.getElementById(imgID); // target btnImage element with imgID using var btnImage

  turnBtnOn(i, btnImage); // turn on btnImage and play sound
  setTimeout(function() {
    turnBtnOff(i, btnImage);
  }, simon.imgDelay); // turn off lit btnImage after delay
}

// button press functions
function onClick(evt) {
  var targetID; // this is null until something is assigned to it

  targetID = evt.target.id;
  if (targetID.match("btn_") === null) { // if nothing pressed yet, don't start for loop
    return -1; // program now waits for a button press
  }

  // get target ID # and drop it in i to use later
  var i = targetID.slice(-1);
  i = Number(i);
  if (i == -1) { // nothing has been pressed, so...
    return; // break loop
  }
  
  // otherwise, this function passes on button ID to btnPlay
  btnPlay(i);
  simon.btnsClicked = simon.btnsClicked + 1;
  if (simon.sequence[simon.btnsClicked - 1] === i) { // player pressed correct button
    // see if the sequence is completed
  if (simon.btnsClicked != simon.sequenceLength) {
    return; // this breaks the loop, because player hasn't pressed enough buttons to finish round
  }

  if (simon.btnsClicked < 20) { // if current round isn't last round,
    simon.sequenceLength = simon.sequenceLength + 1; // add another note to sequence
    simon.count++; // bump up counter by 1
    if (simon.count < 10) { // change counter amount
      document.getElementById("display-count").innerHTML = "0" + simon.count;
    } else {
      document.getElementById("display-count").innerHTML = simon.count;
    }
    timer = setTimeout(function() {
      playSequence(); // play sequence
    }, 900);
  } else { // player won
    gameOver(true); // player finished all sequences, so run winner stuff
  }
    
  } else { // player pushed wrong button
    if (strictBoo === true) { // if the strict button is active
      simon.failureSound.play();
      document.getElementById("display-count").innerHTML = "END";
    } else { // if the strict button is inactive
      simon.failureSound.play();
      document.getElementById("display-count").innerHTML = "NO!";
      timer = setTimeout(function() {
        if (simon.count < 10) {
          document.getElementById("display-count").innerHTML = "0" + simon.count;
        } else {
          document.getElementById("display-count").innerHTML = simon.count;
        }
        playSequence(); // play sequence
      }, 900);
    }
  }
}


// tests to see if player won game
function gameOver(playerWon) {
  document.removeEventListener('click', onClick);
  if (playerWon) {
    timer = setTimeout(function() { // run player win sequence
      document.getElementById("display-count").innerHTML = "WIN";
      simon.successSound.play();
    }, 1000);
    timer = setTimeout(function() { // start new game
      playGame();
    }, 1700);

  } else {
    if (strictBoo === true) { // run lose sound and put END in counter
      simon.failureSound.play();
      document.getElementById("display-count").innerHTML = "END";
    }
  }
}

// run the game
function playGame(i) {
  initializeSeq();
  initializeListener();
  console.log(simon.sequence);
  simon.sequenceLength = 1;
  timer = setTimeout(function() {
    playSequence(); // play sequence
  }, 300);
}

// initialize btnImages, sounds, and number of rounds
window.onload = function() {
  initializebtnImages();
  initializeSounds();
};