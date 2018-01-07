import * as cfg  from './config.js';
import * as env  from './env.js';
import _         from './lib/util.js';
import Beat      from './lib/beat.js';
import Ball      from '../modules/ball/entity.js';
import Gameboard from '../modules/gameboard/entity.js';
import Score     from '../modules/score/entity.js';
import Ranking   from '../modules/ranking/entity.js';
import Options   from '../modules/options/entity.js';

const
	// quick refs
	abs = Math.abs,
	doc = window.document;
	
// variables
let ball,
	gameboard,
	score,
	ranking,
	options,  // eslint-disable-line no-unused-vars
	beat;
	
function init() {
	let inputEvent = env.isTouch ? 'touchstart' : 'mouseover';
	
	gameboard = new Gameboard(doc.querySelector('.gameboard'));
	score     = new Score(doc.getElementById('score'));
	ranking   = new Ranking(doc.querySelector('.ranking'));
	options   = new Options(doc.querySelector('.options'));
	
	ball = new Ball(doc.getElementById('ball'));
	ball.x = gameboard.left + (gameboard.width >> 1) - ball.width;
	ball.y = gameboard.bottom - ball.height;
	ball.render();
	ball.view.addEventListener(inputEvent, _.throttle(ballHit, 100));
	
	doc.getElementById('clearRanking').addEventListener('click', ranking.clear.bind(ranking));
	
	beat = new Beat(cfg.fps, frame);
	beat.start();
}

function ballHit(e) {
	let clientX;
	if (e.touches) {
		clientX = e.touches[0].clientX;
	} else {
		clientX = e.clientX;
	}
	
	ball.yvel = -cfg.hitPower;
	ball.xvel = (ball.x + (ball.width >> 1) - (clientX - gameboard.offsetLeft)) * cfg.hitHorizMult;
	ball.momentum = true;
	ball.freeFall = true;
	addKickCount();
}

function frame(currentTime) {
	if (ball.momentum) {
		ballPhysics();
		ball.render();
	}
	score.render();
}

function ballPhysics() {
	ball.y += ball.yvel;
	if (ball.bottom <= gameboard.bottom) {
		ball.yvel += cfg.gravity;
	} else {
		ball.y -= ball.bottom - gameboard.bottom;
		ball.yvel *= -cfg.groundFriction;
		if (ball.yvel > -cfg.vSpeedThreshold) {
			ball.y = gameboard.bottom - ball.height;
			ball.freeFall = false;
			ball.yvel = 0;
		}
		ranking.update(score.current);
		score.reset();
	}

	ball.x += ball.xvel;
	ball.xvel *= cfg.drag;
	if (ball.x < gameboard.left) {
		ball.x += gameboard.left - ball.x;
		ball.xvel *= -cfg.wallFriction;
	} else if (ball.right > gameboard.right) {
		ball.x -= ball.right - gameboard.right;
		ball.xvel *= -cfg.wallFriction;
	}
	if (abs(ball.xvel) < cfg.hSpeedThreshold) {
		ball.xvel = 0;
	}
	
	if(ball.xvel !== 0) {
		ball.rotation += ball.xvel * 2;		
	}
	
	if (ball.yvel === 0 && ball.xvel === 0 && !ball.freeFall) {
		ball.momentum = false;
	}
}

function addKickCount() {
	score.add(1).update();
	score.render();
}

init();
