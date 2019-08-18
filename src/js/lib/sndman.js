import SAS       from './sas/sasynth.js';
import Note      from './sas/note.js';

// 'si,70,0,1:.02,.01,.1,.07,.8:lo,0,670,0,1'
const notesParams = [
		{
			'name': 'ballHit',
			'type': 'sine',
			'freq': 50,
			'envelope': [
				0.02,
				0.01,
				0.1,
				0.07
			],
			'envelopeSustainLevel': 1
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
			'envelopeSustainLevel': 0.8,
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
	sas.start();

	for (let p of notesParams) {
		notes[p.name] = new Note(sas, p);
	}
}

function play(name, volume) {
	if (!sas || paused) {
		return;
	}

	if (notes[name]) {
		const note = notes[name];
		if (volume !== undefined) {
			note.volume = Math.min(volume, 1);
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
	play,
	pause,
	resume
};
