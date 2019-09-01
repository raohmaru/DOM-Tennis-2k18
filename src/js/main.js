import * as cfg from './config.js';
import * as CNT from './const.js';
import Game     from './game.js';
import $        from './lib/dom.js';

// variables
let game,
	ball,
	mode = 0;

function init() {
	$('#start-screen').addEventListener('click', start);
}

function start(e) {
	$('.gameboard')[0].classList.remove('blur');
	game = Game.init(cfg);
	game.v.on(onBallKick, CNT.EV_BALL_KICK);
	game.start(frame);
	ball = game.ball;

	const screen = e.currentTarget;
	screen.removeEventListener('click', start);
	screen.classList.add('fade-out');
	window.setTimeout(() => {
		screen.classList.add('hide');
	}, 1000);
}

function frame() {
	if (!(1 & mode) && ball.bottom < 0) {
		game.score.update('Walter<br>mode<br>enabled', 'warning', 75);
		ball.change(3);
		mode |= 1;
	}
}

function onBallKick(count) {
	if (!(2 & mode) && count === 10) {
		game.score.update('Bear<br>mode<br>enabled', 'warning', 75);
		document.body.classList.add('theme-chucho');
		mode |= 2;
		game.v.off(onBallKick, CNT.EV_BALL_KICK);
	}
}

init();
