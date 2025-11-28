# Mallorca Adventure – Endless Runner (Project 1)

A retro pixel‑art endless runner built with **HTML, CSS, and vanilla JavaScript** for Ironhack’s Web Development Bootcamp.  
The game features smooth movement, hitbox‑based collisions, parallax backgrounds, power‑ups, enemies, sound effects, and progressive difficulty.

---

## 🎮 Game Overview

**Mallorca Adventure** is a side‑scrolling endless runner where you:
- Ride across Mallorca’s seaside roads.
- Avoid cyclists and aggressive seagulls.
- Collect fruits for extra points.
- Throw your frisbee to defeat enemies.
- Survive as long as possible while the game becomes faster.

**Every 20 seagulls defeated = +1 extra life.**

---

## 🕹️ Controls

| Action | Key |
|-------|------|
| Move Left | **A** / **←** |
| Move Right | **D** / **→** |
| Jump | **W** / **↑** / **Space** |
| Throw Frisbee | **F** / **Numpad 0** |

---

## ✨ Main Features

### ✔ Parallax Background  
Smooth multilayer parallax effect (sky, mountains, sea, road) creating depth.

### ✔ Player Movement & Physics  
- Horizontal movement with acceleration.  
- Jumping with gravity simulation.  
- Pixel‑precise hitboxes.

### ✔ Enemies & Obstacles  
- Cyclist (ground obstacle)  
- Seagull (air enemy, wavy movement)  
- Fruits (random type: banana, apple, water)

### ✔ Projectile System  
Frisbee shoots forward and destroys enemies if it collides.

### ✔ Progressive Difficulty  
Speed increases gradually based on score.

### ✔ Lives & Extra Life System  
+1 life every 20 seagulls defeated.

### ✔ Game Over Screen  
Displays final score, high score and option to return to intro.

### ✔ Animated Intro Video  
Loops until user clicks to continue.

### ✔ Music & Sound  
Retro GBA‑style loop, low‑volume background.

---

## 🧠 Technical Breakdown

### Core Technologies
- **JavaScript**
- **HTML5**
- **CSS3**
- **LocalStorage** (high score memory)

### Game Loop
```js
requestAnimationFrame(gameLoop);
```

### Collision System
AABB (Axis‑Aligned Bounding Box) with tuned hitboxes.

### Responsive Scaling
```css
transform: scale(var(--scale));
```

---

## 📁 Folder Structure

```
project/
│ index.html
│ README.md
│
├─ css/
│   └─ styles.css
│
├─ js/
│   └─ game.js
│
├─ assets/
│   ├─ sprites/
│   ├─ backgrounds/
│   ├─ audio/
│   └─ video/
```

---

## 🚀 How to Run
Just open **index.html** in a web browser.

---

## 🧪 Future Improvements
- Touch/mobile controls  
- Better animations  
- Multi‑enemy system  
- Boss mode  

---

## 👤 Author
**Anderson Valencia Castaño**  
Ironhack Web Development – 2025
