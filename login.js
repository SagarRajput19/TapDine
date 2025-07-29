// import { auth } from "./firebase-config.js";
// import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// document.getElementById("loginForm").addEventListener("submit", async function(e) {
//     e.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     try {
//         // Attempt to sign in with email and password
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Check if the email is verified
//         if (!user.emailVerified) {
//             // If the email is not verified, show an alert and return
//             alert("Please verify your email before logging in.");
//             return;
//         }

//         // Proceed with login if email is verified
//         alert("Login successful!");
//         window.location.href = "admin.html"; // Redirect to the admin page after successful login
//     } catch (error) {
//         // Display the error message if login fails
//         alert("Error: " + error.message);
//     }
// });

// // Example logout function to clear local storage and cookies
// function logout() {
//     // Remove auth token from localStorage
//     localStorage.removeItem('authToken');

//     // Remove cookies if any
//     document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

//     // Redirect to login page or refresh the page
//     window.location.href = 'login.html'; // Adjust path as needed
// }

// // Attach event listener to the logout button
// document.getElementById('logoutButton').addEventListener('click', logout);



import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            alert("Please verify your email before logging in.");
            return;
        }

        alert("Login successful!");
        window.location.href = "admin.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Handle forgot password
document.getElementById("forgotPassword").addEventListener("click", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    
    if (!email) {
        alert("Please enter your email to reset your password.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Optional logout setup
function logout() {
    localStorage.removeItem("authToken");
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutButton");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}
