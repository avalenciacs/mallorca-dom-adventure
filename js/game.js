// ===============================
// Mallorca Adventure - Versión px pura
// ===============================

// DOM
const game = document.getElementById("game");

const bgSky = document.getElementById("bg-sky");
const bgSea = document.getElementById("bg-sea");

const playerEl = document.getElementById("player");
const obstacleEl = document.getElementById("obstacle");
const enemyEl = document.getElementById("enemy");
const fruitEl = document.getElementById("fruit");
const frisbee = document.getElementById("frisbee");

const startBtn = document.getElementById("startBtn");
const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");

const birdsSpan = document.getElementById("birds");

// Estado global
let isGameRunning = false;
let score = 0;
let lives = 3;

let birdsKilled = 0;

function updateUI() {
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
  birdsSpan.textContent = birdsKilled;
}

// ===============================
// PARALLAX
// ===============================
let skyOffset = 0;
let seaOffset = 0;

const skySpeed = 0.4;
const seaSpeed = 1.2;

function moveBackground() {
  skyOffset -= skySpeed;
  bgSky.style.backgroundPosition = `${skyOffset}px 0`;

  seaOffset -= seaSpeed;
  if (seaOffset <= -800) seaOffset = 0;
  bgSea.style.left = `${seaOffset}px`;
}

// ===============================
// ENTIDADES (px)
// ===============================

// Tamaños desde CSS
const PLAYER_WIDTH = playerEl.offsetWidth;
const PLAYER_HEIGHT = playerEl.offsetHeight;

const OBSTACLE_WIDTH = obstacleEl.offsetWidth;
const OBSTACLE_HEIGHT = obstacleEl.offsetHeight;

const ENEMY_WIDTH = enemyEl.offsetWidth;
const ENEMY_HEIGHT = enemyEl.offsetHeight;

const FRUIT_WIDTH = fruitEl.offsetWidth;
const FRUIT_HEIGHT = fruitEl.offsetHeight;

const FRISBEE_WIDTH = frisbee.offsetWidth;
const FRISBEE_HEIGHT = frisbee.offsetHeight;



// Jugador
const GROUND_Y = 200;

const player = {
  x: 100,
  y: GROUND_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  velY: 0,
  speed: 5
};

// Obstáculo
const obstacle = {
  x: 800,
  y: 200,
  width: OBSTACLE_WIDTH,
  height: OBSTACLE_HEIGHT,
  speed: 4
};

// Enemigo (gaviota)
const ENEMY_Y = 140;
const enemy = {
  x: 900,
  y: ENEMY_Y,
  width: ENEMY_WIDTH,
  height: ENEMY_HEIGHT,
  speed: 3
};

// Fruta

// Tipos de fruta disponibles (imagenes e hitboxes)
const fruitTypes = [
  { name: "banana", src: "./assets/sprites/banana.png", width: FRUIT_WIDTH, FRUIT_HEIGHT },
  { name: "apple", src: "./assets/sprites/apple.png", width: FRUIT_WIDTH, FRUIT_HEIGHT },
  { name: "water", src: "./assets/sprites/water.png", width: FRUIT_WIDTH, FRUIT_HEIGHT }
];


const FRUIT_Y = 210;
const fruit = {
  x: 900,
  y: FRUIT_Y,
  width: FRUIT_WIDTH,
  height: FRUIT_HEIGHT,
  speed: 3,
  type: null    // <- Tipo actual (banana/apple/water)
};

// ===============================
// INPUT
// ===============================
const gravity = 0.6;
const jumpForce = -12;

const keys = { left: false, right: false };

document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;

  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;

  if (e.key === " " || e.key === "ArrowUp" || e.key === "w") jump();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
});

// Lanzar frisbee con F
document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;

  // Tecla F
  if (e.key === "f" || e.key === "F") {
    throwFrisbee();
  }

  // Tecla 0 del teclado numérico
  if (e.code === "Numpad0") {
    throwFrisbee();
  }
});

// ===============================
// JUGADOR
// ===============================
function movePlayerHorizontal() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x > game.clientWidth - player.width) {
    player.x = game.clientWidth - player.width;
  }
}

function jump() {
  if (Math.abs(player.y - GROUND_Y) < 1) {
    player.velY = jumpForce;
  }
}

function applyPhysics() {
  player.velY += gravity;
  player.y += player.velY;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.velY = 0;
  }
}

// ===============================
// FRISBEE
// ===============================
let frisbeeActive = false;
let frisbeeX = 0;
let frisbeeY = 0;
const frisbeeSpeed = 10;

function throwFrisbee() {
  if (frisbeeActive) return;

  frisbeeActive = true;

  frisbeeX = player.x + player.width - 10;
  frisbeeY = player.y + player.height * 0.25; // alineado con gaviota

  frisbee.style.left = frisbeeX + "px";
  frisbee.style.top = frisbeeY + "px";
  frisbee.style.display = "block";
}

function moveFrisbee() {
  if (!frisbeeActive) return;

  frisbeeX += frisbeeSpeed;
  frisbee.style.left = frisbeeX + "px";

  if (frisbeeX > game.clientWidth) deactivateFrisbee();
}

function deactivateFrisbee() {
  frisbeeActive = false;
  frisbee.style.display = "none";
}

// ===============================
// MOVIMIENTO ENTIDADES
// ===============================
function resetObstacle() {
  obstacle.x = game.clientWidth + 50;
}

function resetEnemy() {
  enemy.x = game.clientWidth + 150;
}

function resetFruit() {
  // Elegir tipo random
  const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

  fruit.type = randomFruit.name;
  fruit.x = game.clientWidth + 200;
  fruit.y = FRUIT_Y;
  fruit.width = randomFruit.width;
  fruit.height = randomFruit.height;

  // Cambiar sprite visual
  fruitEl.style.backgroundImage = `url(${randomFruit.src})`;
  fruitEl.style.width = fruit.width + "px";
  fruitEl.style.height = fruit.height + "px";
}

function moveObstacle() {
  obstacle.x -= obstacle.speed;
  if (obstacle.x < -obstacle.width) {
    score++;
    updateUI();
    resetObstacle();
  }
}

function moveEnemy() {
  enemy.x -= enemy.speed;
  if (enemy.x < -enemy.width) {
    score++;
    updateUI();
    resetEnemy();
  }
}

function moveFruit() {
  fruit.x -= fruit.speed;
  if (fruit.x < -fruit.width) {
    resetFruit();
  }
}

// ===============================
// RENDER
// ===============================
function render() {
  playerEl.style.left = player.x + "px";
  playerEl.style.top = player.y + "px";

  obstacleEl.style.left = obstacle.x + "px";
  obstacleEl.style.top = obstacle.y + "px";

  enemyEl.style.left = enemy.x + "px";
  enemyEl.style.top = enemy.y + "px";

  fruitEl.style.left = fruit.x + "px";
  fruitEl.style.top = fruit.y + "px";
}

// ===============================
// HITBOXES
// ===============================
function isColliding(a, b) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

function getPlayerHitbox() {
  return {
    x: player.x + player.width * 0.25,
    y: player.y + player.height * 0.20,
    width: player.width * 0.5,
    height: player.height * 0.70
  };
}

function getObstacleHitbox() {
  return {
    x: obstacle.x + obstacle.width * 0.15,
    y: obstacle.y + obstacle.height * 0.10,
    width: obstacle.width * 0.7,
    height: obstacle.height * 0.80
  };
}

function getEnemyHitbox() {
  return {
    x: enemy.x + enemy.width * 0.10,
    y: enemy.y + enemy.height * 0.10,
    width: enemy.width * 0.80,
    height: enemy.height * 0.80
  };
}

function getFruitHitbox() {
  return {
    x: fruit.x + fruit.width * 0.20,
    y: fruit.y + fruit.height * 0.20,
    width: fruit.width * 0.60,
    height: fruit.height * 0.60
  };
}

// ===============================
// CHECK COLLISIONS
// ===============================
function checkCollisions() {
  const pHB = getPlayerHitbox();
  const oHB = getObstacleHitbox();
  const eHB = getEnemyHitbox();
  const fHB = getFruitHitbox();

  // Suelo
  if (isColliding(pHB, oHB)) {
    handleDamage();
    resetObstacle();
  }

  // Aéreo
  if (isColliding(pHB, eHB)) {
    handleDamage();
    resetEnemy();
  }

  // Fruta
  if (isColliding(pHB, fHB)) {
    score += 5;
    updateUI();
    resetFruit();
  }

  // ===============================
  // FRISBEE → GAVIOTA
  // ===============================
  if (frisbeeActive) {

    const frisbeeHB = {
      x: frisbeeX,
      y: frisbeeY,
      width: FRISBEE_WIDTH,
      height: FRISBEE_HEIGHT
    };

    const enemyHB = getEnemyHitbox(); // ← enemigo real: enemy

    if (isColliding(frisbeeHB, enemyHB)) {
      birdsKilled += 1;  // ← SUMAMOS GAVIOTA ELIMINADA
      score += 10;
      updateUI();
      resetEnemy();
      deactivateFrisbee();
    }
  }

}

function handleDamage() {
  lives--;
  updateUI();
  if (lives <= 0) gameOver();
}

// ===============================
// GAME LOOP
// ===============================
function gameLoop() {
  if (!isGameRunning) return;

  moveBackground();
  movePlayerHorizontal();
  applyPhysics();

  moveObstacle();
  moveEnemy();
  moveFruit();
  moveFrisbee();

  checkCollisions();
  render();

  requestAnimationFrame(gameLoop);
}

// ===============================
// GAME OVER
// ===============================
function gameOver() {
  isGameRunning = false;
  alert("GAME OVER");
}

// ===============================
// START GAME
// ===============================
function startGame() {
  if (isGameRunning) return;

  isGameRunning = true;
  score = 0;
  lives = 3;
  updateUI();

  skyOffset = 0;
  seaOffset = 0;
  bgSky.style.backgroundPosition = "0px 0px";
  bgSea.style.left = "0px";

  player.x = 100;
  player.y = GROUND_Y;
  player.velY = 0;

  resetObstacle();
  resetEnemy();
  resetFruit();

  render();
  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);
