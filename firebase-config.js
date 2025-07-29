// firebase-config.js





// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDG1HDiAHG5TB3vqDed_MVTN8xxny1q7QE",
    authDomain: "menumanage-4ea99.firebaseapp.com",
    databaseURL: "https://menumanage-4ea99-default-rtdb.firebaseio.com",
    projectId: "menumanage-4ea99",
    storageBucket: "menumanage-4ea99.appspot.com",
    messagingSenderId: "1089709348043",
    appId: "1:1089709348043:web:c9be5fd07223216198f74e",
    measurementId: "G-PMKF7PWGCZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);











