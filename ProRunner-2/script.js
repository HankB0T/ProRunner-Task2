var myGamePiece;
var myObstacles = [];
var newScore;
var highScore;
var count = 0;

window.onkeydown = function(event){
    if(event.keyCode === 32) {
        event.preventDefault();
        document.querySelector('button').click();
    }
}

function startGame() {
    myGameRoof = new component(1000, 100, "black", 0, 0);
    myGameFloor = new component(1000, 100, "black", 0, 400);
    myGamePiece = new component(75, 75, "blue", 10, 325);
    newScore = new component("30px", "Consolas", "white", 750, 25, "text");
    highScore = new component("30px", "Consolas", "white", 750, 75, "text");
    myGameArea.start();
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[5]);
        this.frameNo = 0;
        updateGameArea();
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
        this.type = type;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.gravity = 0;
        this.gravitySpeed = 0;

        this.update = function () {
            ctx = myGameArea.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        this.newPos = function () {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.wall();
        }

        this.wall = function () {
            let rocktop = 100;
            let rockbottom = myGameArea.canvas.height - 175;
            if (this.y < rocktop) {
                this.y = rocktop;
                this.gravitySpeed = 0;
            }
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = 0;
            }
        }

        this.crashWith = function (otherobj) {
            let myleft = this.x;
            let myright = this.x + (this.width);
            let mytop = this.y;
            let mybottom = this.y + (this.height);
            let otherleft = otherobj.x;
            let otherright = otherobj.x + (otherobj.width);
            let othertop = otherobj.y;
            let otherbottom = otherobj.y + (otherobj.height);
            let crash = true;
            if ((mybottom < othertop) || (mytop > otherbottom || (myright < otherleft) || (myleft > otherright))) {
                crash = false;
            }
            return crash;
        }
    }

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
        document.querySelector(".message1").textContent = "YOU LOSE!";
        count = 1;
        localStorage.setItem("counter", count);
        return;
      } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myGameRoof.update();
    myGameFloor.update();
    if (myGameArea.frameNo == 1 || everyinterval(600)) {
        let x = myGameArea.canvas.width;
        let y = myGameArea.canvas.height;
        let minWidth = 75;
        let maxWidth = 225;
        let width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        let q = Math.floor(Math.random()*2);
        if (q===0) myObstacles.push(new component(width, 100, "grey", x, 0));
        else myObstacles.push(new component(width, 100, "grey", x, y - 100));
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myGamePiece.newPos();
    myGamePiece.update();

    let score = Math.floor(myGameArea.frameNo/10);
    newScore.text="SCORE: " + score;

    if (localStorage.getItem("counter") == 1) {
        if (score <= localStorage.getItem("highscore")) {
            highScore.text="HIGHSCORE: " + localStorage.getItem("highscore");
        }
        else {
            localStorage.setItem("highscore", score);
            highScore.text="HIGHSCORE: " + localStorage.getItem("highscore"); 
        }
    }

    else if (count == 0) {
        localStorage.setItem("highscore", score);
        highScore.text="HIGHSCORE: " + localStorage.getItem("highscore");
    }

    newScore.update();
    highScore.update();
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 1);}
    if (myGamePiece.gravity === 1) myGamePiece.gravity = -1;
    else if (n===0) myGamePiece.gravity = 1;
}



    