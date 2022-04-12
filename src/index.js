// Import Node.js modules
import { initializeApp
} from 'firebase/app'

import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile
} from 'firebase/auth'

import { getFirestore, collection, getDocs, addDoc
} from 'firebase/firestore'


// Initialize Firebase configuration constant
const firebaseConfig = {
  apiKey: "AIzaSyDWnA7vja3VhtgZbt3tnCzdKcdWl3zJA3k",
  authDomain: "thecareerdeer.firebaseapp.com",
  projectId: "thecareerdeer",
  storageBucket: "thecareerdeer.appspot.com",
  messagingSenderId: "778028835481",
  appId: "1:778028835481:web:07af86c8b20b619c040e08",
  measurementId: "G-CVYQQETPV2"
};

// Initialize Firebase App, Auth, and Firestore modules
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
var clicked = false;

// Check login status of the user and update page as necessary
onAuthStateChanged(auth, (user) => {									
  if(user) {
	  updateNavBar();		// Update navigation bar links
	  console.log(user);
  }
  else {
	  console.log("You are not signed in.");
	  checkLogin();			// If user is on the login page, add an event listener for the login function
	  checkRegister();		// If user is on the register page, add an event listener for the register function
  }
});


function accountTab() {
const accountButtons = document.getElementById("accountButtons");
accountButtons.style.opacity = "1.0";
};


// Login auth functions
// Call if user is signed out and on the login page
function checkLogin() {
	try {
		const loginForm = document.querySelector("#login-form");
		const loginButton = document.getElementById("login-button");
		
		// Add an event listener for the login button function
		loginForm.addEventListener('submit', (e) => {
			e.preventDefault();
			var identification = loginForm['identification'].value
			var password = loginForm['password'].value;
			
			// Pass information to Firebase and redirect user to the homepage
			signInWithEmailAndPassword(auth, identification, password)
				.then((userCredential) => {
					// Signed in 
					var user = userCredential.user;
					location.href = 'https://thecareerdeer.com/';
				  })
				  .catch((error) => {
					// Login failed
					console.log("Login failed.");
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode);
					console.log(errorMessage);
				  });
		});

	}
	catch { };
};

// Register auth functions
// Call if user is signed out and on the register page
function checkRegister() {
	try {
		const registerForm = document.querySelector('#register-form');
		const continueButton = document.getElementById("continueButton");
		var email = "";
		var username ="";
		var alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;	// Used for later comparison to ensure username is alphanumeric
		
		// After interaction with the "Continue" button, pass username and email credentials if valid to the updated page
		function passCreds() {
			console.log("Passing credentials to next form...");
			email = document.getElementById("email").value;
			username = document.getElementById("username").value;
			
			// Check integrity of email and username
			if (email != "" &&
				email.includes("@") &&
				email.includes(".") &&
				email.length > 5 &&
				!email.includes(" ") &&
				username != "" &&
				username.length > 4 &&
				username.includes(" ") &&
				username.match(/[a-z]/i)) {
					
					console.log("Requirements met...");
					
					// Grab page elements
					const labelEmail = document.getElementById("label-email");
					const labelUsername = document.getElementById("label-username");
					const captionEmail = document.getElementById("caption-email");
					const captionUsername = document.getElementById("caption-username");
					const box1 = document.getElementById("box1");
					const box2 = document.getElementById("box2");
					const button1 = document.getElementById("button1");
					
					// Update page elements
					labelEmail.innerHTML = "<b>Password</b>";
					labelUsername.innerHTML = "<b>Confirm Password</b>";
					captionEmail.innerHTML = "Please enter a password that includes a number or symbol with at least eight characters.";
					captionUsername.innerHTML = "Please retype your password to confirm it is correct.";
					box1.innerHTML = `<input type="password" placeholder="" id="password" name="password" required>`;
					box2.innerHTML = `<input type="password" placeholder="" id="confirmPassword" name="confirmPassword" required>`;
					button1.innerHTML = `<button class="button-login" style="width: 100%; height: 55px;" type="submit">COMPLETE REGISTRATION</button>`;
					console.log("Credentials passed...");
			}
			else {
				// Pass failed
				console.log("Your credentials do not meet the necessary standards required to create an account.");
				email = "";
				username = "";
			}
		};
		
		// Add event listener for passCreds() upon interaction with the "Continue" button
		continueButton.addEventListener('click', (e) => {
			passCreds();
		});

		// Add an event listener for account creation function
		registerForm.addEventListener('submit', (e) => {
			e.preventDefault();
			var password = registerForm['password'].value;
			var confirmPassword = registerForm['confirmPassword'].value;
			console.log("Registration form submitted.");
			
			// Check integrity of password
			if(password == confirmPassword &&
			   password.length > 7) {
				   
				   console.log("Your passwords match.");
			
				// Pass information to Firebase and redirect user to the homepage
				createUserWithEmailAndPassword(auth, email, password)
				  .then((userCredential) => {
					updateProfile(auth.currentUser, {
					  displayName: username, photoURL: "../src/images/logo/small.png"
					}).then(() => {
						const collSavedPosts = collection(db, 'users', auth.currentUser.uid, 'saved-posts');
						addDoc(collSavedPosts, {
							title: "Plumber",
						})
						.then(() => {
							// Profile created!
							console.log("Your account was created successfully.");
							//location.href = '../';
						})
					}).catch((error) => {
					  // An error occurred
					  console.log(error);
					});
					
				  })
				  .catch((error) => {
					// Account creation failed
					console.log("Account creation failed.");
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode);
					console.log(errorMessage);
				  });
			  
			 }
			 else {
				// Account creation failed
				password = "";
				confirmPassword = "";
				console.log("Account creation failed.");
			 };
		});
		
	} catch { };
};

// Pause for requested number of ms
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

// Update navigation bar links based on the user's login status
function updateNavBar() {

	try {
		
		// Grab navigation links and update them
		const navBar = document.getElementById("nav-bar");
		navBar.innerHTML = `
		<a id="dropper"><img style="height: 60px; margin-top: -30px; position: fixed; margin-left: -88px; opacity: 0.9" src="https://png2.cleanpng.com/sh/3ce4713620755b9f2720a9ea5be5202f/L0KzQYm3VsI5N6FoR91yc4Pzfri0gB9ueKZ5feQ2aXPyfsS0iPFuaqZ3f9d7LXL4hMX2jr1ubZ96RdDudz3wdbB8TcVjO2U8SqZsM3PlQLeATsEyQGk5T6c6MUW2QIK9U8c5QGM5UKg3cH7q/kisspng-computer-icons-hamburger-button-menu-new-menu-5b34724c3cb0f7.1188475115301637882486.png" />`;
		
		const accountButtons = document.getElementById("accountButtons");
		accountButtons.innerHTML = `<div id="dropdown" class="dropdown"><div id="hider" class="dropdown-content">
			<br><br><br>
			<a style="margin-top: 4px;" href="saved/">MY JOBS&nbsp;&nbsp;<img src="https://thecareerdeer.com/src/images/save-checked-bw.png" style="height: 24px; position: absolute; margin-left: 1px; margin-top: -4px;" />&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</a>
			<a href="saved/">COMPANIES&nbsp;&nbsp&nbsp<img src="https://cdn1.iconfinder.com/data/icons/camping-adventure-and-outdoors-1/32/cottage-cabin-wood-house-camping-outdoor-stay-512.png" style="height: 22px; position: absolute; margin-left: 1px; margin-top: -5px;" />&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</a>
			<a href="https://thecareerdeer.com/about/">ABOUT US&nbsp;&nbsp;&nbsp<img src="https://thecareerdeer.com/src/images/logo/small.png" style="height: 21px; position: absolute; margin-left: 1px; margin-top: -4px;" />&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</a>
			<a style="border-bottom-left-radius: 5px" id="logout" href=".">LOG OUT&nbsp;&nbsp;&nbsp<img src="https://thecareerdeer.com/src/images/logout.png" style="height: 14px; width: 16px; position: absolute; margin-top: 0px; margin-left: 5px; opacity: .9;" />&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</a>
		  </div></div>`;
		
		const hider = document.getElementById("hider");
		
		navBar.addEventListener('click', (e) => {
			if(!clicked) {
				document.getElementById("hider").style.opacity = "1.0";
				clicked = true;
			}
			else {
				document.getElementById("hider").style.opacity = "0.0"
				clicked = false;
			}
			
		});
		
		
		navBar.addEventListener('mouseover', (e) => {
			hider.style.opacity = "1.0";
		});
		
		
		document.getElementById("notAccountButtons").addEventListener('mouseover', (e) => {
			
				hider.style.opacity = "0.0";
			
		});
		
		// Grab logout button element and add an event listener for button interaction
		const logout = document.getElementById("logout");
		
		logout.addEventListener('click', (e) => {
			e.preventDefault();
			signOut(auth).then(() => {
				console.log('You have signed out.');
				location.href = 'https://thecareerdeer.com/';
			});
		});
		
	} catch { };
	
	updateButtonAbout();
	updateButtonSaved();
};

// Update "About" page navigation bar
function updateButtonAbout() {
	try {
		const discard = document.querySelector("#page-about");
		if(discard != null)
			document.getElementById("button-about").style.opacity = 0.5;
	} catch { };
};

// Update "Saved" page navigation bar
function updateButtonSaved() {
	try {
		const discard = document.querySelector("#saved");
		if(discard != null)
			document.getElementById("button-saved").style.opacity = 0.5;
	} catch { };
};