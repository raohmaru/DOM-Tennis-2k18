export default class {
	constructor(view) {
		// view
		this.view      = view;
		this.viewLines = view.querySelector('.ball__lines');
		// props
		this.y        = 0;
		this.x        = 0;
		this.rotation = 0;
		this.update();
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get right() {
		return this.x + this._width;
	}

	get bottom() {
		return this.y + this._height;
	}

	render() {
		this.view.style.cssText = `transform: translate3d(${this.x}px, ${this.y}px, 0);`;
		this.viewLines.style.cssText = `transform: rotateZ(${this.rotation}deg);`;
	}

	update() {
		this._width = this.view.clientWidth;
		this._height = this.view.clientHeight;
	}
};
