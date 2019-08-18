import { EV_CHANGE_BALL } from '../../js/const.js';

const BALLS = [
	'golf',
	'tennis',
	'football'
];

export default class {
	constructor(view, core) {
		// view
		this.view      = view;
		this.viewLines = view.querySelector('.ball__lines');
		// props
		this.y        = 0;
		this.x        = 0;
		this.rotation = 0;
		// cached props
		this._y        = 0;
		this._x        = 0;
		this._rotation = 0;

		this.update();
		core.v.then(this.change.bind(this), EV_CHANGE_BALL);
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
		if (this.x !== this._x || this.y !== this._y) {
			this._y = this.y;
			this._x = this.x;
			this.view.style.cssText = `transform: translate3d(${this.x}px, ${this.y}px, 0);`;
		}
		if (this.rotation !== this._rotation) {
			this._rotation = this.rotation;
			this.viewLines.style.cssText = `transform: rotateZ(${this.rotation}deg);`;
		}
	}

	update() {
		this._width = this.view.clientWidth;
		this._height = this.view.clientHeight;
	}

	change(el) {
		this.view.className = `ball ball--${BALLS[el.value]}`;
		this.update();
	}
};
