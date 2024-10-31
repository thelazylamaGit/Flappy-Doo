let canvas;
let canvasContext;
let ballX = 50;
let speedX = 5;
let speedY = 5;
let ballY = 50;

let player1Score = 0;
let player2Score = 0;

let paddle1Y = 250;
let paddle2Y = 250;
let PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 3;
let AISpeed = 8;
let AIFocus = 5;
let roboFight = false;
let randomOffset = Math.random();

let winScreen = false;

function calcMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop - PADDLE_HEIGHT/2;
    return{
        x:mouseX,
        y:mouseY
    };
}
function resize_canvas(){
    let canvas = document.getElementById("gameCanvas");
    if (canvas.width < window.innerWidth || canvas.width > window.innerWidth)
    {
        canvas.width  = window.innerWidth - 20;
    }

    if (canvas.height < window.innerHeight || canvas.height > window.innerHeight)
    {
        canvas.height = window.innerHeight - 20;
    }
}
window.onresize = function(){
    resize_canvas();
    if(canvas.width > 1800){
        speedX = 10;
        speedY = 10;
        PADDLE_HEIGHT = 150;
        AISpeed = 20;

    }
};
window.onload = function() { 
    resize_canvas();
	canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
   // drawRect(0,0,canvas.width,canvas.height, 'black');    
    let fps = 60;
    setInterval(function(){
        move();
        draw();
    }, 1000/fps);

window.addEventListener('keydown', function(evt){
    if(evt.keyCode == 32){
        roboFight = !roboFight;
    }
    if(roboFight){
        AISpeed = 15;
    }
    else{
        AISpeed = 8
    }
})

    canvas.addEventListener('mousemove', function(evt){
        if(!roboFight){
            let mousePos = calcMousePos(evt);
            paddle1Y = mousePos.y;
        }
    })
}

function AI(){
    let paddle2YCentre = paddle2Y + (PADDLE_HEIGHT/2 * randomOffset);
    if(paddle2YCentre < ballY - AIFocus){
        paddle2Y += AISpeed;
    } 
    else if(paddle2YCentre > ballY + AIFocus){
        paddle2Y -= AISpeed;
    }                                              
}
function playerAI(){
    let paddle1YCentre = paddle1Y + (PADDLE_HEIGHT/2 * randomOffset);
    if(paddle1YCentre < ballY - AIFocus){
        paddle1Y += AISpeed;
    } 
    else if(paddle1YCentre > ballY + AIFocus){
        paddle1Y -= AISpeed;
    }    
}

function move(){
    if(winScreen){
        return;
    } 
    AI()
    if(roboFight){
        playerAI(); 
    }
    ballX += speedX;
    ballY += speedY;
    if(ballX > canvas.width){
        //speedX = -speedX;
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            speedX = -speedX;    
            randomOffset = Math.random();     
            
            let deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2)
            speedY = deltaY * 0.3;
        }
        else{
            player1Score++;
            ballReset();
        }
    }
    else if(ballX < 0){
        //speedX = -speedX;
        if(ballY > paddle1Y && ballY < paddle1Y +PADDLE_HEIGHT){
            speedX = -speedX; 
            randomOffset = Math.random();     

            let deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2)
            speedY = deltaY * 0.3;
        }
        else{
            player2Score++;
            ballReset();
        }
    }
    else if(ballY > canvas.height){
        speedY = -speedY;
    }
    else if(ballY < 0){
        speedY = -speedY;
    }
}

function drawNet(){
    for(let i = 0; i < canvas.height; i += 40){
        drawRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

//draws shapes and colours
function draw(){
    canvasContext.font = '30px Comic Sans MS'
    //draws background
    drawRect(0,0,canvas.width,canvas.height, 'black');    
    if(winScreen){
        canvasContext.fillStyle = 'white';
        if(player1Score >= WINNING_SCORE){
        canvasContext.fillText('Left Player Won!' , canvas.width/2 - canvasContext.measureText('Left Player Won!').width/2, canvas.height / 2 - 50);    
        }
        else if(player2Score >= WINNING_SCORE){
            canvasContext.fillText('Right Player Won!' , canvas.width/2 - canvasContext.measureText('Right Player Won!').width/2, canvas.height / 2 - 50);
        }
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Click to continue', canvas.width/2 - canvasContext.measureText('click to continue').width/2, canvas.height/2 + 100);
        canvas.addEventListener('click', (e) => {
            player1Score = 0;
            player2Score = 0;
            winScreen = false;
        })
        return;
    }
    drawNet();
    //draws paddle1
    drawRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
    //draws paddle2
    drawRect(canvas.width - PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
    //draws ball
    drawCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, canvas.width/2 - 100, 100);
    canvasContext.fillText(player2Score, canvas.width/2 + 100, 100);
}

function drawRect(leftX,topY, width, height, colour){
    canvasContext.fillStyle = colour;
    canvasContext.fillRect(leftX,topY,width, height);
}

function drawCircle(x, y, radius, colour){
    canvasContext.fillStyle = colour;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI*2, true)
    canvasContext.fill();
}

function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        winScreen = true;
    }
        ballX = canvas.width/2;
        ballY = canvas.height/2;
        speedX = -speedX;
}