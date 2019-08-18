import * as cfg  from './config.js';
import * as env  from './env.js';
import * as _    from './lib/util.js';
import $         from './lib/dom.js';
import Beat      from './lib/beat.js';
import Physics   from './lib/physics.js';
import Signal    from './lib/signal.js';
import SoundMan  from './lib/sndman.js';
import Storage   from './lib/storage.js';
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
	physics;

function init() {
	core = {
		v: new Signal(),
		snd: SoundMan,
		st: Storage('domtennis'),
		cfg
	};

	gameboard = Gameboard($('.gameboard')[0]);
	score     = Score($('#score'), core);
	ranking   = Ranking($('.ranking')[0], core);
	Options($('.options')[0], core);

	ball = new Ball($('#ball'), core);
	ball.x = gameboard.box.left + (gameboard.box.width >> 1) - ball.width;
	ball.y = gameboard.box.bottom - ball.height;
	ball.render();

	let beat = new Beat(cfg.fps, frame);
	beat.start();

	initPhysics();
	initEvents();
	// In mobile devices synthetic audio sounds awful
	// if (!env.isTouch) {
	SoundMan.init();
	// }
}

function initPhysics() {
	physics = new Physics(cfg);
	physics.addBoundingBox(gameboard.box);
	physics.addObject(ball);

	ball.onCollision.then((obj, where) => {
		if (where === 'bbox:left' || where === 'bbox:right') {
			const v = Math.abs(obj.xvel) * 0.1;
			if (v >= 0.01) {
				SoundMan.play('wallHit', v);
			}
		} else if (where === 'bbox:bottom') {
			ranking.updateScore(score.getCurrent());
			score.reset();
			const v = Math.abs(obj.yvel) * 0.1;
			if (v >= 0.01) {
				SoundMan.play('wallHit', v);
			}
		}
	});
}

function initEvents() {
	const cb = (e) => core.v.emit(e.target.dataset.action, e.target),
		data = core.st.getAll();

	$('[data-action]').forEach(el => {
		const tag = el.tagName.toLowerCase();
		if (tag === 'input' || tag === 'select') {
			el.addEventListener('change', cb);
		} else {
			el.addEventListener('click', cb);
		}
	});

	ball.view.addEventListener(env.isTouch ? 'touchstart' : 'mouseover', _.throttle(ballHit, 100));
	window.addEventListener('resize', winResizeHandler);

	$('[data-bind]').forEach(el => {
		if (data[el.dataset.bind] !== undefined) {
			const tag = el.tagName.toLowerCase();
			if (tag === 'input' || tag === 'select') {
				if (el.type === 'checkbox') {
					el.checked = data[el.dataset.bind];
				} else {
					el.value = data[el.dataset.bind];
				}
			}
			if (el.dataset.action) {
				core.v.emit(el.dataset.action, el);
			}
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
	ball.xvel = (ball.x + (ball.width >> 1) - (clientX - gameboard.view.offsetLeft)) * cfg.hitHorizMult;
	addKickCount();
	SoundMan.play('ballHit');
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
