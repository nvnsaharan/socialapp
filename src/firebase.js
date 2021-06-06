import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyCNsLCLHlrEnQKnoH7XPfSXJOo97GPX0vk',
	authDomain: 'social-8be03.firebaseapp.com',
	projectId: 'social-8be03',
	storageBucket: 'social-8be03.appspot.com',
	messagingSenderId: '1013277985516',
	appId: '1:1013277985516:web:16fb33a265cdd1c89573c9',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
