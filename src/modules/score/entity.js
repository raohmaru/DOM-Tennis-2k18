const
	DURATION     = 30,
	OPACITY_INCR = 0.02,
	SCALE_INCR   = 0.05;

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
				if (this._opacity < 1) this._opacity += OPACITY_INCR;
				if (this._scale   < 1) this._scale   += SCALE_INCR;
				this.view.style.cssText = `
					display: block;
					opacity: ${this._opacity};
					transform: translateZ(0) scale(${this._scale});`;
			} else {
				this.view.style.display = 'none';
				this._visible = false;
			}
		}
	}
	
	update() {
		this.view.textContent = this._current;
		this._timer   = 0;
		this._opacity = 0;
		this._scale   = 0.25;
		this._visible = true;
	}
	
	add(num) {
		this._current += num;
		return this;
	}
	
	reset() {
		this._current = 0;
	}
};
