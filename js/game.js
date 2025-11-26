// ===============================
// Mallorca Adventure - Versión estable
// ===============================

// DOM
const game = document.getElementById("game");

const bgSky = document.getElementById("bg-sky");
const bgSea = document.getElementById("bg-sea");

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const enemy = document.getElementById("enemy");
const fruit = document.getElementById("fruit");

const startBtn = document.getElementById("startBtn");
const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");

// Estado global
let isGameRunning = false;
let score = 0;
let lives = 3;

function updateUI() {
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
}

// ----------------------
// PARALLAX
// ----------------------
let skyOffset = 0;
let seaX = 0;

const skySpeed = 0.4;
const seaSpeed = 1.2;

function moveBackground() {
  // Cielo: desplazamiento con background-position
  skyOffset -= skySpeed;
  bgSky.style.backgroundPosition = `${skyOffset}px 0`;

  // Mar: muevo el div completo
  seaX -= seaSpeed;
  if (seaX <= -800) seaX = 0; // 800 = ancho visible
  bgSea.style.left = seaX + "px";
}

// ----------------------
// JUGADOR
// ----------------------
const GROUND_Y = 200; // altura real en píxeles (top)

let playerScreenY = GROUND_Y;
let playerVelocityY = 0;

let playerX = 100;
const playerSpeed = 5;

const gravity = 0.6;
const jumpForce = -12;

const keys = { left: false, right: false };

document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;

  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;

  if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
    jump();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
});

function movePlayerHorizontal() {
  if (keys.left) playerX -= playerSpeed;
  if (keys.right) playerX += playerSpeed;

  if (playerX < 0) playerX = 0;
  if (playerX > game.clientWidth - player.clientWidth) {
    playerX = game.clientWidth - player.clientWidth;
  }

  player.style.left = playerX + "px";
}

function jump() {
  // pequeña tolerancia para evitar problemas con flotantes
  if (Math.abs(playerScreenY - GROUND_Y) < 1) {
    playerVelocityY = jumpForce;
  }
}

function applyPhysics() {
  playerVelocityY += gravity;
  playerScreenY += playerVelocityY;

  if (playerScreenY >= GROUND_Y) {
    playerScreenY = GROUND_Y;
    playerVelocityY = 0;
  }

  player.style.top = playerScreenY + "px";
}

// ----------------------
// OBSTÁCULO (CICLISTA)
// ----------------------
let obstacleX = 800;
const obstacleSpeed = 4;

function resetObstacle() {
  obstacleX = 800;
  obstacle.style.left = obstacleX + "px";
  obstacle.style.top = "200px";
}

function moveObstacleLoop() {
  if (!isGameRunning) return;

  obstacleX -= obstacleSpeed;
  obstacle.style.left = obstacleX + "px";

  if (obstacleX < -100) {
    score += 1;
    updateUI();
    resetObstacle();
  }

  requestAnimationFrame(moveObstacleLoop);
}

// ----------------------
// ENEMIGO AÉREO (GAVIOTA)
// ----------------------
let enemyX = 900;
const ENEMY_Y = 140;
const enemySpeed = 3;

function resetEnemy() {
  enemyX = 900;
  enemy.style.left = enemyX + "px";
  enemy.style.top = ENEMY_Y + "px";
}

function moveEnemyLoop() {
  if (!isGameRunning) return;

  enemyX -= enemySpeed;
  enemy.style.left = enemyX + "px";

  if (enemyX < -100) {
    score += 1;
    updateUI();
    resetEnemy();
  }

  requestAnimationFrame(moveEnemyLoop);
}

// ----------------------
// FRUTA (PUNTOS)
// ----------------------
let fruitX = 900;
const FRUIT_Y = 210;
const fruitSpeed = 3;

function resetFruit() {
  fruitX = 900;
  fruit.style.left = fruitX + "px";
  fruit.style.top = FRUIT_Y + "px";
}

function moveFruitLoop() {
  if (!isGameRunning) return;

  fruitX -= fruitSpeed;
  fruit.style.left = fruitX + "px";

  if (fruitX < -100) {
    resetFruit();
  }

  requestAnimationFrame(moveFruitLoop);
}

// ----------------------
// COLISIONES
// ----------------------
function isOverlapping(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function checkCollisions() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();
  const fruitRect = fruit.getBoundingClientRect();

  // Hitbox baja (suelo)
  const groundPlayerRect = {
    left: playerRect.left + playerRect.width * 0.2,
    right: playerRect.right - playerRect.width * 0.2,
    top: playerRect.bottom - playerRect.height * 0.4,
    bottom: playerRect.bottom
  };

  // Hitbox alta (aire)
  const airPlayerRect = {
    left: playerRect.left + playerRect.width * 0.1,
    right: playerRect.right - playerRect.width * 0.1,
    top: playerRect.top,
    bottom: playerRect.top + playerRect.height * 0.6
  };

  // Obstáculo suelo
  if (isOverlapping(groundPlayerRect, obstacleRect)) {
    onHit("ground");
  }

  // Enemigo aéreo
  if (isOverlapping(airPlayerRect, enemyRect)) {
    onHit("air");
  }

  // Fruta
  const fruitOverlap = isOverlapping(playerRect, fruitRect);
  if (fruitOverlap) {
    score += 5;
    updateUI();
    resetFruit();
  }
}

function onHit(type) {
  lives -= 1;
  updateUI();

  if (type === "ground") resetObstacle();
  if (type === "air") resetEnemy();

  if (lives <= 0) {
    gameOver();
  }
}

// ----------------------
// GAME LOOP
// ----------------------
function gameLoop() {
  if (!isGameRunning) return;

  moveBackground();
  movePlayerHorizontal();
  applyPhysics();
  checkCollisions();

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  isGameRunning = false;
  alert("GAME OVER");
}

// ----------------------
// START
// ----------------------
function startGame() {
  if (isGameRunning) return;

  isGameRunning = true;
  score = 0;
  lives = 3;
  updateUI();

  skyOffset = 0;
  seaX = 0;
  bgSky.style.backgroundPosition = "0px 0px";
  bgSea.style.left = "0px";

  playerX = 100;
  playerScreenY = GROUND_Y;
  playerVelocityY = 0;
  player.style.left = playerX + "px";
  player.style.top = playerScreenY + "px";

  resetObstacle();
  resetEnemy();
  resetFruit();

  moveObstacleLoop();
  moveEnemyLoop();
  moveFruitLoop();
  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);