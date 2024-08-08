//https://www.youtube.com/watch?v=Je0B3nHhKmM

const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const challengeFoodColor = "gray";
const unitSize = 25;
const eatAudio = document.getElementById('eatAudio');
const gameOverAudio = document.getElementById('gameOverAudio');
let speed;
let running = false; //running will be examined to see if game is currently running
let xVelocity = unitSize; //if xVelocity is positive, snake moves to right; if negative, snake moves to left
let yVelocity = 0;
let foodX;
let foodY;
let challengeFoodX;
let challengeFoodY;
let score = 0;
let snake = [ //each object is one body part of snake
    {x: unitSize * 4, y: unitSize},
    {x: unitSize * 3, y: unitSize},    
    {x: unitSize * 2, y: unitSize},
    {x: unitSize, y: unitSize},
    {x: 0, y: unitSize}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    speed = 150;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}
function nextTick() {
    if(running) {
        setTimeout(()=> {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, speed);
    }
    else {
        displayGameOver();
    }
}
function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }

    //foodX cannot equal 0, meaning left border
    //foodY cannot equal 0, meaning upper border
    //foodX cannot equal gameWidth, meaning right border
    //foodY cannot equal gameHeight, meaning lower border

    foodX = randomFood(25, gameWidth - (2 * unitSize));
    foodY = randomFood(25, gameHeight - (2 * unitSize));
}
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake() {
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    snake.unshift(head);
    //if snake eats food
    if(snake[0].x === foodX && snake[0].y === foodY) {
        eatAudio.play();
        score += 1;
        if(score % 10 === 0) {
            speed -= 50;
        }
        scoreText.textContent = score;
        createFood();
    }
    else {
        snake.pop();
    }
}
function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
}
function changeDirection(event) {
    const keyPressed = event.keyCode;
    console.log(keyPressed);
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;


    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch(true) {
        case(keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize; //snake moves left
            yVelocity = 0; //snake does not move on the y-axis
            break;
        case(keyPressed === UP && !goingDown):
            xVelocity = 0; //snake does not move on the x-axis
            yVelocity = -unitSize; //snake moves up
            break;
        case(keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize; //snake moves right
            yVelocity = 0; //snake does not move on the y-axis
            break;
        case(keyPressed === DOWN && !goingUp):
            xVelocity = 0; //snake does not move on the x-axis
            yVelocity = unitSize; //snake moves down
            break;
    }
}
function checkGameOver() {
    switch(true) {
        case(snake[0].x < unitSize): //snake crossed left border
            running = false;
            gameOverAudio.play();
            break;
        case(snake[0].x >= gameWidth - unitSize): //snake crossed right border
            running = false;
            gameOverAudio.play();
            break;
        case(snake[0].y == 0): //snake crossed upper border
            running = false;
            gameOverAudio.play();
            break;
        case(snake[0].y >= gameHeight - unitSize): //snake crossed lower border
            running = false;
            gameOverAudio.play();
            break;
    }

    //checks if any of the snake's body parts overlap
    for(let i = 1 /*so head is excluded*/; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            gameOverAudio.play();
        }
    }
}
function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}
function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 4, y: unitSize},
        {x: unitSize * 3, y: unitSize},    
        {x: unitSize * 2, y: unitSize},
        {x: unitSize, y: unitSize},
        {x: 0, y: unitSize}
    ];
    gameStart();
}