import * as cfg  from './config.js';
import * as env  from './env.js';
import * as _    from './lib/util.js';
import $         from './lib/dom.js';
import Beat      from './lib/beat.js';
import Physics   from './lib/physics.js';
import Ball      from '../modules/ball/ball.entity.js';
import Gameboard from '../modules/gameboard/gameboard.entity.js';
import Score     from '../modules/score/score.entity.js';
import Ranking   from '../modules/ranking/ranking.entity.js';
import Options   from '../modules/options/options.entity.js';

// variables
let ball,
	gameboard,
	score,
	ranking,
	options,  // eslint-disable-line no-unused-vars
	beat,
	physics;

function init() {
	let inputEvent = env.isTouch ? 'touchstart' : 'mouseover';

	gameboard = new Gameboard($('.gameboard')[0]);
	score     = new Score($('#score'));
	ranking   = new Ranking($('.ranking')[0]);
	options   = new Options($('.options')[0]);

	ball = new Ball($('#ball'));
	ball.x = gameboard.box.left + (gameboard.box.width >> 1) - ball.width;
	ball.y = gameboard.box.bottom - ball.height;
	ball.render();
	ball.view.addEventListener(inputEvent, _.throttle(ballHit, 100));

	$('#clearRanking').addEventListener('click', ranking.clear.bind(ranking));
	window.addEventListener('resize', winResizeHandler);

	physics = new Physics(cfg);
	physics.addBoundingBox(gameboard.box);
	physics.addObject(ball);

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
	physics.update();
	if (ball.momentum) {
		ball.render();
		if (ball.bottom >= gameboard.box.bottom) {
			ranking.update(score.current);
			score.reset();
		}
	}
	score.render();
}

function addKickCount() {
	score.add(1)
		.update()
		.render();
}

function winResizeHandler(e) {
	ball.momentum = true;
	ball.update();
	gameboard.update();
}

init();
