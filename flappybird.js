//Board
let board;
let boardheight = 640;
let boardwidth = 360;
let context;

//Bird
let birdheight = 24;
let birdwidth = 34;
let birdx = boardwidth / 8;
let birdy = boardheight / 2;
let birdImg;

let bird = {
    x: birdx,
    y: birdy,
    width: birdwidth,
    height: birdheight,
};

//pipe

let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4

let gameOver = false;
let score = 0;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    //    context.fillStyle = 'green';
    //    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //     //draw bird img

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, birdwidth, birdheight)
    }
    topPipeImg = new Image();
    topPipeImg.src = "./topPipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottomPipe.png";

    setTimeout(() => {
        requestAnimationFrame(update);
        setInterval(placePipes, 1500);
        document.addEventListener("keydown", moveBird)
    }, 3000);

}

//update
function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }
    //pipe
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipe
    while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "25px Monaco";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillStyle="#55bae49e"
        context.fillRect(0,0,boardwidth,boardheight)

        context.fillStyle="black"
        context.fillText("GAME OVER",boardwidth/3 , boardheight/2)
        context.fillText("Score :- "+score, boardwidth/2.8 , boardheight/1.85)
    }

}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeheight / 4 - Math.random() * (pipeheight / 2);
    let openingSpace = boardheight / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipewidth,
        height: pipeheight,
        passed: false

    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeheight + openingSpace,
        width: pipewidth,
        height: pipeheight,
        passed: false
    }
    pipeArray.push(bottomPipe);

}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == 'keyX') {
        velocityY = -6;
        //reset game 
        if (gameOver) {
            bird.y = birdy;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }

}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

}



