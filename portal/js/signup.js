//  JS validation

function validate() {
	const name = document.getElementById('name').value;
	const phone = document.getElementById('phone').value;
	const email = document.getElementById('email').value;
	const address = document.getElementById('address').value;
	const error_message = document.getElementById('error_message');

	error_message.style.padding = '10px';

	var text;
	if (name.length < 4) {
		text = 'Please Enter valid Name';
		error_message.innerHTML = text;
		return false;
	}

	if (email.indexOf('@') == -1 || email.length < 6) {
		text = 'Please Enter valid Email';
		error_message.innerHTML = text;
		return false;
	}
	if (isNaN(phone) || phone.length != 10) {
		text = 'Please Enter valid Phone Number';
		error_message.innerHTML = text;
		return false;
	}

	if (address.length <= 4) {
		text = 'Please Enter Your Address';
		error_message.innerHTML = text;
		return false;
	}
	alert('Form Submitted Successfully!');
	return true;
}

function singUp() {
	const valid = validate();
	if (valid) {
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
			plan: basicplan,
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
			.then((res) => {
				console.log(res);
				res.json();
				window.location.href = 'businesslist_v2.html';
			})
			.catch((error) => console.log(error));
	} else {
		console.log('error');
	}
}
