import * as cfg  from './config.js';
import * as env  from './env.js';
import * as _    from './lib/util.js';
import $         from './lib/dom.js';
import Beat      from './lib/beat.js';
import Physics   from './lib/physics.js';
import SAS       from './lib/sas/sasynth.js';
import Note      from './lib/sas/note.js';
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
	physics,
	sas,
	ballSnd,
	wallHitSnd;

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
	physics.onCollision.then((obj) => {
		const v = (Math.abs(obj.yvel) + Math.abs(obj.xvel)) * .05;
		if (v >= 0.01) {
			wallHitSnd.volume = v;
			wallHitSnd.play();
		}
	});

	beat = new Beat(cfg.fps, frame);
	beat.start();

	sas = new SAS();
	ballSnd = new Note(sas, {
		"type": "sine",
		"freq": 70,
		"envelope": [
			0.02,
			0.01,
			0.1,
			0.07
		],
		"envelopeSustainLevel": 0.8,
		// "volume": 0.5,
		"biquadFilter": {
			"type": "lowpass",
			"detune": 0,
			"frequency": 670,
			"gain": 0,
			"Q": 1
		}
	});
	wallHitSnd = new Note(sas, {
		"type": "sine",
		"freq": 40,
		"freqDetune": 100,
		"envelope": [
			0.02,
			0.02,
			0.1,
			0.02
		],
		"envelopeSustainLevel": 0.8,
		// "volume": 0.25,
		"biquadFilter": {
			"type": "lowpass",
			"detune": 0,
			"frequency": 530,
			"gain": 0,
			"Q": 1
		}
	});
	sas.start();
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
	ballSnd.play();
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
