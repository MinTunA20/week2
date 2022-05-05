// Events Listeners
window.addEventListener("load", Init);

// Sprites
let ground = null;
let pipe = null;
let bird = null;

// Sounds
let sfx_wing = null;
let sfx_point = null;
let sfx_hit = null;
let sfx_die = null;
let sfx_swooshing = null;

// size mặc định
let W = 400;
let H = 600;

// lets
let status = 0; // 0 = Start Screen / 1 = Gaming / 2 = Game Over
let score = 0;
let groundStep = 0;
let scroolingSpeed = 3;
let lockScroll = false;
let lockJump = false;
let lockBird = true;

// biến điểm
let newBest = false;
let bestScore = 0;

// Bird
let xPos = 10; // giá trị không đổi
let yPos = 250;
let yGravity = 0;
let yGravityIncreaser = 2;
let yJumpGravity = -17;
let yMaxGravity = 20;
let birdDrawScale = 6; // size/scale
let hitTheGround = false;

function Pipe() {
    this.X = 0;
    this.H = 10;
    this.Marker = false;
}

let Pipes = [];
let nPipes = 3;
let PipesDistanceX = 150; // khoảng cách X
let PipesDistanceY = 130;
let PipeScale = 2;

// cho phép PipeSpeed = 2; // Tốc độ đường ống cần bằng với tốc độ cuộn

function InitPipes() {
    let xCounter = W;
    for (let i = 0; i < nPipes; i++) {
        let sPipe = new Pipe();
        sPipe.X = xCounter;
        sPipe.H = Math.floor((Math.random() * (H - (ground.height + PipesDistanceY + 50))) + 50);
        sPipe.Marker = false;
        xCounter += PipesDistanceX + (pipe.width / PipeScale);
        Pipes.push(sPipe);
    }
}

function Init() {
    // Get the canvas element
    let canvas = document.getElementById("CTX");

    // Set the canvas size
    canvas.setAttribute("width", W);
    canvas.setAttribute("height", H);

    // Get canvas context
    let ctx = canvas.getContext("2d");

    // Load các file phương tiện
    ground = new Image();
    ground.src = "ground.png";
    pipe = new Image();
    pipe.src = "pipe.png";
    bird = new Image();
    bird.src = "bird.png";

    sfx_wing = new Audio("sfx_wing.ogg");
    sfx_point = new Audio("sfx_point.ogg");
    sfx_hit = new Audio("sfx_hit.ogg");
    sfx_die = new Audio("sfx_die.ogg");
    sfx_swooshing = new Audio("sfx_swooshing.ogg");

    // Khởi tạo ống

    // Key events
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 32) // Space Button
        {
            if (!lockJump) {
                yGravity = yJumpGravity;
            }
            if (status == 0) // Start Room
            {
                startGame();
            }
            if (status == 2) // Game Over State
            {
                if (sfx_swooshing != null) {
                    sfx_swooshing.play();
                }
                //
                reset();
            }
            if (sfx_wing != null && status == 1) {
                sfx_wing.pause();
                sfx_wing.currentTime = 0;
                //
                sfx_wing.play();
            }
        }
    }, false);

    // tạo vòng lặp. 30 ms interval
    let interval = window.setInterval(function () {
        GUpdate(ctx, canvas);
    }, 30);

}

// di chuyển xuống
function doGroundStep() {
    if (ground != null) {
        groundStep += scroolingSpeed;
        if (groundStep >= ground.width) {
            groundStep = 0;
        }
    }
}

function updateGravity() {
    yGravity += yGravityIncreaser;
    if (yGravity > yMaxGravity) {
        yGravity = yMaxGravity;
    }
}

function updateBirdPosition() {
    yPos += yGravity;
    if (yPos < 0) {
        yPos = 0;
    }
    if (yPos > (H - ground.height) - (bird.height / birdDrawScale)) {
        yPos = (H - ground.height) - (bird.height / birdDrawScale);

        // Another Colision Case
        gameOver();

        if (!hitTheGround) {
            sfx_die.play();
            hitTheGround = true;
        }
    }
}

// vị trí ống ở tọa độ X
function getFarestPipeX() {
    let farestX = 0;
    for (let i in Pipes) {
        if (Pipes[i].X > farestX) {
            farestX = Pipes[i].X;
        }
    }
    //
    return farestX;
}

function updatePipesPosition() {
    for (let i in Pipes) {
        Pipes[i].X -= scroolingSpeed;
        if (Pipes[i].X + (pipe.width / PipeScale) < 0) {
            Pipes[i].X = getFarestPipeX() + (pipe.width / PipeScale) + PipesDistanceX; // Vị trí ống xa nhất
            Pipes[i].H = Math.floor((Math.random() * (H - (ground.height + PipesDistanceY + 50))) + 50); // Lấy độ cao mới của ống
            Pipes[i].Marker = false;
        }
    }
}

function getGravityPercentValue() {
    let yMax = yMaxGravity + (yJumpGravity * (-1));
    let yGravityTmp = yGravity + (yJumpGravity * (-1));
    //
    return (yGravityTmp * 100) / yMax;
}

// Khoảng cách giữa 2 điểm
function Magnitude(p1, p2) {
    return Math.sqrt(Math.pow(p2.X - p1.X, 2) + Math.pow(p2.Y - p1.Y, 2));
}


function testCollision() {
    // For the bird will be used the circle a collider
    // Chim có thể quay khi bay lên, rơi xuống
    let birdCircle = {
        X: xPos + ((bird.width / birdDrawScale) / 2),
        Y: yPos + ((bird.height / birdDrawScale) / 2),
        R: (bird.height / birdDrawScale) / 2
    };

    for (let i in Pipes) {
        let cPipe = Pipes[i];
        //
        // cPipe.X, -(pipe.height / PipeScale) + cPipe.H
        let rectPipeUp = {
            X: cPipe.X,
            Y: -(pipe.height / PipeScale) + cPipe.H,
            W: (pipe.width / PipeScale),
            H: (pipe.height / PipeScale)
        };
        // cPipe.X, cPipe.H + PipesDistanceY
        let rectPipeDown = {
            X: cPipe.X,
            Y: cPipe.H + PipesDistanceY,
            W: (pipe.width / PipeScale),
            H: (pipe.height / PipeScale)
        };

        // Test each rectangle
        let resRectPipeUp = CircleRectangleCollision(birdCircle, rectPipeUp);
        let resRectPipeDown = CircleRectangleCollision(birdCircle, rectPipeDown);

        if (resRectPipeUp || resRectPipeDown) {
            gameOver();
        }
    }


}

function updateScore() {
    let xBirdCenter = xPos + ((bird.width / birdDrawScale) / 2);
    for (let p in Pipes) {
        let cPipe = Pipes[p];
        if (cPipe.X < xBirdCenter) {
            if (cPipe.Marker == false) {
                Pipes[p].Marker = true;
                score++;
                // Play the sfx
                if (sfx_point != null) {
                    sfx_point.play();
                }
            }
        }
    }

}

function GUpdate(ctx, canvas) {
    // Clear the screen
    ctx.fillStyle = "rgb(100, 149, 237)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateGravity();
    updateBirdPosition();
    if (!lockScroll) {
        doGroundStep();
        updatePipesPosition();
    }
    testCollision();
    updateScore();

    if (lockBird) {
        yGravity = 0;
        yPos = 250;
    }

    // Draw the Pipes
    for (let i in Pipes) {
        let cPipe = Pipes[i];

        // New pipe size
        let nW = pipe.width / PipeScale;
        let nH = pipe.height / PipeScale;

        // Mỗi đối tượng đường ống đại diện cho hai đường ống '-'
        // Cái đầu tiên cần được xoay
        ctx.save();
        ctx.translate(cPipe.X, -(pipe.height / PipeScale) + cPipe.H);
        let translW = nW / 2;
        let translH = nH / 2;
        ctx.translate(translW, translH);
        ctx.rotate(180 * Math.PI / 180);
        ctx.drawImage(pipe, -translW, -translH, nW, nH);

        ctx.restore();

        // đổi hướng ống 2
        ctx.drawImage(pipe, cPipe.X, cPipe.H + PipesDistanceY, nW, nH);
    }

    // Draw the bird
    if (bird != null) {
        // Get a new image size based on a new scale
        let nW = bird.width / birdDrawScale;
        let nH = bird.height / birdDrawScale;

        // Save current context
        ctx.save();

        // chim đổi hướng khi lên - xuống
        let rotationDegree = ((getGravityPercentValue() * 160) / 100) - 70;
        let traslW = (bird.width / birdDrawScale) / 2;
        let tranlH = (bird.height / birdDrawScale) / 2;
        ctx.translate(xPos, yPos);
        ctx.translate(traslW, tranlH);
        ctx.rotate(rotationDegree * Math.PI / 180);

        // Draw Image
        ctx.drawImage(bird, -traslW, -tranlH, nW, nH);

        // restore context
        ctx.restore();
    }

    // Vẽ lòng đất
    // The ground is drawn upon the pipe
    if (ground != null) {
        for (let i = groundStep * (-1); i < W + groundStep; i += ground.width) {
            ctx.drawImage(ground, i, H - ground.height);
        }
    }

    if (status == 0) {
        ctx.font = "bold 32px Corbel";
        ctx.fillStyle = "Green";
        ctx.fillText("Press Jump to Start!", 60, 200);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "Black";
        ctx.strokeText("Press Jump to Start!", 60, 200);
    }
    if (status == 1) {
        // Show Score
        ctx.font = "bold 32px Corbel";
        ctx.fillStyle = "Green";
        let txtMetrics = ctx.measureText(score);

        ctx.fillText(score, (W / 2) - (txtMetrics.width / 2), 50);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "Black";
        ctx.strokeText(score, (W / 2) - (txtMetrics.width / 2), 50);

    }
    if (status == 2) {
        // Game Over Status
        // Rectangle
        ctx.rect(50, 150, W - 100, 200);
        ctx.fillStyle = "Yellow";
        ctx.fill();
        ctx.strokeStyle = "Black";
        ctx.stroke();

        // Game Over Message
        ctx.font = "bold 32px Corbel";
        ctx.fillStyle = "Black";
        ctx.fillText("Game Over!", 120, 190);

        // Score
        ctx.font = "24px Corbel";
        ctx.fillStyle = "Black";
        ctx.fillText("Score: " + score, 70, 230);

        // Best Score
        ctx.font = "24px Corbel";
        ctx.fillStyle = "Black";
        ctx.fillText("Best Score: " + bestScore, 70, 260);

        // New Best Score
        if (newBest) {
            // Best Score
            ctx.font = "bold 24px Corbel";
            ctx.fillStyle = "Black";
            ctx.fillText("New Best Score! ", 70, 290);
        }

        // Press Jump Msg
        ctx.font = "24px Corbel";
        ctx.fillStyle = "Black";
        ctx.fillText("Press Jump to Restart", 95, 330);
    }
}

function applySettings() {
    PipesDistanceY = parseInt(document.getElementById("distY").value);
    PipesDistanceX = parseInt(document.getElementById("distX").value);
    yJumpGravity = -parseInt(document.getElementById("jumpForce").value);
    yGravityIncreaser = parseInt(document.getElementById("gravity").value);
}

