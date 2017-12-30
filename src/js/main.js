import * as cfg from './config.js';

const scoreDur       = 30,
	scoreOpacityIncr = 0.02,
	scoreScaleIncr   = 0.05,
	// quick refs
	abs = Math.abs,
	doc = window.document,
	// DOM
	$gameboard  = doc.querySelector('.gameboard'),
	$ball         = doc.getElementById('ball'),
	$ballLines    = $ball.querySelector('.ball__lines'),
	$score        = doc.getElementById('score'),
	$rankingitems = [].slice.apply(doc.querySelectorAll('.ranking__list li'));
	
// variables
let ball = {
		rotation: 0,
		momentum: false,
		freeFall: false
	},
	ballSpeed = {
		x: 0,
		y: 0
	},
	gameboard    = {},
	kickCount    = 0,
	showScore    = false,
	scoreTimer   = 0,
	scoreOpacity = 0,
	scoreScale   = 0,
	ranking      = [],
	startTime;
	
function init() {
	ball.y      = parseInt($ball.style.top, 10);
	ball.x      = parseInt($ball.style.left, 10);
	ball.width  = $ball.clientWidth;
	ball.height = $ball.clientHeight;
	$ball.addEventListener('mouseover', ballHit);
	
	gameboard.top    = $gameboard.clientTop;
	gameboard.left   = $gameboard.clientLeft;
	gameboard.width  = $gameboard.clientWidth;
	gameboard.height = $gameboard.clientHeight;
	gameboard.bottom = gameboard.top + gameboard.height;
	gameboard.right  = gameboard.left + gameboard.width;
	doc.getElementById('clearRanking').addEventListener('click', clearRanking);
	
	startTime = window.performance.now();
	frame();
}

function ballHit(e) {
	ballSpeed.y = -cfg.hitPower;
	ballSpeed.x = (ball.x + (ball.width >> 1) - e.clientX) * cfg.hitHorizMult;
	ball.momentum = true;
	ball.freeFall = true;
	addKickCount();
}

function frame(currentTime) {
	window.requestAnimationFrame(frame);
	// calc elapsed time since last loop
	let elapsed = currentTime - startTime;
	// if enough time has elapsed, draw the next frame
	if (elapsed > cfg.fpsInterval) {
		// Get ready for next frame by setting startTime=currentTime, but...
		// Also, adjust for cfg.fpsInterval not being multiple of 16.67
		startTime = currentTime - (elapsed % cfg.fpsInterval);
	
		if (ball.momentum) {
			ballPhysics();
			renderBall();
		}
		if (showScore) {
			renderScore();
		}
	}
}

function ballPhysics() {
	ball.y += ballSpeed.y;
	if (ball.y + ball.height <= gameboard.bottom) {
		ballSpeed.y += cfg.gravity;
	} else {
		ball.y -= ball.y + ball.height - gameboard.bottom;
		ballSpeed.y *= -cfg.groundFriction;
		if (ballSpeed.y > -cfg.vSpeedThreshold) {
			ball.y = gameboard.bottom - ball.height;
			ball.freeFall = false;
			ballSpeed.y = 0;
		}
		updateRanking(kickCount);
		kickCount = 0;
	}

	ball.x += ballSpeed.x;
	ballSpeed.x *= cfg.drag;
	if (ball.x < gameboard.left) {
		ball.x += gameboard.left - ball.x;
		ballSpeed.x *= -cfg.wallFriction;
	} else if (ball.x + ball.width > gameboard.right) {
		ball.x -= ball.x + ball.width - gameboard.right;
		ballSpeed.x *= -cfg.wallFriction;
	}
	if (abs(ballSpeed.x) < cfg.hSpeedThreshold) {
		ballSpeed.x = 0;
	}
	
	ball.rotation += ballSpeed.x * 2;
	
	if (ballSpeed.y === 0 && ballSpeed.x === 0 && !ball.freeFall) {
		ball.momentum = false;
	}
}

function renderBall() {
	$ball.style.cssText = `
		top: ${ball.y}px; 
		left: ${ball.x}px;
	`;
	$ballLines.style.cssText = `transform: rotate(${ball.rotation}deg);`;
}

function renderScore() {
	if (scoreTimer++ < scoreDur) {
		if (scoreOpacity < 1) scoreOpacity += scoreOpacityIncr;
		if (scoreScale   < 1) scoreScale += scoreScaleIncr;
		$score.style.cssText = `
			display: block;
			opacity: ${scoreOpacity};
			transform: translateZ(0) scale(${scoreScale});`;
	} else {
		$score.style.display = 'none';
		showScore = false;
	}
}

function addKickCount() {
	kickCount++;
	$score.textContent = kickCount;
	showScore          = true;
	scoreTimer         = 0;
	scoreOpacity       = 0;
	scoreScale         = 0.25;
	renderScore();
}

function updateRanking(count) {
	if ((count && !ranking[0]) || count > ranking[0]) {
		ranking.unshift(count);
		for (let i = 0; i < ranking.length; i++) {
			$rankingitems[i].innerHTML = ranking[i];
		}
	}
}

function clearRanking() {
	ranking = [];
	$rankingitems.forEach(function(item) {
		item.innerHTML = '';
	});
}

init();
