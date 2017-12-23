(function() {

var // const
	gravity = 0.5,
	drag = .98,
	groundFriction = 0.7,
	wallFriction = 1,
	hitPower = 10,
	hitHorizMult = 1,
	fpsInterval = 1000 / 60,
	vSpeedThreshold = 1,
	hSpeedThreshold = .2,
	scoreDur = 30,
	scoreOpacityIncr = .02,
	scoreScaleIncr = .05,
	// quick refs
	abs = Math.abs,
	doc = window.document,
	// variables
	ball = {
		x: 0,
		y: 0,
		width: 34,
		height: 34,
		rotation: 0,
		momentum: false,
		freeFall: false
	},
	ballSpeed = {
		x: 0,
		y: 0
	},
	gameboard = {},	
	kickCount = 0,
	showScore = false,
	scoreTimer = 0,
	scoreOpacity = 0,
	scoreScale = 0,
	ranking = [],
	startTime,
	// DOM
	$gameboard    = doc.querySelector('.gameboard'),
	$ball         = doc.getElementById('ball'),
	$ballLines    = $ball.querySelector('.ball__lines'),
	$score        = doc.getElementById('score'),
	$rankingitems = [].slice.apply(doc.querySelectorAll('.ranking__list li'));
	
function init() {
	ball.y = parseInt($ball.style.top, 10);
	ball.x = parseInt($ball.style.left, 10);
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
	ballSpeed.y = -hitPower;
	ballSpeed.x = (ball.x + (ball.width >> 1) - e.clientX) * hitHorizMult;
	ball.momentum = true;
	ball.freeFall = true;
	addKickCount();
}

function frame(currentTime) {
	window.requestAnimationFrame(frame);
	// calc elapsed time since last loop
	var elapsed = currentTime - startTime;
	// if enough time has elapsed, draw the next frame
	if (elapsed > fpsInterval) {
		// Get ready for next frame by setting startTime=currentTime, but...
		// Also, adjust for fpsInterval not being multiple of 16.67
		startTime = currentTime - (elapsed % fpsInterval);
	
		if(ball.momentum) {
			ballPhysics();
			renderBall();
		}
		if(showScore) {
			renderScore();
		}
	}
}

function ballPhysics() {
	ball.y += ballSpeed.y;
	if(ball.y + ball.height <= gameboard.bottom) {
		ballSpeed.y += gravity;
	} else {
		ball.y -= ball.y + ball.height - gameboard.bottom;
		ballSpeed.y *= -groundFriction;
		if(ballSpeed.y > -vSpeedThreshold) {
			ball.y = gameboard.bottom - ball.height;
			ball.freeFall = false;
			ballSpeed.y = 0;
		}
		updateRanking(kickCount);
		kickCount = 0;
	}	

	ball.x += ballSpeed.x;
	ballSpeed.x *= drag;
	if(ball.x < gameboard.left) {
		ball.x += gameboard.left - ball.x;
		ballSpeed.x *= -wallFriction;
	}
	else if(ball.x + ball.width > gameboard.right) {
		ball.x -= ball.x + ball.width - gameboard.right;	
		ballSpeed.x *= -wallFriction;
	}
	if(abs(ballSpeed.x) < hSpeedThreshold) {
		ballSpeed.x = 0;
	}
	
	ball.rotation += ballSpeed.x * 2;
	
	if(ballSpeed.y === 0 && ballSpeed.x === 0 && !ball.freeFall) {
		ball.momentum = false;
	}
}

function renderBall() {
	$ball.style.cssText = 'top:'  + ball.y + 'px;' +
						  'left:' + ball.x + 'px;';
	$ballLines.style.cssText = 'transform: rotate(' + ball.rotation + 'deg);';
}

function renderScore() {
	if(scoreTimer++ < scoreDur) {
		if(scoreOpacity < 1) scoreOpacity += scoreOpacityIncr;
		if(scoreScale   < 1) scoreScale += scoreScaleIncr;
		$score.style.cssText =  'display: block;' +
								'opacity:'  + scoreOpacity + ';' +
								'transform: translateZ(0) scale(' + scoreScale + ');';
	} else {
		$score.style.display = 'none';
		showScore = false;
	}
}

function addKickCount() {
	kickCount++;
	$score.textContent = kickCount;
	showScore = true;
	scoreTimer = 0;
	scoreOpacity = 0;
	scoreScale = .25;
	renderScore();
}

function updateRanking(count) {
	if(count && !ranking[0] || count > ranking[0]) {
		ranking.unshift(count);
		for(var i=0; i<ranking.length; i++) {
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

})();
