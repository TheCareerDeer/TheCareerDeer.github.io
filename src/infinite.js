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

function addDataToDOM(data) {
	if(data.post.category == 'All others')
		data.post.category = 'Other';
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.innerHTML = `
		<div class="user-info">
			<img style="display: inline-block; float: left; -webkit-box-shadow: 0px 3px 14px 5px rgba(0,0,0,0.025); box-shadow: 0px 3px 14px 5px rgba(0,0,0,0.025);" src="${data.post.company_logo}" alt="${data.post.company_name}" />
			<div style="float: left; display: inline-block; margin-left: 10px; margin-top: 5px; font-size: 14px;">${data.post.company_name}</div>
			<img style="display: inline-block; float: right; height: 45px; width: 45px; margin-top: -2px; margin-right: -10px;" src="https://thecareerdeer.com/src/images/save-unchecked.png" />
		</div>
		<h2 class="title" style="margin-top: -10px"><a href="${data.post.url}">${data.post.title}</a></h2>
		<p class="text" style="margin-top: 5px; font-size: 14px;">in ${data.post.category} (Remote)</p>
		<div class="user-info">
			<div style="float: right; display: inline-block; margin-top: 3px;"><a href="https://remotive.io/">Provided by Remotive</a></div>
		</div>
		
	`;
	container.appendChild(postElement);
	
	//loading.classList.remove('show');
}