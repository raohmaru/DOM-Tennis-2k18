import * as env  from './env.js';
import * as _    from './lib/util.js';
import $         from './lib/dom.js';
import Beat      from './lib/beat.js';
import Physics   from './lib/physics.js';
import Signal    from './lib/signal.js';
import SoundMan  from './lib/sndman.js';
import Storage   from './lib/storage.js';
import { Ball, Gameboard, Score, Ranking, Options }  from '../modules/index.js';

// variables
let core,
	ball,
	gameboard,
	score,
	ranking,
	physics,
	cfg,
	watchHeigth;

function init(opts) {
	cfg = opts;
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
	ball.y = (gameboard.box.height >> 1) - ball.height;
	ball.render();

	let beat = new Beat(cfg.fps, frame);
	beat.start();

	initPhysics();
	initEvents();
	SoundMan.init();
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
			watchHeigth = false;
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
	ball.xvel = (ball.x + (ball.width >> 1) - (clientX - gameboard.offset.left)) * cfg.hitHorizMult;
	addKickCount();
	SoundMan.play('ballHit');
	watchHeigth = true;
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
	if (watchHeigth) {
		ranking.updateHeight(parseInt(gameboard.box.bottom - ball.bottom, 10));
	}
}

function winResizeHandler(e) {
	ball.update();
	gameboard.update();
}

export default {
	init
};
