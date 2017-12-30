export default class {
	constructor(view) {
		// view
		this.view      = view;
		this.viewLines = view.querySelector('.ball__lines');
		// props
		this.y        = parseInt(view.style.top, 10);
		this.x        = parseInt(view.style.left, 10);
		this.width    = view.clientWidth;
		this.height   = view.clientHeight;
		this.rotation = 0;
		// physics
		this.yvel     = 0;
		this.xvel     = 0;
		this.momentum = false;
		this.freeFall = false;
	}
	
	render() {
		this.view.style.cssText = `
			top: ${this.y}px;
			left: ${this.x}px;
		`;
		this.viewLines.style.cssText = `transform: rotate(${this.rotation}deg);`;
	}
};
