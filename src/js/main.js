import * as cfg  from './config.js';
import * as env  from './env.js';
import * as _    from './lib/util.js';
import $         from './lib/dom.js';
import Beat      from './lib/beat.js';
import Physics   from './lib/physics.js';
import Signal    from './lib/signal.js';
import SAS       from './lib/sas/sasynth.js';
import Note      from './lib/sas/note.js';
import Ball      from '../modules/ball/ball.entity.js';
import Gameboard from '../modules/gameboard/gameboard.entity.js';
import Score     from '../modules/score/score.entity.js';
import Ranking   from '../modules/ranking/ranking.entity.js';
import Options   from '../modules/options/options.entity.js';

// variables
let core,
	ball,
	gameboard,
	score,
	ranking,
	physics,
	ballSnd,
	wallHitSnd;

function init() {
	core = {
		v: new Signal(),
		cfg
	};

	gameboard = new Gameboard($('.gameboard')[0]);
	score     = new Score($('#score'), core);
	ranking   = new Ranking($('.ranking')[0], core);
	Options($('.options')[0], core);

	ball = new Ball($('#ball'));
	ball.x = gameboard.box.left + (gameboard.box.width >> 1) - ball.width;
	ball.y = gameboard.box.bottom - ball.height;
	ball.render();
	ball.view.addEventListener(env.isTouch ? 'touchstart' : 'mouseover', _.throttle(ballHit, 100));

	let beat = new Beat(cfg.fps, frame);
	beat.start();

	initPhysics();
	initSound();
	initActions();
	window.addEventListener('resize', winResizeHandler);
}

function initSound() {
	const sas = new SAS();
	// 'si,70,0,1:.02,.01,.1,.07,.8:lo,0,670,0,1'
	ballSnd = new Note(sas, {
		'type': 'sine',
		'freq': 70,
		// 'volume': 0.5,
		'envelope': [
			0.02,
			0.01,
			0.1,
			0.07
		],
		'envelopeSustainLevel': 0.8,
		'biquadFilter': {
			'type': 'lowpass',
			'detune': 0,
			'frequency': 670,
			'gain': 0,
			'Q': 1
		}
	});
	wallHitSnd = new Note(sas, {
		'type': 'sine',
		'freq': 40,
		'freqDetune': 100,
		// 'volume': 0.25,
		'envelope': [
			0.02,
			0.02,
			0.1,
			0.02
		],
		'envelopeSustainLevel': 0.8,
		'biquadFilter': {
			'type': 'lowpass',
			'detune': 0,
			'frequency': 530,
			'gain': 0,
			'Q': 1
		}
	});
	sas.start();
}

function initPhysics() {
	physics = new Physics(cfg);
	physics.addBoundingBox(gameboard.box);
	physics.addObject(ball);
	ball.onCollision.then((obj, where) => {
		const v = (Math.abs(obj.yvel) + Math.abs(obj.xvel)) * 0.1;
		if (v >= 0.01) {
			wallHitSnd.volume = v;
			wallHitSnd.play();
		}
		if (where === 'bbox:bottom') {
			ranking.updateScore(score.current);
			score.reset();
		}
	});
}

function initActions() {
	const cb = (e) => core.v.emit(e.target.dataset.action, e.target);

	$('[data-action]').forEach(el => {
		if (el.type === 'range') {
			el.addEventListener('change', cb);
		} else {
			el.addEventListener('click', cb);
		}
	});
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
	addKickCount();
	ballSnd.play();
}

function addKickCount() {
	score.add(1)
		.update()
		.render();
}

function frame(currentTime) {
	physics.update();
	ball.render();
	score.render();
	ranking.updateHeight(parseInt(gameboard.box.bottom - ball.bottom, 10));
}

function winResizeHandler(e) {
	ball.update();
	gameboard.update();
}

init();
