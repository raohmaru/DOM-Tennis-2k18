import * as CNT from '../../js/const.js';

export default class {
	constructor(view, core) {
		// view
		this.view         = view;
		this.viewTopScore = view.querySelector('.ranking__topScore');
		this.viewTopHeight = view.querySelector('.ranking__topHeight');
		// props
		this._scores = [];
		this._heights = [];

		let savedScore = localStorage.getItem(CNT.LS_TOP_SCORE),
			savedHeight = localStorage.getItem(CNT.LS_TOP_HEIGHT);
		if (savedScore) {
			this.updateScore(parseInt(savedScore, 10));
		}
		if (savedHeight) {
			this.updateHeight(parseInt(savedHeight, 10));
		}

		core.v.then(this.clear.bind(this), 'clearRanking');
	}

	updateScore(value) {
		if ((value && !this._scores[0]) || value > this._scores[0]) {
			this._scores.unshift(value);
			this.viewTopScore.innerHTML = value;
			localStorage.setItem(CNT.LS_TOP_SCORE, value);
		}
	}

	updateHeight(value) {
		if ((value && !this._heights[0]) || value > this._heights[0]) {
			this._heights.unshift(value);
			this.viewTopHeight.innerHTML = value;
			localStorage.setItem(CNT.LS_TOP_HEIGHT, value);
		}
	}

	clear() {
		this._scores.length = 0;
		this._heights.length = 0;
		this.viewTopScore.innerHTML = 0;
		this.viewTopHeight.innerHTML = 0;
		localStorage.setItem(CNT.LS_TOP_SCORE, 0);
		localStorage.setItem(CNT.LS_TOP_HEIGHT, 0);
	}
};
