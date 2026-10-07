let gameRunning = false;

let score = 0;
let coins = 0;
let distance = 0;

let gameSpeed = 3;

let playerLane = 1;

let obstacleTimer;
let coinTimer;
let gameLoop;
let distanceTimer;

let isJumping = false;

let bestScore =
    Number(localStorage.getItem("naijaBestScore")) || 0;


/* =========================
   ELEMENTS
========================= */

const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const homeButton =
    document.getElementById("homeButton");

const player =
    document.getElementById("player");

const obstacleContainer =
    document.getElementById("obstacleContainer");

const coinContainer =
    document.getElementById("coinContainer");

const scoreDisplay =
    document.getElementById("score");

const coinsDisplay =
    document.getElementById("coins");

const distanceDisplay =
    document.getElementById("distance");

const finalScore =
    document.getElementById("finalScore");

const finalCoins =
    document.getElementById("finalCoins");

const finalDistance =
    document.getElementById("finalDistance");

const bestScoreText =
    document.getElementById("bestScoreText");

const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");

const jumpButton =
    document.getElementById("jumpButton");


/* =========================
   LANE POSITION
========================= */

function getLanePosition(lane) {

    const road =
        document.querySelector(".road");

    const roadWidth =
        road.clientWidth;

    if (lane === 0) {
        return roadWidth * 0.27;
    }

    if (lane === 1) {
        return roadWidth * 0.50;
    }

    return roadWidth * 0.73;
}


/* =========================
   PLAYER POSITION
========================= */

function updatePlayerPosition() {

    const position =
        getLanePosition(playerLane);

    player.style.left =
        position + "px";

    player.style.transform =
        "translateX(-50%)";
}


/* =========================
   MOVE LEFT
========================= */

function moveLeft() {

    if (!gameRunning) return;

    if (playerLane > 0) {

        playerLane--;

        updatePlayerPosition();
    }
}


/* =========================
   MOVE RIGHT
========================= */

function moveRight() {

    if (!gameRunning) return;

    if (playerLane < 2) {

        playerLane++;

        updatePlayerPosition();
    }
}


/* =========================
   JUMP
========================= */

function jump() {

    if (!gameRunning) return;

    if (isJumping) return;

    isJumping = true;

    player.style.bottom = "100px";

    player.style.transform =
        "translateX(-50%) scale(1.15)";


    setTimeout(function () {

        player.style.bottom = "25px";

        player.style.transform =
            "translateX(-50%) scale(1)";


        setTimeout(function () {

            isJumping = false;

        }, 150);

    }, 550);
}


/* =========================
   CREATE OBSTACLE
========================= */

function createObstacle() {

    if (!gameRunning) return;

    const obstacle =
        document.createElement("div");

    obstacle.className =
        "obstacle";


    const obstacleTypes = [
        "🚗",
        "🚕",
        "🚌",
        "🛵",
        "🕳️"
    ];


    obstacle.textContent =
        obstacleTypes[
            Math.floor(
                Math.random() *
                obstacleTypes.length
            )
        ];


    const lane =
        Math.floor(Math.random() * 3);


    obstacle.dataset.lane =
        lane;


    obstacle.style.left =
        getLanePosition(lane) + "px";


    obstacle.style.transform =
        "translateX(-50%)";


    obstacle.style.top =
        "-70px";


    obstacleContainer.appendChild(
        obstacle
    );


    let obstaclePosition = -70;


    const obstacleMovement =
        setInterval(function () {

            if (!gameRunning) {

                clearInterval(
                    obstacleMovement
                );

                obstacle.remove();

                return;
            }


            obstaclePosition +=
                gameSpeed;


            obstacle.style.top =
                obstaclePosition + "px";


            /* Collision */

            const playerRect =
                player.getBoundingClientRect();

            const obstacleRect =
                obstacle.getBoundingClientRect();


            const sameLane =
                Number(obstacle.dataset.lane)
                === playerLane;


            if (
                sameLane &&
                obstaclePosition > 180 &&
                obstaclePosition < 430
            ) {

                const collision =
                    playerRect.left <
                        obstacleRect.right &&
                    playerRect.right >
                        obstacleRect.left &&
                    playerRect.top <
                        obstacleRect.bottom &&
                    playerRect.bottom >
                        obstacleRect.top;


                if (
                    collision &&
                    !isJumping
                ) {

                    clearInterval(
                        obstacleMovement
                    );

                    obstacle.remove();

                    endGame();

                    return;
                }
            }


            /* Remove obstacle */

            if (
                obstaclePosition > 700
            ) {

                clearInterval(
                    obstacleMovement
                );

                obstacle.remove();

                score += 10;

                updateDisplays();
            }

        }, 20);
}


/* =========================
   CREATE COIN
========================= */

function createCoin() {

    if (!gameRunning) return;

    const coin =
        document.createElement("div");

    coin.className =
        "coin";

    coin.textContent =
        "🪙";


    const lane =
        Math.floor(Math.random() * 3);


    coin.dataset.lane =
        lane;


    coin.style.left =
        getLanePosition(lane) + "px";


    coin.style.transform =
        "translateX(-50%)";


    coin.style.top =
        "-50px";


    coinContainer.appendChild(
        coin
    );


    let coinPosition = -50;


    const coinMovement =
        setInterval(function () {

            if (!gameRunning) {

                clearInterval(
                    coinMovement
                );

                coin.remove();

                return;
            }


            coinPosition +=
                gameSpeed;


            coin.style.top =
                coinPosition + "px";


            const playerRect =
                player.getBoundingClientRect();

            const coinRect =
                coin.getBoundingClientRect();


            const sameLane =
                Number(coin.dataset.lane)
                === playerLane;


            if (
                sameLane &&
                playerRect.left <
                    coinRect.right &&
                playerRect.right >
                    coinRect.left &&
                playerRect.top <
                    coinRect.bottom &&
                playerRect.bottom >
                    coinRect.top
            ) {

                coins++;

                score += 25;

                updateDisplays();

                clearInterval(
                    coinMovement
                );

                coin.remove();

                return;
            }


            if (
                coinPosition > 700
            ) {

                clearInterval(
                    coinMovement
                );

                coin.remove();
            }

        }, 20);
}


/* =========================
   UPDATE GAME
========================= */

function updateGame() {

    if (!gameRunning) return;

    score++;

    updateDisplays();
}


/* =========================
   UPDATE DISPLAY
========================= */

function updateDisplays() {

    scoreDisplay.textContent =
        score;

    coinsDisplay.textContent =
        coins;

    distanceDisplay.textContent =
        distance + "m";
}


/* =========================
   START GAME
========================= */

function startGame() {

    score = 0;

    coins = 0;

    distance = 0;

    gameSpeed = 3;

    playerLane = 1;

    isJumping = false;


    obstacleContainer.innerHTML =
        "";

    coinContainer.innerHTML =
        "";


    gameRunning = true;


    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    updatePlayerPosition();

    updateDisplays();


    /* Score */

    gameLoop =
        setInterval(
            updateGame,
            1000
        );


    /* Distance */

    distanceTimer =
        setInterval(function () {

            if (!gameRunning) return;

            distance++;


            if (
                distance % 100 === 0
            ) {

                gameSpeed += 0.4;
            }


            updateDisplays();

        }, 1000);


    /* Obstacles */

    obstacleTimer =
        setInterval(function () {

            createObstacle();

        }, 1100);


    /* Coins */

    coinTimer =
        setInterval(function () {

            createCoin();

        }, 1500);
}


/* =========================
   END GAME
========================= */

function endGame() {

    gameRunning = false;


    clearInterval(gameLoop);

    clearInterval(distanceTimer);

    clearInterval(obstacleTimer);

    clearInterval(coinTimer);


    finalScore.textContent =
        score;

    finalCoins.textContent =
        coins;

    finalDistance.textContent =
        distance + "m";


    if (score > bestScore) {

        bestScore = score;


        localStorage.setItem(
            "naijaBestScore",
            bestScore
        );
    }


    bestScoreText.textContent =
        "🏆 Best Score: " +
        bestScore;


    gameScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.remove(
        "hidden"
    );
}


/* =========================
   HOME
========================= */

function goHome() {

    gameRunning = false;


    clearInterval(gameLoop);

    clearInterval(distanceTimer);

    clearInterval(obstacleTimer);

    clearInterval(coinTimer);


    obstacleContainer.innerHTML =
        "";

    coinContainer.innerHTML =
        "";


    gameOverScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.add(
        "hidden"
    );

    startScreen.classList.remove(
        "hidden"
    );
}


/* =========================
   BUTTONS
========================= */

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);

homeButton.addEventListener(
    "click",
    goHome
);

leftButton.addEventListener(
    "click",
    moveLeft
);

rightButton.addEventListener(
    "click",
    moveRight
);

jumpButton.addEventListener(
    "click",
    jump
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "ArrowLeft"
        ) {
            moveLeft();
        }


        if (
            event.key === "ArrowRight"
        ) {
            moveRight();
        }


        if (
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            event.preventDefault();

            jump();
        }

    }
);


/* =========================
   INITIAL SETUP
========================= */

updatePlayerPosition();

bestScoreText.textContent =
    "🏆 Best Score: " +
    bestScore;
