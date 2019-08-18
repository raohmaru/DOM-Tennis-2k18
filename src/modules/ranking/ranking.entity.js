import * as CNT from '../../js/const.js';

export default function(view, core) {
	const
		viewTopScore = view.querySelector('.ranking__topScore'),
		viewTopHeight = view.querySelector('.ranking__topHeight'),
		_scores = [],
		_heights = [];

	let savedScore = core.st.getItem(CNT.LS_TOP_SCORE),
		savedHeight = core.st.getItem(CNT.LS_TOP_HEIGHT);
	if (savedScore) {
		updateScore(parseInt(savedScore, 10));
	}
	if (savedHeight) {
		updateHeight(parseInt(savedHeight, 10));
	}

	core.v.then(clear, CNT.EV_CLEAR_RANKING);

	function updateScore(value) {
		if ((value && !_scores[0]) || value > _scores[0]) {
			_scores.unshift(value);
			viewTopScore.innerHTML = value;
			core.st.setItem(CNT.LS_TOP_SCORE, value);
		}
	}

	function updateHeight(value) {
		if ((value && !_heights[0]) || value > _heights[0]) {
			_heights.unshift(value);
			viewTopHeight.innerHTML = value;
			core.st.setItem(CNT.LS_TOP_HEIGHT, value);
		}
	}

	function clear() {
		_scores.length = 0;
		_heights.length = 0;
		viewTopScore.innerHTML = 0;
		viewTopHeight.innerHTML = 0;
		core.st.setItem(CNT.LS_TOP_SCORE, 0);
		core.st.setItem(CNT.LS_TOP_HEIGHT, 0);
	}

	return {
		updateScore,
		updateHeight
	};
};
