/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
// document.body.appendChild(canvas);
document.getElementById("gameContainer").appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

// let monsterX = 100;
// let monsterY = 100;

let monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 1;
let monsterY = Math.floor(Math.random() * (canvas.height - 10)) + 1;

let score = 0;
let timePerGame = 0;
let gameNumber = 1;
let highScore = localStorage.getItem("highScore");
console.log("highScorehighScore", highScore);
document.getElementById("highScore").innerHTML = highScore;

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */

let isOutOfTime = false;
let update = function() {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  // timePerGame = elapsedTime;
  // document.getElementById("timePlay").innerHTML = elapsedTime;

  // console.log("elapsedTime", elapsedTime);
  // console.log("SECONDS_PER_ROUND", SECONDS_PER_ROUND);
  // console.log("over?", elapsedTime > SECONDS_PER_ROUND);

  if (elapsedTime <= SECONDS_PER_ROUND) {
    document.getElementById("timePlay").innerHTML = elapsedTime;
  } else {
    return;
  }

  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
  }
  if (heroX <= -10) {
    heroX = canvas.width - 10;
  }
  if (heroX >= canvas.width) {
    heroX = 10;
  }
  if (heroY <= -10) {
    heroY = canvas.height - 10;
  }
  if (heroY >= canvas.height) {
    heroY = 10;
  }
  // console.log("heroXheroX", heroX);
  // console.log("heroYheroY", heroY);
  // Check if player and monster collided. Our images
  // are about 32 pixels big.

  const heroCollideMonster =
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32;

  if (heroCollideMonster) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.

    score = score + 1;
    // console.log("scorescore", score);
    // console.log("heroXheroX", heroX);
    // console.log("heroYheroY", heroY);
    document.getElementById("scoreNumber").innerHTML = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    // monsterX = monsterX + 50;
    // monsterY = monsterY + 70;
    monsterX = Math.floor(Math.random() * (canvas.width - 10)) + 1;
    monsterY = Math.floor(Math.random() * (canvas.height - 10)) + 1;
  }
};

/**Restart Game */
function playAgain() {
  //reset
  startTime = Date.now();
  score = 0;
  gameNumber = gameNumber + 1;

  document.getElementById("scoreNumber").innerHTML = score;
  document.getElementById("gameNumber").innerHTML = gameNumber;
  // document.getElementById("timePlay").innerHTML = elapsedTime;
}

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  let remainTime = SECONDS_PER_ROUND - elapsedTime;
  if (remainTime >= 0) {
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Seconds Remaining: ${remainTime}`, 20, 50);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    // return;
  }
};

// let gameHistory = [];
// function playAgain(score, elapsedTime) {
//   push gameHistory = [score,elapsedTime]
//   console.log("gameHistory-galksdfjkl",gameHistory)
// }

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
