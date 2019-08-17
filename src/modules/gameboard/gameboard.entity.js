import Rectangle from '../../js/lib/rectangle.js';

export default function(view) {
	const box = new Rectangle();
	update();

	function update() {
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
		update
	};
};
