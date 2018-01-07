import $ from '../../js/lib/dom.js';

const
	AC_TOGGLE_OPEN = 'toogleOpen',
	AC_CLOSE       = 'close';

export default class {
	constructor(view) {
		this.view = view;
		
		$('[data-opt-action]').forEach(el => el.addEventListener('click', this.execAction.bind(this)));
	}
	
	execAction(e) {
		let action = e.currentTarget.dataset.optAction;
		
		switch (action) {
			case AC_TOGGLE_OPEN:
				this.toggleOpen();
				break;
				
			case AC_CLOSE:
				this.close();
				break;
		}
	}
	
	toggleOpen() {
		this.view.classList.contains('options--open') ? this.close() : this.open();
	}
	
	open() {
		this.view.classList.add('options--open');
	}
	
	close() {
		this.view.classList.remove('options--open');
	}
};
