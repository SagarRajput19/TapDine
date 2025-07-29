import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const restaurantName = document.getElementById("restaurantName").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store user data in Firestore
        await setDoc(doc(db, "restaurants", user.uid), {
            restaurantName,
            address,
            email,
            uid: user.uid
        });

        // Inform user and redirect to login page
         // Redirect to login page after signup

    } catch (error) {
        // Enhanced error handling to log the exact error step
        console.error("Error during signup process:", error);

        if (error.code === 'auth/email-already-in-use') {
            alert("This email is already in use. Please try with a different email.");
        } else if (error.code === 'auth/invalid-email') {
            alert("The email address is not valid. Please check the email format.");
        } else if (error.code === 'auth/weak-password') {
            alert("The password is too weak. Please provide a stronger password.");
        } 
        else {
            // Custom Alert Message
            const alertMessage = document.getElementById("alertMessage");
            const customAlert = document.getElementById("customAlert");
        
            alertMessage.textContent = "Account created successfully! Please verify your email.";
            customAlert.style.display = "block";
        
            // Close the alert after a few seconds and redirect
            setTimeout(() => {
                customAlert.style.display = "none";
                window.location.href = "login.html"; 
            }, 3000);  // alert will be visible for 3 seconds
        }
        
        function closeAlert() {
            document.getElementById("customAlert").style.display = "none";
        }
        
    }
});
