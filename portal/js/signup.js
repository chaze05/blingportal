document.getElementById('myform').onsubmit = (e) => {
	e.preventDefault(e);
	const url = 'https://www.bling-center.com/business/new/customer';

	let name = document.querySelector('#username');
	let phoneNumber = document.querySelector('#phonenumber');
	let email = document.querySelector('#email');
	let address = document.querySelector('#address');
	let basicplan = document.querySelector('#basicplan');
	let plusplan = document.querySelector('#plusplan');
	let proplan = document.querySelector('#proplan');

	var details = {
		name: name.value,
		phoneNumber: phoneNumber.value,
		email: email.value,
		address: address.value,
		basicplan: basicplan,
		plusplan: plusplan,
		proplan: proplan,
	};
	var formBody = [];
	for (var property in details) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(details[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	formBody = formBody.join('&');
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body: formBody,
	})
		.then((res) => res.json())
		.then((res2) => console.log(res2));
};

const spinner = document.getElementById('spinner');

function loadData() {
	spinner.removeAttribute('hidden');
	fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=5000ms')
		.then((response) => response.json())
		.then((data) => {
			spinner.setAttribute('hidden', '');
			console.log(data);
		});
}
