import * as env  from '../../js/env.js';

const
	DURATION     = 30,
	OPACITY_INCR = 0.02,
	SCALE_INCR   = 0.05,
	SCALE_MULT   = 200;

export default class {
	constructor(view) {
		// view
		this.view    = view;
		// props
		this._current = 0;
		this._visible = false;
		this._timer   = 0;
		this._opacity = 0;
		this._scale   = 0;
	}

	get current() {
		return this._current;
	}

	render() {
		if (this._visible) {
			if (this._timer++ < DURATION) {
				let cssStr = 'display: block;';

				if (this._scale < 1) {
					this._scale += SCALE_INCR;
				}
				cssStr += `transform: perspective(500px) translateZ(${this._scale * SCALE_MULT}px);`;

				if (!env.isTouch) {
					if (this._opacity < 1) {
						this._opacity += OPACITY_INCR;
					}
					cssStr += `opacity: ${this._opacity};`;
				}

				this.view.style.cssText = cssStr;
			} else {
				this.view.style.display = 'none';
				this._visible = false;
			}
		}
		return this;
	}

	update() {
		this.view.textContent = this._current;
		this._timer   = 0;
		this._opacity = 0;
		this._scale   = 0;
		this._visible = true;
		return this;
	}

	add(num) {
		this._current += num;
		return this;
	}

	reset() {
		this._current = 0;
	}
};
