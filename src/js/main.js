import * as cfg  from './config.js';
import Game      from './game.js';
import $         from './lib/dom.js';

// variables
let game;

function init() {
	$('#start-screen').addEventListener('click', start);
}

function start(e) {
	$('.gameboard')[0].classList.remove('blur');
	game = Game.init(cfg);
	game.start(frame);

	const screen = e.currentTarget;
	screen.removeEventListener('click', start);
	screen.classList.add('fade-out');
	window.setTimeout(() => {
		screen.classList.add('hide');
	}, 1000);
}

function frame() {

}

init();
