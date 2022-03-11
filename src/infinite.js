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
	if(x < 14) {
		const postResponse = await fetch(`https://remotive.io/api/remote-jobs`);
		const postData = await postResponse.json();
		
		const userResponse = await fetch('https://randomuser.me/api');
		const userData = await userResponse.json();
		
		const data = { post: postData.jobs[count], user: userData.results[0] };
		
		addDataToDOM(data);
		count++;
	}
	else if(x == 14) {
		getInspo();
	}
}

function getInspo() {
	var x = getRandomInt(0,2);
	const postElement = document.createElement('div');
	postElement.classList.add('block-deer');
	
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
	selectedPost = document.getElementById("save-button-" + i);
	selectedPost.style.background = "url('https://thecareerdeer.com/src/images/save-checked.png')";
	selectedPost.style.backgroundSize = "65px 65px";
}

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
	
	if(dateIn.charAt(8) == '0') {
		dateOut = dateOut + (dateIn.charAt(9));
	}
	else {
		dateOut = dateOut + (dateIn.charAt(8) + dateIn.charAt(9));
	}
	
	dateOut = dateOut + ", " + dateIn.charAt(0) + dateIn.charAt(1) + dateIn.charAt(2) + dateIn.charAt(3);
	
	return dateOut;
}

function getFixedString(line) {
	
	var fixed = "";
	var isAfterSpace = false;
	
	for(let i = 0; i < line.length - 1; i++) {
		if(i == 0) {
			fixed = line.charAt(0).toUpperCase() + line.substring(1, line.length);
		}
		else if(line != "" && isAfterSpace) {
			if(line.substring(i,i+2) != 'or' && line.substring(i,i+3) != 'the' && line.substring(i,i+3) != 'and') {
				fixed = fixed.substring(0,i) +  line.charAt(i).toUpperCase() + line.substring(i+1, line.length);
			}
			isAfterSpace = false;
		}
		
		if(line != "" && line.charAt(i) == ' ' || line.charAt(i) == '-' || line.charAt(i) == '(') {
			isAfterSpace = true;
		}
	}
	
	return fixed;
}

function showDescription(i) {
	selectedDesc = document.getElementById("show-desc-" + i);
	
	if(document.getElementById("show-button-" + i).value == "SHOW DESCRIPTION") {
		selectedDesc.style.width = "100%";
		selectedDesc.style.height = "100%";
		selectedDesc.style.display = "block";
		document.getElementById("show-button-" + i).value = "HIDE DESCRIPTION";
		document.getElementById("blockpost-" + i).style.maxHeight = "4000px";
		selectedDesc.offsetHeight;
		selectedDesc.style.opacity = "1.0";
	}
	else {
		document.getElementById("blockpost-" + i).offsetHeight;
		document.getElementById("blockpost-" + i).style.maxHeight = "332px";
		selectedDesc.style.opacity = "0.0";
		selectedDesc.style.width = "0px";
		selectedDesc.style.height = "0px";
		document.getElementById("show-button-" + i).value = "SHOW DESCRIPTION";
		selectedDesc.style.display = "none";
	}
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
	
	var jobLocation = getFixedString(data.post.candidate_required_location);
	
	if(jobLocation != "")
		information = information + "&nbsp; •&nbsp; " + jobLocation;
	
	if(data.post.salary != "")
		information = information + "&nbsp; •&nbsp; " + data.post.salary;
	
	
	if(data.post.category == 'All others')
		data.post.category = 'Other';
	
	var jobTitle = getFixedString(data.post.title);
	
	var jobDescription = data.post.description.substring(0, data.post.description.length - 86);
	//jobDescription = jobDescription.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/, " ");
	
	
	//for(let i = 0; i < jobDescription.length - 1; i++) {
	//	if(jobDescription.charAt(i) === '0' && jobDescription.charAt(i+1) === '0') {
	//		console.log(jobDescription.substring(i-2, i + 4));
	//		jobDescription = jobDescription.substring(0, i-2) + jobDescription.substring(i+4, jobDescription.length);
	//	}
	//}
	
	
	var dateIn = data.post.publication_date;
	var dateOut = getDate(dateIn);
	
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.setAttribute("id", ("blockpost-" + count));
	postElement.innerHTML = `
		<div class="user-info">
		<a href="${data.post.url}">
			<img style="display: inline-block; float: left; -webkit-box-shadow: 0px 3px 14px 5px rgba(0,0,0,0.025); box-shadow: 0px 3px 13px 5px rgba(0,0,0,0.035);" src="${data.post.company_logo}" alt="${data.post.company_name}" />
			<div style="float: left; display: inline-block; margin-left: 10px; margin-top: 7px; font-size: 16px; color: #333; font-weight: bold;">${data.post.company_name}</div>
			</a>
			<input type="button" style="display: inline-block; float: right; height: 65px; width: 65px; margin-top: -16px; margin-right: -24px; border: none; background: url('https://thecareerdeer.com/src/images/save-unchecked.png'); background-size: 65px 65px;" onclick="savePost(` + count + `)" id="save-button-` + count + `" />
		</div>
		<h2 class="title" style="margin-top: -2px; margin-left: 8px; display: flex;"><a style="margin-top: -8px" href="${data.post.url}">` + jobTitle + `<img src="https://thecareerdeer.com/src/images/icon-link.png" style="width: 24px; height: 24px; position: relative; top: 2px; margin: 2px 0px 0px 6px;" /></a></h2>
		<p class="text" style="margin-top: 8px; font-size: 13px; margin-left: 10px;">in <a style="font-size: 14px; font-weight: bold; cursor: pointer; color: #904B41;">${data.post.category} Jobs</a></p>
		<p class="text" style="margin-top: -12px; font-size: 15px; margin-left: 10px;">Remote` + information + `</p>
		
		<div id="show-desc-` + count + `" style="height: 0px; display: none; transition: opacity 7s; opacity: 0.0; width: 0px; padding: 0px 0px 0px 10px; margin-right: 40px; font-size: 14px;">` + jobDescription + `<br></div>
		<a><input type="button" id="show-button-` + count + `"style="border: none; margin: auto; margin-left: 10px; margin-bottom: 16px; cursor: pointer; padding: 8px 8px 8px 8px; height: 100%; width: 140px; color: #fff; border-radius: 4px; font-size: 11px; font-weight: bold; vertical-align: middle; text-align: center; align: center; background: none; color: #fff; font: Tahoma; outline: inherit; background-color: #c49700;" value="SHOW DESCRIPTION" onclick="showDescription(` + count + `)" /></a>
		
		<div class="user-info">
			<div style="float: left; display: inline-block; margin-top: 7px; font-size: 14px; margin-left: 3px;">` + dateOut + `</div>
			<div style="float: right; display: inline-block; margin-top: 8px; margin-right: -20px;"><a href="https://remotive.io/">Provided by Remotive</a></div>
		</div>
		
	`;
	
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
	
	
	container.appendChild(postElement);
	
	//loading.classList.remove('show');
}