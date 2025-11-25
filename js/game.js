// =====================================================
// MALLORCA ADVENTURE – Colisiones, Puntos y Vidas
// =====================================================

// --------- DOM ---------
const game = document.getElementById("game");

const sky = document.getElementById("bg-sky");
const sea = document.getElementById("bg-sea");

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const enemy = document.getElementById("enemy");

const startBtn = document.getElementById("startBtn");
const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");
const bgMusic = document.getElementById("bgMusic");

// --------- ESTADO GLOBAL ---------
let isGameRunning = false;
let score = 0;
let lives = 3;

// UI
function updateUI() {
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
}

// --------- PARALLAX FONDO ---------
let skyX = 0;
let seaX = 0;

const speedSky = 1.2;
const speedSea = 0.4;

function moveBackground() {
  skyX -= speedSky;
  if (skyX <= -800) skyX = 0;
  sky.style.left = skyX + "px";

  seaX -= speedSea;
  if (seaX <= -800) seaX = 0;
  sea.style.left = seaX + "px";
}

// --------- JUGADOR ---------
const GROUND_Y = 200;      // altura real del suelo (coincide con top en CSS)
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
  if (Math.abs(playerScreenY - GROUND_Y) < 1) {
    playerVelocityY = jumpForce;
  }
}

function applyPhysics() {
  // gravedad
  playerVelocityY += gravity;

  // mover vertical
  playerScreenY += playerVelocityY;

  // suelo con tolerancia mínima
  if (playerScreenY >= GROUND_Y) {
    playerScreenY = GROUND_Y;
    playerVelocityY = 0;
  }

  // aplicar posición en pantalla
  player.style.top = playerScreenY + "px";
}
// --------- OBSTÁCULO (carretera) ---------
let obstacleX = 800;
const obstacleSpeed = 4;

function resetObstacle() {
  obstacleX = 800;
  obstacle.style.left = obstacleX + "px";
  obstacle.style.top = "215px"; // por si acaso
}

function moveObstacleLoop() {
  if (!isGameRunning) return;

  obstacleX -= obstacleSpeed;
  obstacle.style.left = obstacleX + "px";

  // si pasa por el borde izquierdo sin colisión → punto
  if (obstacleX < -50) {
    score += 1;
    updateUI();
    resetObstacle();
  }

  requestAnimationFrame(moveObstacleLoop);
}

// --------- ENEMIGO VOLADOR (gaviota) ---------
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

  // si pasa sin colisión → punto
  if (enemyX < -50) {
    score += 1;
    updateUI();
    resetEnemy();
  }

  requestAnimationFrame(moveEnemyLoop);
}

// --------- COLISIONES ---------

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

  // Zona baja del jugador (para colisión con obstáculo)
  const groundPlayerRect = {
    left: playerRect.left + playerRect.width * 0.2,
    right: playerRect.right - playerRect.width * 0.2,
    top: playerRect.bottom - playerRect.height * 0.4,
    bottom: playerRect.bottom
  };

  // Zona alta del jugador (para colisión con enemigo aéreo)
  const airPlayerRect = {
    left: playerRect.left + playerRect.width * 0.1,
    right: playerRect.right - playerRect.width * 0.1,
    top: playerRect.top,
    bottom: playerRect.top + playerRect.height * 0.6
  };

  // Colisión con obstáculo suelo
  if (isOverlapping(groundPlayerRect, obstacleRect)) {
    onHit("ground");
  }

  // Colisión con enemigo aire
  if (isOverlapping(airPlayerRect, enemyRect)) {
    onHit("air");
  }
}

function onHit(type) {
  lives -= 1;
  updateUI();

  if (type === "ground") {
    resetObstacle();
  } else if (type === "air") {
    resetEnemy();
  }

  if (lives <= 0) {
    gameOver();
  }
}

// --------- GAME LOOP ---------
function gameLoop() {
  if (!isGameRunning) return;

  moveBackground();
  movePlayerHorizontal();
  applyPhysics();
  checkCollisions();

  requestAnimationFrame(gameLoop);
}

// --------- GAME OVER ---------
function gameOver() {
  isGameRunning = false;
  bgMusic.pause();
  alert("GAME OVER");
}

// --------- START ---------
function startGame() {
  if (isGameRunning) return;

  // reset estado
  isGameRunning = true;
  score = 0;
  lives = 3;
  updateUI();

  // reset posiciones
  skyX = 0;
  seaX = 0;
  sky.style.left = "0px";
  sea.style.left = "0px";

  playerX = 100;
  playerScreenY = GROUND_Y;
  playerVelocityY = 0;
  player.style.left = playerX + "px";
  player.style.top = playerScreenY + "px";

  resetObstacle();
  resetEnemy();

  // música
  if (bgMusic) {
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.4;
    bgMusic.play();
  }

  // iniciar loops
  moveObstacleLoop();
  moveEnemyLoop();
  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);