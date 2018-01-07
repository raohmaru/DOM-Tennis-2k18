export default class {
	constructor(view) {
		// view
		this.view      = view;
		this.viewLines = view.querySelector('.ball__lines');
		// props
		this.y        = 0;
		this.x        = 0;
		this.rotation = 0;
		// physics
		this.yvel     = 0;
		this.xvel     = 0;
		this.momentum = false;
		this.freeFall = false;
	}
	
	get width() {
		return this.view.clientWidth;
	}
	
	get height() {
		return this.view.clientHeight;
	}
	
	get right() {
		return this.x + this.width;
	}
	
	get bottom() {
		return this.y + this.height;
	}
	
	render() {
		this.view.style.cssText = `transform: translate3d(${this.x}px, ${this.y}px, 0);`;
		this.viewLines.style.cssText = `transform: rotateZ(${this.rotation}deg);`;
	}
};
