import SAS       from './sas/sasynth.js';
import Note      from './sas/note.js';
import * as _    from './util.js';

const notesParams = [
		{
			'name': 'ballHit',
			'type': 'sine',
			'freq': 60,
			'envelope': [
				0.02,
				0.01,
				0.1,
				0.07
			],
			'envelopeSustainLevel': 0.1
		},
		{
			'name': 'wallHit',
			'type': 'sine',
			'freq': 40,
			'freqDetune': 100,
			'envelope': [
				0.02,
				0.02,
				0.1,
				0.02
			],
			'envelopeSustainLevel': 0.5,
			'biquadFilter': {
				'type': 'lowpass',
				'detune': 0,
				'frequency': 530,
				'gain': 0,
				'Q': 1
			}
		}
	],
	notes = {};
let sas,
	paused;

function init() {
	sas = new SAS();

	for (let p of notesParams) {
		notes[p.name] = new Note(sas, p);
	}
}

function start() {
	sas.start();
}

function play(name, { volume, pitch }) {
	if (!sas || paused) {
		return;
	}

	if (notes[name]) {
		const note = notes[name];
		if (volume !== undefined) {
			note.volume = Math.min(volume, 1);
		}
		if (pitch !== undefined) {
			note.freqDetune = Math.min(pitch, 1000);
		}
		note.play();
	}
}

function pause() {
	paused = true;
}

function resume() {
	paused = false;
}

export default {
	init,
	start,
	play: _.throttle(play, 20),
	pause,
	resume
};
