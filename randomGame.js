let canvas, ctx, w, h;
let press;
let i = 0;
let animation;

function init() {

	
	canvas = document.querySelector("#canvas");
	
	w= canvas.width;
	h = canvas.height;
	
	ctx = canvas.getContext('2d');
	
	canvas.onfocus;
	
	addEventListener('keydown', keyDown);
	window.onkeyup = function (evt) {
		press = 70;
	}
	mainLoop();
}

let player = {
	x: 340,
	y: 280,
	width: 60,
	height: 20,
	speedX: 7,
	color: 'red',
	miniWidth: 60,
	miniHeight: 5
}

let ball = {
	x: 30 + (Math.random() * 720),
	y: 30,
	radius: 20,
	speedX: 2,
	speedY: 2,
	color: 'green'
}

function mainLoop() {
	ctx.clearRect(0, 0, w, h);
	
	animation = requestAnimationFrame(mainLoop);
	
	console.log(ball.speedY);
	createPlayer(player);
	
	createBall(ball);
	moveBall(ball);
	
	movePlayer(player);
}

function createPlayer(p) {
	ctx.save();
	
	ctx.translate(p.x, p.y);
	
	ctx.fillStyle = p.color;
	ctx.fillRect(0, 0, p.width, p.height);
	
	ctx.fillStyle = 'blue';
	ctx.fillRect(5, 0, 12.5, 20);
	ctx.fillRect(42.5, 0, 12.5, 20);
	
	ctx.restore();
}

function keyDown(evt) {
	press = evt.keyCode;

}

function movePlayer(p) {
	if(press == 39) {
		p.x += p.speedX;
	}
	if(press == 37) {
		p.x += -p.speedX;
	}
	if(press == 13) {
		restart();
	}
	
	testPlayerWallCollision(player);
}


function testPlayerWallCollision(p) {
	if(p.x + p.width > w) {
		press = 33;
		p.x = w - p.width;
	}
	if(p.x < 0) {
		press = 33;
		p.x = 0;
	}
}

function createBall(b) {
	ctx.save();
	
	ctx.translate(b.x, b.y);
	
	ctx.fillStyle = b.color;
	ctx.beginPath();
	ctx.arc(0, 0, b.radius, 0, 2*Math.PI)
	ctx.fill();
	
	ctx.restore();
}

function moveBall(b) {
	b.x += b.speedX;
	b.y += b.speedY;
	
	testBallPlayerCollision(ball);
	testBallWallCollision(ball);
}

function testBallWallCollision(b) {
	if(b.x + b.radius > w) {
		b.speedX = -b.speedX;
		b.x = w - b.radius;
	}
	if(b.x - b.radius < 0) {
		b.speedX = -b.speedX;
		b.x = b.radius;
	}
	if(b.y + b.radius > h) {

		if(localStorage.highScore == undefined) {
			localStorage.highScore = i;
		}
		
		else if(i > localStorage.highScore) {
			localStorage.highScore = i;
		}
		
		ctx.save();
		ctx.font = "50px Arial";
		ctx.fillText("GAME OVER", w/3, h/3);
		ctx.font = "20px Arial";
		ctx.fillText("Number of Hits: " + i, w/3, h/3 + 70);
		ctx.fillText("High Score: " + localStorage.highScore, w/3, h/3 + 100);
		ctx.restore();
	}
	if(b.y - b.radius < 0) {
		b.speedY = -b.speedY;
		b.y = b.radius;
	}
	if(testBallPlayerCollision(ball)) {
		b.speedY = -b.speedY * 1.1;
		b.speedX = b.speedX * 1.1;
		b.y = h - (b.radius + player.height + .001);
		if(player.speedX < 15) {
			player.speedX = player.speedX * 1.1;
			console.log(player.speedX);
		}
		i++;
	}
}

function testBallPlayerCollision(b) {
	let stat = false;
	if(overlap(player.x, player.y, player.miniWidth, player.miniHeight, b.x, b.y, b.radius)) {
		stat = true;
	}
	//console.log(stat);
	return stat;
}

function overlap(x0, y0, w0, h0, cx, cy, r) {
   let testX=cx;
   let testY=cy;
   if (testX < x0) testX=x0;
   if (testX > (x0+w0)) testX=(x0+w0);
   if (testY < y0) testY=y0;
   if (testY > (y0+h0)) testY=(y0+h0);
   return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
}
		
