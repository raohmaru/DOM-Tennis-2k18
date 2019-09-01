import Rectangle from '../../js/lib/rectangle.js';

export function Gameboard(view) {
	const box = new Rectangle(),
		offset = {};
	update();

	function update() {
		const bcr = view.getBoundingClientRect();
		offset.left = bcr.x;
		offset.top = bcr.y;

		box.update(
			view.clientWidth,
			view.clientHeight,
			view.clientLeft,
			view.clientTop
		);
	}

	return {
		view,
		box,
		offset,
		update
	};
};
