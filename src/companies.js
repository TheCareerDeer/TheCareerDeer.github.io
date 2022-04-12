// Import Node.js modules
import { initializeApp
} from 'firebase/app'

import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from 'firebase/auth'

import { getFirestore, collection, doc, getDocs, addDoc, setDoc, deleteDoc
} from 'firebase/firestore'


try {
	
const page = document.getElementById('companies');
page.innerHTML = '';

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

var loggedIn = false;

var savedPosts = [];
var savedPostsContent = [];
var numberOfSavedPosts = 0;

const container = document.getElementById('container');			// Get page container for posts
const loading = document.getElementById('loading-animation');	// Get post loading animation object
var count = 0;	// Count used for referencing each post as it is generated on the client's screen
var delay = 0;  // Delay in ms used in between loading posts


// Check login status of the user and obtain user data
onAuthStateChanged(auth, (user) => {									
  if(user) {
	  loggedIn = true;
	  const collSavedPosts = collection(db, 'users', auth.currentUser.uid, 'companies');
		getDocs(collSavedPosts)
			.then((snapshot) => {
				snapshot.docs.forEach((doc) => {
					savedPosts.push({ ...doc.data(), id: doc.id });
					numberOfSavedPosts++;
				})
				
		})
				
	  const collSavedPostsContent = collection(db, 'companies');
		getDocs(collSavedPostsContent)
			.then((snapshot) => {
				snapshot.docs.forEach((doc) => {
					for (let i = 0; i < savedPosts.length; i++) {
					  if(savedPosts[i].id == doc.id) {
						  savedPostsContent.push({ ...doc.data(), id: doc.id });
					  }
					}
					
				})
				
				// Load four posts on page load
				if (savedPosts.length == 0) {
					const postElement = document.createElement('div');
					postElement.classList.add('block-post');
					postElement.innerHTML = `
			<form id="company-form" method="post">
			
			<h2>You have not joined or created any companies.</h2><p style="text">You can create a new company or join an existing one by entering a unique company identifier below.</p><input type="text" placeholder="Example: TheCareerDeer" id="companyID" name="companyID" ><br><br>
				<button id="company-button" class="button-login" style="width: 100%; height: 55px;" type="submit">JOIN COMPANY</button>
				</form>
				<br><br>`;
					container.appendChild(postElement);
					
					const companyForm = document.querySelector("#company-form");
					const companyButton = document.getElementById("company-button");
					
					// Add an event listener for the login button function
					companyForm.addEventListener('submit', (e) => {
						e.preventDefault();
						var companyID = companyForm['companyID'].value
						
						form(companyID);
					});
				}
				
				
				
				if (count == 0) {
					showLoading();
				};

				// Load additional posts as the user scrolls down
				window.addEventListener('scroll', () => {
					const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
					
					if(clientHeight + scrollTop >= scrollHeight - 20 && count < savedPosts.length)
						showLoading();
				});
		
		})
				
						
  }
  else {
		// Load four posts on page load
		if (count == 0) {
			showLoading();
		};

		// Load additional posts as the user scrolls down
		window.addEventListener('scroll', () => {
			const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
			
			if(clientHeight + scrollTop >= scrollHeight - 20)
				showLoading();
		});
	
	}
});

async function form(companyID) {
					
					
					let trimResult = companyID.replace(/^\s+|\s+$/gm,'');					
					await setDoc(doc(db, "companies", trimResult), {
					  id: trimResult,
					  name: companyID,
					  ownerID: auth.currentUser.uid,
					  ownerName: auth.currentUser.displayName
					});
					
					const ref = doc(db, "companies", companyID);
					
					await setDoc(doc(db, "users", auth.currentUser.uid, "companies", trimResult), {
					  post: ref,
					  id: trimResult
					});
};

// Show the loading animation, get a post, and append it
async function showLoading() {
	loading.classList.add('show');	// Make loading animation object visible
	setTimeout(getPost, delay);		// Load a post after loading animation ends (850ms)
	delay = 850;
};

// Get a post using a random integer to select post type
async function getPost() {
	// Remotive job post
	
	for(let i = 0; i < 10; i++) {
			// Remotive post
			if(count < savedPosts.length)
			postRemotive();
	}
	
	setTimeout(loading.classList.remove('show'), 800);
};

// Generate a random integer for selecting post types and specific random posts
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

// Show save post animation and save selected post (i) to user's saved posts list
async function savePost(i, id, url, logo, company, title, category, information, date) {
	var saveButton = document.getElementById("save-button-" + i);
	
	if(loggedIn) {
		saveButton.setAttribute('onclick','unsavePost(' + i + ', ' + id + ', "' + url + '", "' + logo + '", "' + company + '", "' + title + '", "' + category + '", "' + information + '", "' + date + '")');
		saveButton.style.background = "url('https://thecareerdeer.com/src/images/save-checked.png')";
		saveButton.style.backgroundSize = "65px 65px";
		
		await setDoc(doc(db, "posts", ("rmtv-" + id)), {
		  id: id,
		  company: company,
		  url: url,
		  logo: logo,
		  company: company,
		  title: title,
		  category: category,
		  information: information,
		  date: date
		});
		
		const ref = doc(db, "posts", ("rmtv-" + id));
		
		await setDoc(doc(db, "users", auth.currentUser.uid, "saved-posts", ("rmtv-" + id)), {
		  post: ref
		});
		
	}
	else {
		alert("You must log in or create an account to save posts.");
	}
};
window.savePost = savePost;


// Show save post animation and save selected post (i) to user's saved posts list
async function unsavePost(i, id, url, logo, company, title, category, information, date) {
	console.log("UNSAVE");
	var saveButton = document.getElementById("save-button-" + i);
	
	if(loggedIn) {
		saveButton.setAttribute('onclick','savePost(' + i + ', ' + id + ', "' + url + '", "' + logo + '", "' + company + '", "' + title + '", "' + category + '", "' + information + '", "' + date + '")');
		saveButton.style.background = "url('https://thecareerdeer.com/src/images/save-unchecked.png')";
		saveButton.style.backgroundSize = "65px 65px";
		
		await deleteDoc(doc(db, "users", auth.currentUser.uid, "saved-posts", ("rmtv-" + id)));
		
	}
	else {
		alert("You must log in or create an account to save posts.");
	}
};
window.unsavePost = unsavePost;



		

// Return formatted dated from JSON formatted date input
function getDate(dateIn) {
	var dateOut = "";
	
	if(dateIn.charAt(5) === '0') {
		if(dateIn.charAt(6) == '1')
			dateOut = "January ";
		else if(dateIn.charAt(6) == '2')
			dateOut = "February ";
		else if(dateIn.charAt(6) === '3')
			dateOut = "March ";
		else if(dateIn.charAt(6) == '4')
			dateOut = "April ";
		else if(dateIn.charAt(6) == '5')
			dateOut = "May ";
		else if(dateIn.charAt(6) == '6')
			dateOut = "June ";
		else if(dateIn.charAt(6) == '7')
			dateOut = "July ";
		else if(dateIn.charAt(6) == '8')
			dateOut = "August ";
		else if(dateIn.charAt(6) == '9')
			dateOut = "September ";
	}
	else {
		if(dateIn.charAt(6) == '0')
			dateOut = "October ";
		else if(dateIn.charAt(6) == '1')
			dateOut = "November ";
		else if(dateIn.charAt(6) == '2')
			dateOut = "December ";
	}
	
	if(dateIn.charAt(8) == '0')
		dateOut = dateOut + (dateIn.charAt(9));
	else
		dateOut = dateOut + (dateIn.charAt(8) + dateIn.charAt(9));
	
	dateOut = dateOut + ", " + dateIn.charAt(0) + dateIn.charAt(1) + dateIn.charAt(2) + dateIn.charAt(3);
	return dateOut;
};

// Return formatted description from input description string
function getFixedString(line) {
	var fixed = "";
	var isAfterSpace = false;
	
	for(let i = 0; i < line.length - 1; i++) {
		if(i == 0) {
			fixed = line.charAt(0).toUpperCase() + line.substring(1, line.length);
		}
		else if(line != "" && isAfterSpace) {
			if(line.substring(i,i+2) != 'or' && line.substring(i,i+3) != 'the' && line.substring(i,i+3) != 'and' && line.substring(i,i+2) != 'of')
				fixed = fixed.substring(0,i) +  line.charAt(i).toUpperCase() + line.substring(i+1, line.length);
			isAfterSpace = false;
		}
		
		if(line != "" && line.charAt(i) == ' ' || line.charAt(i) == '-' || line.charAt(i) == '(')
			isAfterSpace = true;
	}
	
	return fixed;
};

// Show description if hidden, hide description if shown
function changeDescVisibility(i) {
	var selectedDesc = document.getElementById("show-desc-" + i);
	
	if(document.getElementById("show-button-" + i).value == "SHOW DESCRIPTION") {
		selectedDesc.style.width = "100%";
		selectedDesc.style.height = "100%";
		selectedDesc.style.display = "block";
		document.getElementById("show-button-" + i).value = "HIDE DESCRIPTION";
		document.getElementById("blockpost-" + i).style.minHeight = "400px";
		document.getElementById("blockpost-" + i).style.maxHeight = "5000px";
		selectedDesc.offsetHeight;
		selectedDesc.style.opacity = "1.0";
	}
	else {
		selectedDesc.offsetHeight;
		selectedDesc.style.opacity = "0.0";
		sleeping(i);
	}
};
window.changeDescVisibility = changeDescVisibility;

// Pause for requested number of ms
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

// Set description to sleep upon request
async function sleeping(i) {
	var selectedDesc = document.getElementById("show-desc-" + i);
	await sleep(750);
	
	selectedDesc.style.display = "none";
	document.getElementById("blockpost-" + i).style.minHeight = "0px";
	document.getElementById("blockpost-" + i).style.maxHeight = "332px";
	document.getElementById("show-button-" + i).value = "SHOW DESCRIPTION";
};

// Obtain Remotive post
function postRemotive() {
	
	// URL
	//var jobURL = savedPostsContent[count].url;
	
	// Logo
	var logo = "https://thecareerdeer.com/src/images/deer/pretty.jpg";
	
	// Company
	var company = savedPostsContent[count].name;
	
	// Title
	//var jobTitle = savedPostsContent[count].title;
	
	
	// Category
	var category = savedPostsContent[count].ownerName;
	
	
	// Employment type
	//var information = savedPostsContent[count].information;
	
	// Get job posting date and fix
	//var dateOut = savedPostsContent[count].date;
	
	//var targetImage = '';
	//var saveCommand = 'unsavePost';
	//var postID = savedPostsContent[count].id.substring(5,12);
	
	
	// Remotive post template
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.setAttribute("id", ("blockpost-" + count));
	postElement.innerHTML = `
		<div class="post-op">
		<a href="` + `">
			<img src="` + logo + `" style="height: 50px; width: 50px;" />
			<div class="post-op-name" style="font-size: 34px">&nbsp` + company + `</div>
			</a>
		</div>
		<p class="post-text" style="line-height: 24px; margin-top: 8px; font-size: 14px; margin-left: 10px;">by ` + category + `<br>in <a style="font-size: 14px; font-weight: bold; cursor: pointer; color: #904B41;">Software Development</a></p>
		
		<div class="show-desc" id="show-desc-` + count + `">This is the default company description.<br><br><img src="https://thecareerdeer.com/src/images/deer/015.gif" style="width: 532px; border-radius: 5px;"><br><br>Additional features, including custom company descriptions, will be coming to The Career Deer soon.<br><br></div>
		<a><input type="button" class="show-button-input" id="show-button-` + count + `" value="SHOW DESCRIPTION" onclick="changeDescVisibility(` + count + `)" /></a>
		<a href="https://thecareerdeer.com/about/">
			<img class="post-link-button" src="https://thecareerdeer.com/src/images/icon-link.png" />
		</a>
		
	`;

	postElement.style.maxHeight = "332px";
	
	// Append post to container and hide the loading animation
	container.appendChild(postElement);
	
	count++;
};

}

catch { };

