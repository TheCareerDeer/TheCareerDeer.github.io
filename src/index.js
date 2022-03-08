import { initializeApp
} from 'firebase/app'

import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from 'firebase/auth'

import { getFirestore, collection, getDocs
} from 'firebase/firestore'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional...
const firebaseConfig = {
  apiKey: "AIzaSyDWnA7vja3VhtgZbt3tnCzdKcdWl3zJA3k",
  authDomain: "thecareerdeer.firebaseapp.com",
  projectId: "thecareerdeer",
  storageBucket: "thecareerdeer.appspot.com",
  messagingSenderId: "778028835481",
  appId: "1:778028835481:web:07af86c8b20b619c040e08",
  measurementId: "G-CVYQQETPV2"
};

initializeApp(firebaseConfig)
const auth = getAuth();
const db = getFirestore()


onAuthStateChanged(auth, (user) => {									
  if(user) {
	  updateNavBar();
	  console.log(user);
  }
  else {
	  console.log("You are not signed in.");
  }
})


const colCities = collection(db, 'cities')
getDocs(colCities)
	.then((snapshot) => {
		let cities = []
		snapshot.docs.forEach((doc) => {
			cities.push({ ...doc.data(), id: doc.id })
		})
		console.log(cities)
})	.catch(err => {
		console.log(err.message)
});


function checkLogin() {
	
}

function checkRegister() {
	
try {
	const registerForm = document.querySelector('#register-form');
	const continueButton = document.getElementById("continueButton");
	var email = "";
	var username ="";
	var alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
	
	function passCreds() {
		console.log("Passing credentials to next form...");
		email = document.getElementById("email").value;
		username = document.getElementById("username").value;
			
		if (email != "" &&
			email.includes("@") &&
			email.includes(".") &&
			email.length > 5 &&
			!email.includes(" ") &&
			username != "" &&
			username.length > 2 &&
			username.match(alphaNumeric)) {
				
				console.log("Requirements met...");
				
				const labelEmail = document.getElementById("label-email");
				const labelUsername = document.getElementById("label-username");
				const captionEmail = document.getElementById("caption-email");
				const captionUsername = document.getElementById("caption-username");
				const box1 = document.getElementById("box1");
				const box2 = document.getElementById("box2");
				const button1 = document.getElementById("button1");
				
				labelEmail.innerHTML = "<b>Password</b>";
				labelUsername.innerHTML = "<b>Confirm Password</b>";
				captionEmail.innerHTML = "Please enter a password that includes a number or symbol with at least eight characters.";
				captionUsername.innerHTML = "Please retype your password to confirm it is correct.";
				box1.innerHTML = `<input type="password" placeholder="Example: Andr0meda" id="password" name="password" required>`;
				box2.innerHTML = `<input type="password" placeholder="Example: Andromed@" id="confirmPassword" name="confirmPassword" required>`;
				button1.innerHTML = `<button class="button-login" style="width: 100%; height: 55px;" type="submit">COMPLETE REGISTRATION</button>`;
				console.log("Credentials passed...");
		}
		else {
			console.log("Your credentials do not meet the necessary standards required to create an account.");
			email = "";
			username = "";
		}
	}
		
	continueButton.addEventListener('click', (e) => {
		passCreds();
	});

	registerForm.addEventListener('submit', (e) => {
		// Create an account
		e.preventDefault();
		var password = registerForm['password'].value;
		var confirmPassword = registerForm['confirmPassword'].value;
		console.log("Registration form submitted.");
		
		if(password == confirmPassword &&
		   password.length > 7) {
			   
			   console.log("Your passwords match.");
		
			createUserWithEmailAndPassword(auth, email, password)
			  .then((userCredential) => {
				// Signed in 
				console.log("Your account was created successfully.");
				location.href = '../';
			  })
			  .catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
			  });
		  
		 }
		 else {
			password = "";
			confirmPassword = "";
		 }
	});
}
catch { }
}

function updateNavBar() {
	try {
		const navBar = document.getElementById("nav-bar");
		navBar.innerHTML = `<a id="logout" href=".">LOG OUT</a><a href="https://thecareerdeer.com/about/" id="button-about">ABOUT</a>`;
		
		const logout = document.getElementById("logout");
		logout.addEventListener('click', (e) => {
			e.preventDefault();
			signOut(auth).then(() => {
				console.log('You have signed out.');
				location.href = 'https://thecareerdeer.com/';
			});
		});
	} catch { }
	
	updateButtonAbout();
}

function updateButtonAbout() {
	try {
		document.getElementById("page-about");
		document.getElementById("button-about").style.opacity = 0.5;
	} catch { }
}