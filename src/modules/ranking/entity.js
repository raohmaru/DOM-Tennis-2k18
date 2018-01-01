export default class {
	constructor(view) {
		// view
		this.view         = view;
		this.viewTopScore = view.querySelector('.ranking__top');
		// props
		this.scores = [];
	}

	update(count) {
		if ((count && !this.scores[0]) || count > this.scores[0]) {
			this.scores.unshift(count);
			this.viewTopScore.innerHTML = count;
		}
	}

	clear() {
		this.scores.length = 0;
		this.viewTopScore.innerHTML = 0;
	}
};
