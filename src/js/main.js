import * as cfg  from './config.js';
import * as env  from './env.js';
import * as _    from './lib/util.js';
import $         from './lib/dom.js';
import Beat      from './lib/beat.js';
import Ball      from '../modules/ball/ball.entity.js';
import Gameboard from '../modules/gameboard/gameboard.entity.js';
import Score     from '../modules/score/score.entity.js';
import Ranking   from '../modules/ranking/ranking.entity.js';
import Options   from '../modules/options/options.entity.js';

const
	// quick refs
	abs = Math.abs;
	
// variables
let ball,
	gameboard,
	score,
	ranking,
	options,  // eslint-disable-line no-unused-vars
	beat;
	
function init() {
	let inputEvent = env.isTouch ? 'touchstart' : 'mouseover';
	
	gameboard = new Gameboard($('.gameboard')[0]);
	score     = new Score($('#score'));
	ranking   = new Ranking($('.ranking')[0]);
	options   = new Options($('.options')[0]);
	
	ball = new Ball($('#ball'));
	ball.x = gameboard.left + (gameboard.width >> 1) - ball.width;
	ball.y = gameboard.bottom - ball.height;
	ball.render();
	ball.view.addEventListener(inputEvent, _.throttle(ballHit, 100));
	
	$('#clearRanking').addEventListener('click', ranking.clear.bind(ranking));
	window.addEventListener('resize', winResizeHandler);
	
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
	
	if (ball.xvel !== 0) {
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

function winResizeHandler(e) {
	ball.momentum = true;
}

init();
