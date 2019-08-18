import * as CNT from '../../js/const.js';

export default function(view, core) {
	const _cfg = Object.assign({}, core.cfg);
	core.v.then(execAction);

	function execAction(action, el) {
		switch (action) {
			case CNT.EV_TOOGLE_OPEN:
				toggleOpen();
				break;

			case CNT.EV_CLOSE:
				close();
				break;

			case CNT.EV_CHANGE_SPEED:
				changeSpeed(parseFloat(el.value));
				break;

			case CNT.EV_TOGGLE_MUTE:
				toggleMute(el.checked);
				break;

			case CNT.EV_CHANGE_BALL:
				core.st.setItem(CNT.LS_BALL, el.value);
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
		core.st.setItem(CNT.LS_SPEED, value);
	}

	function toggleMute(value) {
		if (value) {
			core.snd.pause();
		} else {
			core.snd.resume();
		}
		core.st.setItem(CNT.LS_MUTED, value);
	}

	function onKeyPress(e) {
		if (e.keyCode === 27) {  // Escape
			close();
		}
	}
};
