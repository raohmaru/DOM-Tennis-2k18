export default class {
	constructor(view) {
		// view
		this.view      = view;
		this.viewLines = view.querySelector('.ball__lines');
		// props
		this.y        = 0;
		this.x        = 0;
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
		this.view.style.cssText = `transform: translate3d(${this.x}px, ${this.y}px, 0);`;
		this.viewLines.style.cssText = `transform: rotate(${this.rotation}deg);`;
	}
};
