let storageName,
	data;

function getItem(name) {
	return data[name];
}

function setItem(name, value) {
	data[name] = value;
	localStorage.setItem(storageName, JSON.stringify(data));
}

function getAll() {
	return Object.assign({}, data);
}

export default function(lsName) {
	storageName = lsName;
	data = localStorage.getItem(lsName);
	if (data) {
		data = JSON.parse(data);
	} else {
		data = {};
	}

	return  {
		getItem,
		setItem,
		getAll
	};
};
