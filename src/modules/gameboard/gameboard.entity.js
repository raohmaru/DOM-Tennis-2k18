import Rectangle from '../../js/lib/rectangle.js';

export default class {
	constructor(view) {
		// view
		this.view = view;
		this.box = new Rectangle();
		this.update();
	}

	get offsetTop() {
		return this.view.offsetTop;
	}

	get offsetLeft() {
		return this.view.offsetLeft;
	}

	update() {
		this.box.update(
			this.view.clientWidth,
			this.view.clientHeight,
			this.view.clientLeft,
			this.view.clientTop
		);
	}
};
