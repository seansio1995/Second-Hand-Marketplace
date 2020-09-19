import Firebase from 'firebase';

let config = {
    apiKey: "Your API Key",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

export const firebaseClient = Firebase.initializeApp(config);