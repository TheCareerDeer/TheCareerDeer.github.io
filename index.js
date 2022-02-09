const container = document.getElementById('container');
const loading = document.getElementsByName('loading');

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
	if(x < 12) {
		const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${getRandomNr()}`);
		const postData = await postResponse.json();
		
		const userResponse = await fetch('https://randomuser.me/api');
		const userData = await userResponse.json();
		
		const data = { post: postData, user: userData.results[0] };
		
		addDataToDOM(data);
	}
	else if(x == 12) {
		getInspo();
	}
	else {
		printAd();
	}
}

function getInspo() {
	var x = getRandomInt(0,2);
	console.log(x);
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	
	if(x == 0) {
	postElement.innerHTML = `
		<h2 class="title">You've Got This</h2><br>
		<img src="images/deer/001.jpg" style="max-width: 100%; border-radius: 4px;"/>
		<br><br>
		<div class="user-info">73% of global employers are struggling to find candidates who meet their standards.
		</div>
	`;
	}
	else {
	postElement.innerHTML = `
		<h2 class="title">Don't Give Up Yet</h2><br>
		<img src="images/deer/002.jpg" style="max-width: 100%; border-radius: 4px;"/>
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
	
	// Google AdSense place ad here
	postElement.innerHTML = ``;
	
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
	const postElement = document.createElement('div');
	postElement.classList.add('block-post');
	postElement.innerHTML = `
		<h2 class="title">${data.post.title}</h2>
		<p class="text">${data.post.body}</p>
		<div class="user-info">
			<img src="${data.user.picture.large}" alt="${data.user.name.first}" />
			<span>${data.user.name.first} ${data.user.name.last}</span>
		</div>
	`;
	container.appendChild(postElement);
	
	//loading.classList.remove('show');
}