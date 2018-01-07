const
	LS_TOP_SCORE = 'topScore';

export default class {
	constructor(view) {
		// view
		this.view         = view;
		this.viewTopScore = view.querySelector('.ranking__top');
		// props
		this._scores = [];
		
		let savedScore = localStorage.getItem(LS_TOP_SCORE);
		if (savedScore) {
			this.update(parseInt(savedScore, 10));
		}
	}

	update(newScore) {
		if ((newScore && !this._scores[0]) || newScore > this._scores[0]) {
			this._scores.unshift(newScore);
			this.viewTopScore.innerHTML = newScore;
			localStorage.setItem(LS_TOP_SCORE, newScore);
		}
	}

	clear() {
		this._scores.length = 0;
		this.viewTopScore.innerHTML = 0;
		localStorage.setItem(LS_TOP_SCORE, 0);
	}
};
