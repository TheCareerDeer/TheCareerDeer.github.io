// Import Node.js modules
import { initializeApp
} from 'firebase/app'

import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from 'firebase/auth'

import { getFirestore, collection, doc, getDocs, addDoc, setDoc, deleteDoc
} from 'firebase/firestore'


try {
	
const page = document.getElementById('homepage');
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
var numberOfSavedPosts = 0;

const container = document.getElementById('container');			// Get page container for posts
const loading = document.getElementById('loading-animation');	// Get post loading animation object
var count = 0;	// Count used for referencing each post as it is generated on the client's screen
var delay = 0;  // Delay in ms used in between loading posts


// Check login status of the user and obtain user data
onAuthStateChanged(auth, (user) => {									
  if(user) {
	  loggedIn = true;
	  const collSavedPosts = collection(db, 'users', auth.currentUser.uid, 'saved-posts');
		getDocs(collSavedPosts)
			.then((snapshot) => {
				snapshot.docs.forEach((doc) => {
					savedPosts.push({ ...doc.data(), id: doc.id });
					numberOfSavedPosts++;
				})
				
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
						
		})	.catch(err => {
				console.log(err.message);
		});
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

// Show the loading animation, get a post, and append it
async function showLoading() {
	loading.classList.add('show');	// Make loading animation object visible
	setTimeout(getPost, delay);		// Load a post after loading animation ends (850ms)
	delay = 850;
};

// Get a post using a random integer to select post type
async function getPost() {
	// Remotive job post
	const postResponse = await fetch(`https://remotive.com/api/remote-jobs`);
	const postData = await postResponse.json();
	
	for(let i = 0; i < 10; i++) {
		var x = getRandomInt(0,10);
		
		if(x < 9) {
			// Remotive post
			const data = { post: postData.jobs[count] };
			postRemotive(data);
			count++;
		}
		else {
			// Deer GIF post
			deerPost();
		}
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
		
		await setDoc(doc(db, "posts", "rmtv-" + id), {
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
		
		const ref = doc(db, "posts", "rmtv-" + id);
		
		await setDoc(doc(db, "users", auth.currentUser.uid, "saved-posts", "rmtv-" + id), {
		  post: ref,
		  id: id
		});
		
	}
	else {
		alert("You must log in or create an account to save posts.");
	}
};
window.savePost = savePost;


// Show save post animation and save selected post (i) to user's saved posts list
async function unsavePost(i, id, url, logo, company, title, category, information, date) {
	var saveButton = document.getElementById("save-button-" + i);
	
	if(loggedIn) {
		saveButton.setAttribute('onclick','savePost(' + i + ', ' + id + ', "' + url + '", "' + logo + '", "' + company + '", "' + title + '", "' + category + '", "' + information + '", "' + date + '")');
		saveButton.style.background = "url('https://thecareerdeer.com/src/images/save-unchecked.png')";
		saveButton.style.backgroundSize = "65px 65px";
		
		await deleteDoc(doc(db, "users", auth.currentUser.uid, "saved-posts", "rmtv-" + id));
		
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
function postRemotive(data) {
	
	// URL
	var jobURL = data.post.url;
	
	// Logo
	var logo = data.post.company_logo;
	
	// Company
	var company = data.post.company_name;
	
	// Title
	var jobTitle = getFixedString(data.post.title);
	
	
	// Category
	var category = data.post.category;
	if(category == 'All others')
		category = 'Other';
	
	
	// Employment type
	var information = "";
	
	if(data.post.job_type == 'full_time')
		information = "&nbsp; •&nbsp; Full-Time";
	else if(data.post.job_type == 'part_time')
		information = "&nbsp; •&nbsp; Part-Time";
	else if(data.post.job_type == 'contract')
		information = "&nbsp; •&nbsp; Contract Position";
	
	
	// Location
	var jobLocation = getFixedString(data.post.candidate_required_location);
	
	if(jobLocation != "")
		information = information + "&nbsp; •&nbsp; " + jobLocation;
	
	
	// Salary
	if(data.post.salary != "")
		information = information + "&nbsp; •&nbsp; " + data.post.salary;
	
	information = "Remote" + information;
	
	
	// Description
	var jobDescription = data.post.description.substring(0, data.post.description.length - 86);
	var jobDescription = jobDescription.replace(/<img[^>]*>/g,"");
	
	
	// Get job posting date and fix
	var dateIn = data.post.publication_date;
	var dateOut = getDate(dateIn);
	
	var targetImage = 'https://thecareerdeer.com/src/images/save-unchecked.png';
	var saveCommand = 'savePost';
	var postID = data.post.id;
	
	// Update save button if post is already saved
	for (let i = 0; i < numberOfSavedPosts; i++) {
		
		if(loggedIn && postID == savedPosts[i].id.substring(5, 12)) {
			targetImage = 'https://thecareerdeer.com/src/images/save-checked.png';
			saveCommand = 'unsavePost';
			console.log("Saved post loaded.");
			break;
		}
		else if(!loggedIn) {
			break;
		}
	}

	
	
	// Remotive post template
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.setAttribute("id", ("blockpost-" + count));
	postElement.innerHTML = `
		<div class="post-op">
		<a href="` + jobURL + `">
			<img src="` + logo + `" alt="` + company + `" />
			<div class="post-op-name">` + company + `</div>
			</a>
			<input type="button" style="background: url(` + targetImage + `); background-size: 65px 65px;" id="save-button-` + count + `" onclick="` + saveCommand + `(` + count + `, ` + postID + `, '` + jobURL + `', '` + logo + `', '` + company + `', '` + jobTitle + `', '` + category + `', '` + information + `', '` + dateOut + `')" />
		</div>
		<h2 class="post-title"><a style="" href="` + jobURL + `">` + jobTitle + `</a></h2>
		<p class="post-text" style="margin-top: 8px; font-size: 13px; margin-left: 10px;">in <a style="font-size: 14px; font-weight: bold; cursor: pointer; color: #904B41;">` + category + `</a></p>
		<p class="post-text" style="margin-top: -8px;">` + information + `</p>
		
		<div class="show-desc" id="show-desc-` + count + `">` + jobDescription + `<br></div>
		<a><input type="button" class="show-button-input" id="show-button-` + count + `" value="SHOW DESCRIPTION" onclick="changeDescVisibility(` + count + `)" /></a>
		<a href="` + jobURL + `">
			<img class="post-link-button" src="https://thecareerdeer.com/src/images/icon-link.png" />
		</a>
		<div class="user-info">
			<div class="post-date">` + dateOut + `</div>
			<div class="post-remotive-link"><a href="https://remotive.io/">Provided by Remotive</a></div>
		</div>
		
	`;

	
	// Set max height based on post content size for show/hide animation
	if(jobTitle.length < 42 && information.length < 77) {
		postElement.style.maxHeight = "285px";
	}
	else if(jobTitle.length < 42 && information.length >= 77 && information.length < 154) {
		postElement.style.maxHeight = "303px";
	}
	else if(jobTitle.length >= 42 && jobTitle.length < 81 && information.length < 77) {
		postElement.style.maxHeight = "314px";
	}
	else if(jobTitle.length >= 42 && jobTitle.length < 81 && information.length >= 77 && information.length < 154) {
		postElement.style.maxHeight = "332px";
	}
	
	// Append post to container and hide the loading animation
	container.appendChild(postElement);
};

// Deer GIF post using random integer to select post
function deerPost() {
	var x = getRandomInt(0,25);
	const postElement = document.createElement('div');
	postElement.classList.add('block-deer');
	
	if(x == 0) {
	postElement.innerHTML = `
		<img src="src/images/deer/001.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">The average job search in the United States takes five months. You're on the right track, baby!
		</div>
	`;
	}
	else if(x == 1) {
	postElement.innerHTML = `
		<img src="src/images/deer/002.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">73% of global employers are struggling to find candidates who meet their standards.
		</div>
	`;	
	}
	else if(x == 2) {
	postElement.innerHTML = `
		<img src="src/images/deer/003.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Keep your eyes peeled! There are endless opportunities.
		</div>
	`;	
	}
	else if(x == 3) {
	postElement.innerHTML = `
		<img src="src/images/deer/004.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Remote is the new black. Work from home!
		</div>
	`;	
	}
	else if(x == 4) {
	postElement.innerHTML = `
		<img src="src/images/deer/005.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thinking about submitting an application? Make sure you send your most updated resume!
		</div>
	`;	
	}
	else if(x == 5) {
	postElement.innerHTML = `
		<img src="src/images/deer/006.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Keep looking! There's a job out there for you!
	`;	
	}
	else if(x == 6) {
	postElement.innerHTML = `
		<img src="src/images/deer/007.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">We've got your back! Our job postings are provided by trusted sources.
		</div>
	`;	
	}
	else if(x == 7) {
	postElement.innerHTML = `
		<img src="src/images/deer/008.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thanks for using The Career Deer! You're the best!
		</div>
	`;	
	}
	else if(x == 8) {
	postElement.innerHTML = `
		<img src="src/images/deer/009.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Applying for a job? Don't forget to check the technical requirements!
		</div>
	`;	
	}
	else if(x == 9) {
	postElement.innerHTML = `
		<img src="src/images/deer/010.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Want to stand out on your application? Add information about projects you've worked on!
		</div>
	`;	
	}
	else if(x == 10) {
	postElement.innerHTML = `
		<img src="src/images/deer/011.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thanks for using our site! We love you!
		</div>
	`;	
	}
	else if(x == 11) {
	postElement.innerHTML = `
		<img src="src/images/deer/012.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Setting up an interview? Don't forget to research the company and position!
		</div>
	`;	
	}
	else if(x == 12) {
	postElement.innerHTML = `
		<img src="src/images/deer/013.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Don't walk into an interview blindly. Research the company first!
		</div>
	`;	
	}
	else if(x == 13) {
	postElement.innerHTML = `
		<img src="src/images/deer/014.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Don't walk into an interview blindly. Research the company first!
		</div>
	`;	
	}
	else if(x == 14) {
	postElement.innerHTML = `
		<img src="src/images/deer/015.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thanks for using our site! We appreciate your support!
		</div>
	`;	
	}
	else if(x == 15) {
	postElement.innerHTML = `
		<img src="src/images/deer/016.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Practicing for an interview? Don't forget to make eye contact!
		</div>
	`;	
	}
	else if(x == 16) {
	postElement.innerHTML = `
		<img src="src/images/deer/017.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Practicing for an interview? Don't forget to make eye contact!
		</div>
	`;	
	}
	else if(x == 17) {
	postElement.innerHTML = `
		<img src="src/images/deer/018.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Looking sharp! Don't forget to polish up your resume!
		</div>
	`;	
	}
	else if(x == 18) {
	postElement.innerHTML = `
		<img src="src/images/deer/019.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Setting up an interview? Confidence is everything!
		</div>
	`;	
	}
	else if(x == 19) {
	postElement.innerHTML = `
		<img src="src/images/deer/004.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Remote is the new black. Work from home!
		</div>
	`;	
	}
	else if(x == 20) {
	postElement.innerHTML = `
		<img src="src/images/deer/021.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		</div>
	`;	
	}
	else if(x == 21) {
	postElement.innerHTML = `
		<img src="src/images/deer/022.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thanks for using The Career Deer! You're the coolest!
		</div>
	`;	
	}
	else if(x == 22) {
	postElement.innerHTML = `
		<img src="src/images/deer/023.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thank you for using The Career Deer!
		</div>
	`;	
	}
	else if(x == 23) {
	postElement.innerHTML = `
		<img src="src/images/deer/024.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Feeling overwhelmed? Try narrowing your search down to jobs which require skills you are most confident in!
		</div>
	`;	
	}
	else if(x == 24) {
	postElement.innerHTML = `
		<img src="src/images/deer/025.gif" style="width: 554px; height: auto; border-radius: 4px;"/>
		<br><br>
		<div class="text" style="margin-top: -6px; margin-bottom: -6px;">Thank you for using The Career Deer!
		</div>
	`;	
	}
	container.appendChild(postElement);
};

}

catch { };

