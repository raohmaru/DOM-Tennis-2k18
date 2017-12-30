const
	DURATION     = 30,
	OPACITY_INCR = 0.02,
	SCALE_INCR   = 0.05;

export default class {
	constructor(view) {
		// view
		this.view    = view;
		// props
		this.visible = false;
		this.timer   = 0;
		this.opacity = 0;
		this.scale   = 0;
	}
	
	render() {
		if (this.visible) {
			if (this.timer++ < DURATION) {
				if (this.opacity < 1) this.opacity += OPACITY_INCR;
				if (this.scale   < 1) this.scale   += SCALE_INCR;
				this.view.style.cssText = `
					display: block;
					opacity: ${this.opacity};
					transform: translateZ(0) scale(${this.scale});`;
			} else {
				this.view.style.display = 'none';
				this.visible = false;
			}
		}
	}
	
	update(value) {
		this.view.textContent = value;
		this.timer   = 0;
		this.opacity = 0;
		this.scale   = 0.25;
		this.visible = true;
	}
};
