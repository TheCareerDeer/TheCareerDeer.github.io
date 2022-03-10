const container = document.getElementById('container');
const loading = document.getElementsByName('loading');
var count = 0;

getPost();
getPost();
getPost();
getPost();
getPost();

window.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	
	if(clientHeight + scrollTop >= scrollHeight - 20) {
		// show the loading animation
		showLoading();
	}
});

function showLoading() {
	//loading.classList.add('show');
	
	// load more data
	setTimeout(getPost, 0)
}

async function getPost() {
	var x = getRandomInt(0,15)
	if(x < 13) {
		const postResponse = await fetch(`https://remotive.io/api/remote-jobs`);
		const postData = await postResponse.json();
		
		const userResponse = await fetch('https://randomuser.me/api');
		const userData = await userResponse.json();
		
		const data = { post: postData.jobs[count], user: userData.results[0] };
		
		addDataToDOM(data);
		count++;
	}
	else if(x == 13) {
		getInspo();
	}
	else {
		// printAd();
		getPost();
	}
}

function getInspo() {
	var x = getRandomInt(0,2);
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	
	if(x == 0) {
	postElement.innerHTML = `
		<h2 class="title">You've Got This</h2><br>
		<img src="src/images/deer/001.jpg" style="max-width: 100%; border-radius: 4px;"/>
		<br><br>
		<div class="user-info">73% of global employers are struggling to find candidates who meet their standards.
		</div>
	`;
	}
	else {
	postElement.innerHTML = `
		<h2 class="title">Don't Give Up Yet</h2><br>
		<img src="src/images/deer/002.jpg" style="max-width: 100%; border-radius: 4px;"/>
		<br><br>
		<div class="user-info">The average job search in the United States takes five months. You're on the right track, baby!
		</div>
	`;	
	}
	container.appendChild(postElement);
}

function printAd() {
	var x = getRandomInt(0,2);
	console.log(x);
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	
	// Google AdSense please place ad here
	postElement.innerHTML = `
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5871217598891203"
     crossorigin="anonymous"></script>
	`;
	
	container.appendChild(postElement);
}

function getRandomNr() {
	return Math.floor(Math.random() * 100) + 1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function savePost(i) {
	console.log(i);
	selectedPost = document.getElementById("save-button-" + i);
	selectedPost.style.background = "url('https://thecareerdeer.com/src/images/save-checked.png')";
	selectedPost.style.backgroundSize = "52px 52px";
}

function getDate(dateIn) {
	var dateOut = "";
	
	if(dateIn.charAt(5) === '0') {
		if(dateIn.charAt(6) == '1')
			dateOut = "January ";
		else if(dateIn.charAt(6) == '2')
			dateOut = "February ";
		else if(dateIn.charAt(6) === '3') {
			dateOut = "March ";
			console.log("hey");
		}
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
	
	if(dateIn.charAt(8) == '0') {
		dateOut = dateOut + (dateIn.charAt(9));
	}
	else {
		dateOut = dateOut + (dateIn.charAt(8) + dateIn.charAt(9));
	}
	
	dateOut = dateOut + ", " + dateIn.charAt(0) + dateIn.charAt(1) + dateIn.charAt(2) + dateIn.charAt(3);
	
	return dateOut;
}

function addDataToDOM(data) {
	// Remotive data
	var information = "";
	
	if(data.post.job_type == 'full_time')
		information = "&nbsp; •&nbsp; Full-Time";
	else if(data.post.job_type == 'part_time')
		information = "&nbsp; •&nbsp; Part-Time";
	else if(data.post.job_type == 'contract')
		information = "&nbsp; •&nbsp; Contract Position";
	
	if(data.post.candidate_required_location != "")
		information = information + "&nbsp; •&nbsp; " + data.post.candidate_required_location;
	
	if(data.post.salary != "")
		information = information + "&nbsp; •&nbsp; " + data.post.salary;
	
	
	if(data.post.category == 'All others')
		data.post.category = 'Other';
	
	var dateIn = data.post.publication_date;
	var dateOut = getDate(dateIn);
	
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.innerHTML = `
		<div class="user-info">
		<a href="${data.post.url}">
			<img style="display: inline-block; float: left; -webkit-box-shadow: 0px 3px 14px 5px rgba(0,0,0,0.025); box-shadow: 0px 3px 13px 5px rgba(0,0,0,0.035);" src="${data.post.company_logo}" alt="${data.post.company_name}" />
			<div style="float: left; display: inline-block; margin-left: 10px; margin-top: 6px; font-size: 14px; color: #333; font-weight: bold;">${data.post.company_name}</div>
			</a>
			<input type="button" style="display: inline-block; float: right; height: 52px; width: 52px; margin-top: -5px; margin-right: -13px; border: none; background: url('https://thecareerdeer.com/src/images/save-unchecked.png'); background-size: 52px 52px;" onclick="savePost(` + count + `)" id="save-button-` + count + `" />
		</div>
		<h2 class="title" style="margin-top: -10px; margin-left: 6px; display: flex;"><a style="margin-top: -10px" href="${data.post.url}">${data.post.title}<img src="https://thecareerdeer.com/src/images/icon-link.png" style="width: 24px; height: 24px; position: relative; top: 2px; margin: 2px 0px 0px 10px;" /></a></h2>
		<p class="text" style="margin-top: 5px; font-size: 14px; margin-left: 8px;">in <a style="font-size: 15px; cursor: pointer;">${data.post.category} Jobs</a></p>
		<p class="text" style="margin-top: 7px; font-size: 15px; margin-left: 8px;">Remote` + information + `</p>
		<div class="user-info">
			<div style="float: left; display: inline-block; margin-top: 5px; font-size: 14px; margin-left: 3px;">` + dateOut + `</div>
			<div style="float: right; display: inline-block; margin-top: 6px;"><a href="https://remotive.io/">Provided by Remotive</a></div>
		</div>
		
	`;
	container.appendChild(postElement);
	
	//loading.classList.remove('show');
}