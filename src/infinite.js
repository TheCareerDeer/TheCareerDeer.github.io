const container = document.getElementById('container');			// Get page container for posts
const loading = document.getElementById('loading-animation');	// Get post loading animation object
var count = 0;	// Count used for referencing each post as it is generated on the client's screen

// Load four posts on page load
if (count == 0) {
	showLoading();
};

// Load additional posts as the user scrolls down
window.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	
	if(clientHeight + scrollTop >= scrollHeight - 20) {
		showLoading();
	}
});

// Show the loading animation, get a post, and append it
function showLoading() {
	loading.classList.add('show');	// Make loading animation object visible
	setTimeout(getPost, 850);		// Load a post after loading animation ends (850ms)
};

// Get a post using a random integer to select post type
async function getPost() {
	// Remotive job post
	const postResponse = await fetch(`https://remotive.io/api/remote-jobs`);
	const postData = await postResponse.json();
	
	for(let i = 0; i < 10; i++) {
		var x = getRandomInt(0,16);
		
		if(x < 14) {
			
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
function savePost(i) {
	selectedPost = document.getElementById("save-button-" + i);
	selectedPost.style.background = "url('https://thecareerdeer.com/src/images/save-checked.png')";
	selectedPost.style.backgroundSize = "65px 65px";
};

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
			if(line.substring(i,i+2) != 'or' && line.substring(i,i+3) != 'the' && line.substring(i,i+3) != 'and')
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
	selectedDesc = document.getElementById("show-desc-" + i);
	
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

// Pause for requested number of ms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Set description to sleep upon request
async function sleeping(i) {
	selectedDesc = document.getElementById("show-desc-" + i);
  await sleep(750);
		selectedDesc.style.display = "none";
		document.getElementById("blockpost-" + i).style.minHeight = "0px";
		document.getElementById("blockpost-" + i).style.maxHeight = "332px";
		document.getElementById("show-button-" + i).value = "SHOW DESCRIPTION";
};

// Obtain Remotive post
function postRemotive(data) {
	
	// Get job title
	var jobTitle = getFixedString(data.post.title);
	
	
	// Get job category and fix
	if(data.post.category == 'All others')
		data.post.category = 'Other';
	
	
	// Get post information line and fix
	var information = "";
	
	if(data.post.job_type == 'full_time')
		information = "&nbsp; •&nbsp; Full-Time";
	else if(data.post.job_type == 'part_time')
		information = "&nbsp; •&nbsp; Part-Time";
	else if(data.post.job_type == 'contract')
		information = "&nbsp; •&nbsp; Contract Position";
	
	
	// Get job location and fix
	var jobLocation = getFixedString(data.post.candidate_required_location);
	
	if(jobLocation != "")
		information = information + "&nbsp; •&nbsp; " + jobLocation;
	
	
	// Get job salary
	if(data.post.salary != "")
		information = information + "&nbsp; •&nbsp; " + data.post.salary;
	
	
	// Get job description and fix
	var jobDescription = data.post.description.substring(0, data.post.description.length - 86);
	var jobDescription = jobDescription.replace(/<img[^>]*>/g,"");
	
	
	// Get job posting date and fix
	var dateIn = data.post.publication_date;
	var dateOut = getDate(dateIn);
	
	
	// Remotive post template
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.setAttribute("id", ("blockpost-" + count));
	postElement.innerHTML = `
		<div class="user-info">
		<a href="${data.post.url}">
			<img style="display: inline-block; float: left; -webkit-box-shadow: 0px 3px 14px 5px rgba(0,0,0,0.025); box-shadow: 0px 3px 13px 5px rgba(0,0,0,0.035);" src="${data.post.company_logo}" alt="${data.post.company_name}" />
			<div style="float: left; display: inline-block; margin-left: 10px; margin-top: 10px; font-size: 16px; color: #333; font-weight: bold;">${data.post.company_name}</div>
			</a>
			<input type="button" style="display: inline-block; float: right; height: 65px; width: 65px; margin-top: -12px; margin-right: -24px; border: none; background: url('https://thecareerdeer.com/src/images/save-unchecked.png'); background-size: 65px 65px;" onclick="savePost(` + count + `)" id="save-button-` + count + `" />
		</div>
		<h2 class="title" style="margin-top: -2px; margin-left: 8px; display: flex;"><a style="margin-top: -8px" href="${data.post.url}">` + jobTitle + `</a></h2>
		<p class="text" style="margin-top: 8px; font-size: 13px; margin-left: 10px;">in <a style="font-size: 14px; font-weight: bold; cursor: pointer; color: #904B41;">${data.post.category}</a></p>
		<p class="text" style="margin-top: -12px; font-size: 15px; margin-left: 10px; margin-bottom: 16px;">Remote` + information + `</p>
		
		<div id="show-desc-` + count + `" style="display: none; transition: opacity .75s; opacity: 0.0; padding: 0px 0px 0px 10px; margin-right: 40px; font-size: 14px;">` + jobDescription + `<br></div>
		<a><input type="button" id="show-button-` + count + `"style="border: none; margin: auto; margin-left: 10px; margin-bottom: 16px; cursor: pointer; padding: 8px 8px 8px 8px; height: 100%; width: 140px; color: #fff; border-radius: 4px; font-size: 11px; font-weight: bold; vertical-align: middle; text-align: center; align: center; background: none; color: #fff; font: Tahoma; outline: inherit; background-color: #c49700;" value="SHOW DESCRIPTION" onclick="changeDescVisibility(` + count + `)" /></a>
		<a href="${data.post.url}">
			<img src="https://thecareerdeer.com/src/images/icon-link.png" style="width: 24px; height: 24px; position: relative; top: 2px; margin: -5px 0px 0px 8px;" />
		</a>
		<div class="user-info">
			<div style="float: left; display: inline-block; margin-top: 7px; font-size: 14px; margin-left: 12px;">` + "&nbsp;" + dateOut + `</div>
			<div style="float: right; display: inline-block; margin-top: 6px; margin-right: -20px;"><a href="https://remotive.io/">Provided by Remotive</a></div>
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