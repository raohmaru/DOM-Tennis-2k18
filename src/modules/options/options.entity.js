export default function(view, core) {
	const _cfg = Object.assign({}, core.cfg);
	core.v.then(execAction);

	function execAction(action, el) {
		switch (action) {
			case 'toogleOpen':
				toggleOpen();
				break;

			case 'close':
				close();
				break;

			case 'changeSpeed':
				changeSpeed(parseFloat(el.value));
				break;
		}
	}

	function toggleOpen() {
		view.classList.contains('options--open') ? close() : open();
	}

	function open() {
		view.classList.add('options--open');
		window.addEventListener('keydown', onKeyPress);
	}

	function close() {
		view.classList.remove('options--open');
		window.removeEventListener('keydown', onKeyPress);
	}

	function changeSpeed(value) {
		core.cfg.gravity = _cfg.gravity * value;
		core.cfg.hitPower = Math.max(_cfg.hitPower * value * 0.8, _cfg.hitPower);
		core.cfg.hitHorizMult = _cfg.hitHorizMult * value;
	}

	function onKeyPress(e) {
		if (e.keyCode === 27) {  // Escape
			close();
		}
	}
};
