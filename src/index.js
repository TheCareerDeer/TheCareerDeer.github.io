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
	  updateNavbar();
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


function updateNavbar() {
	try {
		const navBar 
	} catch { }
	
	updateButtonAbout();
}

function updateButtonAbout() {
	try {
		document.getElementById("button-about").style.opacity = 0.5;
	} catch { }
}