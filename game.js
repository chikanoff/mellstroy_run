const gameWindow = document.getElementById('gameWindow');
const dino = document.getElementById('dino');
const scoreDisplay = document.getElementById('score');
const startButtonContainer = document.getElementById('startButtonContainer');

let jumping = false;
let gravity = 0.3;
let dinoBottom = 0;
let obstacles = [];
let interval;
let obstacleInterval; // Добавляем переменную для интервала генерации препятствий
let score = 0; // Инициализируем счетчик
let generatingObstacles; // Переменная для отслеживания генерации препятствий

function startGame() {
    generatingObstacles = true;
    document.getElementById('resultDisplay').style.display = 'none';
    interval = setInterval(() => {
      moveDino();
      moveObstacles(); // Изменяем вызов функции
      checkCollision();
    }, 20);
  
    obstacleInterval = setInterval(() => {
      if (generatingObstacles) {
        createObstacle();
      }
    }, 1800); // Запускаем интервал генерации препятствий
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
      if (dinoBottom >= 180) {
        clearInterval(jumpInterval);
        let fallSpeed = 2;
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
        }, 25);
      } else {
        dinoBottom += 7;
        dino.style.bottom = dinoBottom + 'px';
      }
    }, 20);
  }
}

function moveObstacles() {
    obstacles.forEach(obstacle => {
        moveObstacle(obstacle); // Вызываем moveObstacle для каждого препятствия
    });
}

function moveObstacle(obstacle) {
    if (!gameWindow.contains(obstacle)) return; // Добавляем проверку на существование препятствия
    if (!obstacle.moveInterval) { // Проверяем, есть ли уже у препятствия интервал перемещения
        obstacle.moveInterval = setInterval(() => {
            const currentLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
            if (currentLeft > 0) {
                obstacle.style.left = (currentLeft - 2.3) + 'px'; // Перемещаем препятствие влево
            } else {
                clearInterval(obstacle.moveInterval); // Очищаем интервал перемещения препятствия
                if (gameWindow.contains(obstacle)) { // Проверяем, содержится ли препятствие в игровом окне
                    obstacle.parentNode.removeChild(obstacle); // Удаляем препятствие
                    obstacles.splice(obstacles.indexOf(obstacle), 1);
                    incrementScore(); // Увеличиваем счетчик при преодолении препятствия
                }
            }
        }, 10); // Изменяем интервал на 100 миллисекунд
    }
}


const obstacleImages = ["images/obstacle1.png", "images/obstacle2.png"];

function createObstacle() {
  const obstacle = document.createElement('img');
  obstacle.classList.add('obstacle');
  obstacle.style.left = '600px';

  // Выбираем случайное изображение из массива
  const randomIndex = Math.floor(Math.random() * obstacleImages.length);
  const imagePath = obstacleImages[randomIndex];

  // Загружаем изображение, чтобы получить его размеры
  const tempImg = new Image();
  tempImg.src = imagePath;
  tempImg.onload = function() {
    obstacle.style.height = tempImg.height + 'px'; // Устанавливаем высоту изображения
    obstacle.style.width = tempImg.width + 'px'; // Устанавливаем ширину изображения
  };

  obstacle.src = imagePath; // Устанавливаем путь к изображению

  gameWindow.appendChild(obstacle);
  obstacles.push(obstacle);

  console.log("Created obstacle:", obstacle);

//   obstacleMoveInterval = setInterval(() => {
//     const currentLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    
//     if (currentLeft > 0) {
//       obstacle.style.left = (currentLeft - 2) + 'px'; // Скорость перемещения препятствий
//     } else {
//       obstacle.parentNode.removeChild(obstacle);
//       clearInterval(obstacleMoveInterval);
//       obstacles.splice(obstacles.indexOf(obstacle), 1);
//       incrementScore(); // Увеличиваем счетчик при преодолении препятствия
//     }
//   }, 10);
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
            clearInterval(obstacleInterval); // Очищаем интервал генерации препятствий
            // alert('Game Over! Your score: ' + score);
            endGame();
        }
    });
}

function endGame() {
    generatingObstacles = false; // Останавливаем генерацию препятствий
    clearInterval(interval); // Останавливаем интервал обновления игры
    clearInterval(obstacleInterval); // Останавливаем интервал генерации препятствий

    // Удаляем все препятствия
    obstacles.forEach(obstacle => obstacle.parentNode.removeChild(obstacle));
    obstacles = [];

    document.getElementById('resultDisplay').innerText = 'Game Over! Your score: ' + score; // Устанавливаем результат игры
    document.getElementById('resultDisplay').style.display = 'block'; // Показываем элемент с результатом
    // startButtonContainer.style.display = 'flex'; // Показываем кнопку начать игру
    startButtonContainer.style.display = 'flex'; // Показываем кнопку начать игру
    resetGame();
}


function resetGame() {
    // Останавливаем все интервалы, связанные с препятствиями
    obstacles.forEach(obstacle => clearInterval(obstacle.moveInterval));
  
    // Удаляем все препятствия из DOM и массива obstacles
    obstacles.forEach(obstacle => obstacle.parentNode.removeChild(obstacle));
    obstacles = [];
  
    // Сбрасываем счетчик
    score = 0;
    scoreDisplay.innerText = score;
  
    // Перемещаем динозавра в исходное положение
    dino.style.bottom = '0px';
    dinoBottom = 0;
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

startButton.addEventListener('click', function() {
    startButtonContainer.style.display = 'none'; // Скрываем кнопку "Начать игру"
    gameWindow.style.display = 'block'; // Отображаем игровое окно
    scoreDisplay.style.display = 'block'; // Отображаем счетчик

    resetGame();
    startGame(); // Запускаем игру
  });
