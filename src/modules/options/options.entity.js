const
	AC_TOGGLE_OPEN = 'toogleOpen';

export default class {
	constructor(view) {
		// view
		this.view = view;
		// props
		view.querySelector('.options__action').addEventListener('click', this.execAction.bind(this));
		view.querySelector('.options__block').addEventListener('click', this.close.bind(this));
	}
	
	execAction(e) {
		const action = e.currentTarget.dataset.optAction;
		
		switch (action) {
			case AC_TOGGLE_OPEN:
				this.toggleOpen();
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
