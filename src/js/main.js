import * as cfg from './config.js';
import Ball from '../modules/ball/entity.js';
import Gameboard from '../modules/gameboard/entity.js';
import Score from '../modules/score/entity.js';
import Ranking from '../modules/ranking/entity.js';
import Options from '../modules/options/entity.js';

const
	// quick refs
	abs = Math.abs,
	doc = window.document;
	
// variables
let kickCount = 0,
	ball,
	gameboard,
	score,
	ranking,
	options,  // eslint-disable-line no-unused-vars
	startTime;
	
function init() {
	ball = new Ball(doc.getElementById('ball'));
	ball.view.addEventListener('mouseover', ballHit);
	
	gameboard = new Gameboard(doc.querySelector('.gameboard'));
	score     = new Score(doc.getElementById('score'));
	ranking   = new Ranking(doc.querySelector('.ranking'));
	options   = new Options(doc.querySelector('.options'));
	
	doc.getElementById('clearRanking').addEventListener('click', ranking.clear.bind(ranking));
	
	startTime = window.performance.now();
	frame();
}

function ballHit(e) {
	ball.yvel = -cfg.hitPower;
	ball.xvel = (ball.x + (ball.width >> 1) - e.clientX) * cfg.hitHorizMult;
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
			ball.render();
		}
		score.render();
	}
}

function ballPhysics() {
	ball.y += ball.yvel;
	if (ball.y + ball.height <= gameboard.bottom) {
		ball.yvel += cfg.gravity;
	} else {
		ball.y -= ball.y + ball.height - gameboard.bottom;
		ball.yvel *= -cfg.groundFriction;
		if (ball.yvel > -cfg.vSpeedThreshold) {
			ball.y = gameboard.bottom - ball.height;
			ball.freeFall = false;
			ball.yvel = 0;
		}
		ranking.update(kickCount);
		kickCount = 0;
	}

	ball.x += ball.xvel;
	ball.xvel *= cfg.drag;
	if (ball.x < gameboard.left) {
		ball.x += gameboard.left - ball.x;
		ball.xvel *= -cfg.wallFriction;
	} else if (ball.x + ball.width > gameboard.right) {
		ball.x -= ball.x + ball.width - gameboard.right;
		ball.xvel *= -cfg.wallFriction;
	}
	if (abs(ball.xvel) < cfg.hSpeedThreshold) {
		ball.xvel = 0;
	}
	
	ball.rotation += ball.xvel * 2;
	
	if (ball.yvel === 0 && ball.xvel === 0 && !ball.freeFall) {
		ball.momentum = false;
	}
}

function addKickCount() {
	kickCount++;
	score.update(kickCount);
	score.render();
}

init();
