let myGamePiece;
let myObstacles = [];
let myPower = [];
let newScore;
let score;
let highScore;
let cycle = 0;
let count = 0;
let tick = 0;
let token = 0;
let timer = 0;
let myleft, myright, mytop, mybottom;

function tickID() {
    if (cycle == 0) {
    tick = 0;
    }
    else if (cycle == 1) {
    tick+=1;
    }
}

setInterval(tickID, 4);

window.onkeydown = function(event) {
    if(event.keyCode === 32) {
        event.preventDefault();
        document.querySelector('button').click();
    }
}

function startGame() {
    myGameRoof = new component(1000, 100, "black", 0, 0);
    myGameFloor = new component(1000, 100,"black", 0, 400);
    myGamePiece = new component(35, 75, "blue", 45, 325, "tri");
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
            } 

            else if (this.type == "tri") {
                if (myGamePiece.gravity == 1) {
                ctx.beginPath();
                ctx.moveTo(60, 325);
                ctx.fillStyle = color;
                ctx.lineTo(10, 400); //left line
                ctx.lineTo(80, 400); //right line
                ctx.fill();
                }
                else if (myGamePiece.gravity == -1) {
                ctx.beginPath();
                ctx.moveTo(60, 175);
                ctx.fillStyle = color;
                ctx.lineTo(10, 100); //left line
                ctx.lineTo(80, 100); //right line
                ctx.fill(); 
                }
            }

            else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }

        }

        this.newPos = function () {
            this.gravitySpeed += this.gravity;
            this.x += 0;
            this.y += this.gravitySpeed;
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
            let myleft = this.x - (this.width);
            let myright = this.x + (this.width);
            let mytop = this.y;
            let mybottom = this.y + (this.height);
            let otherleft = otherobj.x;
            let otherright = otherobj.x + (otherobj.width);
            let othertop = otherobj.y;
            let otherbottom = otherobj.y + (otherobj.height);
            let crash = true;
            if (token == 0) {
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {crash = false;}
            }
            else {crash = false;}
            return crash;
        }

        this.touchWith = function (otherobj) {
            
            myleft = this.x - (this.width);
            myright = this.x + (this.width);
            mytop = this.y;
            mybottom = this.y + (this.height);

            let otherleft = otherobj.x;
            let otherright = otherobj.x + (otherobj.width);
            let othertop = otherobj.y;
            let otherbottom = otherobj.y + (otherobj.height);
            let touch = false;
            if (((mybottom >= otherbottom) && (mytop <= othertop) && (myright == otherleft)) || (mybottom >= otherbottom) && (mytop <= othertop) && (myleft == otherright)) {
                token = 1;
                touch = true;
            }
            return touch;
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

    for (i = 0; i < myPower.length; i += 1) {
        if (myGamePiece.touchWith(myPower[i])) {
            setTimeout(function time() {
                token = 0;
                document.querySelector(".message1").textContent = "";
            }, 10*1000);
        document.querySelector(".message1").textContent = "INVINCIBLE FOR 10 SECS!";
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;
    myGameRoof.update();
    myGameFloor.update();
    if (myGameArea.frameNo == 1 || everyinterval(900)) {
        let x = myGameArea.canvas.width;
        let y = myGameArea.canvas.height;
        let minWidth = 75;
        let maxWidth = 225;
        let width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        let p = Math.floor(Math.random()*2);
        let q1 = Math.floor(Math.random()*4);
        let q2 = Math.floor(Math.random()*2);

        if (p===0) myObstacles.push(new component(width, 100, "grey", x, 0)); //top void
        else myObstacles.push(new component(width, 100, "grey", x, y - 100)); //bottom void

        if (q1===0) {
        if (q2===0) {myPower.push(new component(25, 25, "yellow", x + 350 + width, 125));} //Power top
        else {myPower.push(new component(25, 25, "yellow", x + 350 + width, 350));} //Power bottom
        }
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    for (i = 0; i < myPower.length; i += 1) {
        myPower[i].x += -1;
        myPower[i].update();
    }

    myGamePiece.newPos();
    myGamePiece.update();

    score = Math.floor(tick/10);
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

function speed() {
    if (score >= 0) {
    myGameArea.interval = setInterval(updateGameArea, 10);
    }
}

setInterval(speed, 10000);

function accelerate(n) {
    cycle = 1;

    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 10);}
    
    if (myGamePiece.gravity === 1) myGamePiece.gravity = -1;
    else if (n===0) myGamePiece.gravity = 1;
}
