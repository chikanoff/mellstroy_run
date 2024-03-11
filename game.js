const gameWindow = document.getElementById('gameWindow');
const dino = document.getElementById('dino');
const scoreDisplay = document.getElementById('score');

let jumping = false;
let gravity = 0.6;
let dinoBottom = 0;
let dinoHeight = 20; // Уменьшаем высоту хитбокса динозавра
let obstacles = [];
let interval;
let score = 0; // Инициализируем счетчик

function startGame() {
  interval = setInterval(() => {
    moveDino();
    moveObstacles();
    checkCollision();
  }, 20);
  setInterval(createObstacle, 2000);
}

function moveDino() {
  if (jumping) return;
  if (dinoBottom > 0) {
    dinoBottom -= gravity;
    dino.style.bottom = dinoBottom + 'px';
  }
}

function jump() {
  if (jumping) return;
  jumping = true;
  if (dinoBottom === 0) {
    let jumpInterval = setInterval(() => {
      if (dinoBottom >= 120) {
        clearInterval(jumpInterval);
        let fallSpeed = 4;
        let fallInterval = setInterval(() => {
          if (dinoBottom <= 0) {
            clearInterval(fallInterval);
            jumping = false;
            dinoBottom = 0;
            dino.style.bottom = dinoBottom + 'px'; // Убедимся, что динозавр не опускается ниже нуля
          } else {
            fallSpeed += gravity;
            dinoBottom -= fallSpeed;
            if (dinoBottom < 0) {
              dinoBottom = 0;
            }
            dino.style.bottom = dinoBottom + 'px';
          }
        }, 30);
      } else {
        dinoBottom += 8;
        dino.style.bottom = dinoBottom + 'px';
      }
    }, 20);
  }
}

function moveObstacles() {
  obstacles.forEach(obstacle => {
    const currentLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    if (currentLeft > 0) {
      obstacle.style.left = (currentLeft - 5) + 'px';
    } else {
      obstacle.parentNode.removeChild(obstacle);
    }
  });
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = '400px';
  const maxHeight = 30; // Максимальная высота препятствия
  const randomHeight = Math.random() * maxHeight + 20;
  obstacle.style.height = randomHeight + 'px';
  gameWindow.appendChild(obstacle);
  obstacles.push(obstacle);

  console.log("Created obstacle:", obstacle);

  let obstacleMoveInterval = setInterval(() => {
    const currentLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    if (currentLeft > 0) {
      obstacle.style.left = (currentLeft - 2) + 'px'; // Скорость перемещения препятствий
    } else {
      obstacle.parentNode.removeChild(obstacle);
      clearInterval(obstacleMoveInterval);
      obstacles.splice(obstacles.indexOf(obstacle), 1);
      incrementScore(); // Увеличиваем счетчик при преодолении препятствия
    }
  }, 20);
}

function checkCollision() {
  const dinoRect = dino.getBoundingClientRect();
  obstacles.forEach(obstacle => {
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      dinoRect.bottom >= obstacleRect.top &&
      dinoRect.top <= obstacleRect.bottom &&
      dinoRect.right >= obstacleRect.left &&
      dinoRect.left <= obstacleRect.right
    ) {
      clearInterval(interval);
      alert('Game Over! Your score: ' + score);
      endGame();
    }
  });
}

function endGame() {
    gameWindow.style.display = 'none'; // Скрываем игровое окно
    scoreDisplay.style.display = 'none'; // Скрываем счетчик
}
  

function incrementScore() {
  score++; // Увеличиваем счетчик
  scoreDisplay.innerText = score; // Обновляем отображение счетчика
}

document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    jump();
  }
});

document.addEventListener('mousedown', event => {
  if (event.button === 0) {
    jump();
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const startButtonContainer = document.getElementById('startButtonContainer');
    const gameWindow = document.getElementById('gameWindow');
    const scoreDisplay = document.getElementById('score');
  
    startButton.addEventListener('click', function() {
      startButtonContainer.style.display = 'none'; // Скрываем кнопку "Начать игру"
      gameWindow.style.display = 'block'; // Отображаем игровое окно
      scoreDisplay.style.display = 'block'; // Отображаем счетчик
  
      startGame(); // Запускаем игру
    });
  });
  
