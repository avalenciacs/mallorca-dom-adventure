// ==========================================================
// MALLORCA ADVENTURE 
// ==========================================================

// ==========================================================
// DOM ELEMENTS
// ==========================================================
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
const highScoreSpan = document.getElementById("highScore");

// INTRO SCREEN
const introVideoContainer = document.getElementById("introVideoContainer");
const introBackground = document.getElementById("introBackground");
const introVideo = document.getElementById("introVideo");

// GAME OVER SCREEN
const gameoverScreen = document.getElementById("gameover-screen");
const finalScoreSpan = document.getElementById("finalScore");
const finalHighScoreSpan = document.getElementById("finalHighScore");
const returnIntroBtn = document.getElementById("returnIntroBtn");

// ==========================================================
// GLOBAL STATE
// ==========================================================
let isGameRunning = false;
let score = 0;
let lives = 3;
let birdsKilled = 0;

// High Score (LocalStorage)
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;

highScoreSpan.textContent = highScore;

// difficulty
let difficultyLevel = 1;

function updateUI() {
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
  birdsSpan.textContent = birdsKilled;
}

// ==========================================================
// +1 LIFE
// ==========================================================
function showLifePopup() {
  const popup = document.getElementById("lifePopup");

  popup.style.opacity = "1";
  popup.style.transform = "translateX(-50%) translateY(-40px)";

  // ocultarlo después
  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translateX(-50%) translateY(0px)";
  }, 800);
}

// ==========================================================
// Music
// ==========================================================
const bgMusic = new Audio("./assets/audio/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.02;

// Garantiza que nunca lanza .play() dos veces seguidas
let musicStarted = false;
// ==========================================================
// INTRO CLICK → CLOSE INTRO
// ==========================================================
function closeIntro() {
  introVideo.pause();
  introVideoContainer.style.display = "none";
}

introVideoContainer.addEventListener("click", closeIntro);
introBackground.addEventListener("click", closeIntro);
introVideo.addEventListener("click", closeIntro);

// ==========================================================
// PARALLAX
// ==========================================================
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


// ==========================================================
// ENTITY SIZES (FROM CSS ELEMENTS)
// ==========================================================
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

// ==========================================================
// justScale
// ==========================================================
function adjustScale() {
  const baseWidth = 800;
  const availableWidth = window.innerWidth;

  const scale = availableWidth / baseWidth;

  // límite máximo 1.2 (si quieres que se agrande un poco) o 1 exacto (tamaño real)
  const finalScale = Math.min(scale, 1);

  document.documentElement.style.setProperty("--scale", finalScale);
}

window.addEventListener("load", adjustScale);
window.addEventListener("resize", adjustScale);
// ==========================================================
// PLAYER
// ==========================================================
const GROUND_Y = 200;

const player = {
  x: 100,
  y: GROUND_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  velY: 0,
  speed: 5
};

// ==========================================================
// OBSTACLE (CYCLIST)
// ==========================================================
const obstacle = {
  x: 800,
  y: 200,
  width: OBSTACLE_WIDTH,
  height: OBSTACLE_HEIGHT,
  speed: 4
};

// ==========================================================
// ENEMY (SEAGULL)
// ==========================================================
const ENEMY_Y = 140;

const enemy = {
  x: 900,
  y: ENEMY_Y,
  width: ENEMY_WIDTH,
  height: ENEMY_HEIGHT,
  speed: 3
};

// ==========================================================
// FRUITS (RANDOM TYPE)
// ==========================================================
const fruitTypes = [
  { name: "banana", src: "./assets/sprites/banana.png", width: 30, height: 30 },
  { name: "apple", src: "./assets/sprites/apple.png", width: 30, height: 30 },
  { name: "water", src: "./assets/sprites/water.png", width: 30, height: 30 }
];

const FRUIT_Y = 210;

const fruit = {
  x: 900,
  y: FRUIT_Y,
  width: FRUIT_WIDTH,
  height: FRUIT_HEIGHT,
  speed: 3,
  type: null
};

// ==========================================================
// INPUT HANDLING
// ==========================================================
const gravity = 0.6;
const jumpForce = -12;

const keys = { left: false, right: false };

document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;

  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") jump();

  // Throw frisbee
  if (e.key === "f" || e.key === "F" || e.code === "Numpad0") throwFrisbee();
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
});

// ==========================================================
// PLAYER MOVEMENT
// ==========================================================
function movePlayerHorizontal() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x > game.clientWidth - player.width)
    player.x = game.clientWidth - player.width;
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

// ==========================================================
// FRISBEE
// ==========================================================
let frisbeeActive = false;
let frisbeeX = 0;
let frisbeeY = 0;
const frisbeeSpeed = 10;

function throwFrisbee() {
  if (frisbeeActive) return;

  frisbeeActive = true;

  frisbeeX = player.x + player.width - 10;
  frisbeeY = player.y + player.height * 0.25;

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

// ==========================================================
// ENTITY MOVEMENT
// ==========================================================
function resetObstacle() {
  obstacle.x = game.clientWidth + 50;
}

function resetEnemy() {
  enemy.x = game.clientWidth + 150;
  enemy.y = ENEMY_Y;
}

function resetFruit() {
  const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];

  fruit.type = randomFruit.name;
  fruit.x = game.clientWidth + 200;
  fruit.y = FRUIT_Y;

  fruit.width = randomFruit.width;
  fruit.height = randomFruit.height;

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

  // Wavy motion (difficulty increases)
  enemy.y =
    ENEMY_Y +
    Math.sin(enemy.x * 0.03 * difficultyLevel) * (15 + difficultyLevel * 3);

  if (enemy.x < -enemy.width) {
    score++;
    updateUI();
    resetEnemy();
  }
}

function moveFruit() {
  fruit.x -= fruit.speed;
  if (fruit.x < -fruit.width) resetFruit();
}

// ==========================================================
// RENDER LOOP
// ==========================================================
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

// ==========================================================
// COLLISIONS (AABB)
// ==========================================================
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
    x: fruit.x + fruit.width * 0.45,
    y: fruit.y + fruit.height * 0.45,
    width: fruit.width * 0.15,
    height: fruit.height * 0.15
  };
}

function checkCollisions() {
  const pHB = getPlayerHitbox();
  const oHB = getObstacleHitbox();
  const eHB = getEnemyHitbox();
  const fHB = getFruitHitbox();

  if (isColliding(pHB, oHB)) {
    handleDamage();
    resetObstacle();
  }

  if (isColliding(pHB, eHB)) {
    handleDamage();
    resetEnemy();
  }

  if (isColliding(pHB, fHB)) {
    score += 5;
    updateUI();

    if (score > highScore) {
      highScore = score;
      highScoreSpan.textContent = highScore;
      localStorage.setItem("highScore", highScore);
    }

    resetFruit();
  }


  // ===============================
  //  FRISBEE → SEAGULL
  // ===============================
  if (frisbeeActive) {
    const frisbeeHB = {
      x: frisbeeX,
      y: frisbeeY,
      width: FRISBEE_WIDTH,
      height: FRISBEE_HEIGHT
    };

    const enemyHB = getEnemyHitbox();

    if (isColliding(frisbeeHB, enemyHB)) {
      birdsKilled++;
      score += 10;
      updateUI();

      // ⭐ Cada 20 gaviotas → +1 vida (SIN límite)
      if (birdsKilled % 20 === 0) {
        lives++;
        updateUI();
        showLifePopup();
      }

      // Actualizar highscore
      if (score > highScore) {
        highScore = score;
        highScoreSpan.textContent = highScore;
        localStorage.setItem("highScore", highScore);
      }

      resetEnemy();
      deactivateFrisbee();
    }
  }
}

// ==========================================================
// DAMAGE & GAME OVER
// ==========================================================
function handleDamage() {
  lives--;
  updateUI();
  if (lives <= 0) gameOver();
}

function gameOver() {
  isGameRunning = false;

  // Update highscore
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  // pausar música suavemente
  bgMusic.pause();
  bgMusic.currentTime = 0;

  finalScoreSpan.textContent = score;
  finalHighScoreSpan.textContent = highScore;

  gameoverScreen.classList.remove("hidden");
}

// Close GameOver → just hide it (no intro reload here)
returnIntroBtn.addEventListener("click", () => {

  // Ocultar pantalla de Game Over
  gameoverScreen.classList.add("hidden");

  // Mostrar intro de nuevo
  introVideoContainer.style.display = "flex";

  // Reiniciar el video y reproducirlo
  introVideo.currentTime = 0;
  introVideo.play();

  // Reset de estado
  isGameRunning = false;
  frisbeeActive = false;

  // Ocultar frisbee si estaba activo
  frisbee.style.display = "none";
});

// ==========================================================
// DIFFICULTY
// ==========================================================
function increaseDifficulty() {
  // Cada 200 puntos sube un nivel
  const steps = Math.floor(score / 100);

  // dificultad base + progresión
  difficultyLevel = 1 + steps * 0.10;  // +5% por nivel

  // aplicar la velocidad escalada a cada objeto
  obstacle.speed = 4 * difficultyLevel;
  enemy.speed = 3 * difficultyLevel;
  fruit.speed = 3 * difficultyLevel;
}

// ==========================================================
// MAIN LOOP
// ==========================================================
function gameLoop() {
  if (!isGameRunning) return;

  moveBackground();
  movePlayerHorizontal();
  applyPhysics();

  moveObstacle();
  moveEnemy();
  moveFruit();
  moveFrisbee();

  increaseDifficulty();
  checkCollisions();
  render();

  requestAnimationFrame(gameLoop);
}

// ==========================================================
// START GAME
// ==========================================================
function startGame() {
  if (isGameRunning) return;

  keys.left = false;
  keys.right = false;

  isGameRunning = true;
  score = 0;
  lives = 3;
  birdsKilled = 0;
  difficultyLevel = 1;


  updateUI();

  skyOffset = 0;
  seaOffset = 0;

  player.x = 100;
  player.y = GROUND_Y;
  player.velY = 0;

  resetObstacle();
  resetEnemy();
  resetFruit();

  // ---------------------------
  //   AUDIO
  // ---------------------------
  bgMusic.play()
    .then(() => {
      musicStarted = true;
    })
    .catch(() => {
      console.warn("Audio bloqueado. Se reproducirá al próximo Start.");
      musicStarted = false;
    });




  render();
  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);