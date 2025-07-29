import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, where, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById("restaurantName").innerText = user.email; // Show user email as name
            loadFoodItems(); // Load food items when user logs in
        } else {
            window.location.href = "login.html"; // Redirect if user is not logged in
        }
    });
});

// 🥗 Add Food Item
document.getElementById("foodForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const foodName = document.getElementById("foodName").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const category = document.getElementById("category").value;
    
    const user = auth.currentUser;
    if (user) {
        try {
            await addDoc(collection(db, "foods"), {
                foodName,
                imageUrl,
                category,
                userId: user.uid
            });

            alert("Food item added successfully!");
            document.getElementById("foodForm").reset(); // Clear form fields
            loadFoodItems(); // Reload food list after adding
        } catch (error) {
            alert("Error adding food: " + error.message);
        }
    }
});

// 🍽️ Load Food Items (With Edit & Delete Options)
async function loadFoodItems(categoryFilter = "all") {
    const user = auth.currentUser;
    if (!user) return;

    let foodQuery = collection(db, "foods");
    if (categoryFilter !== "all") {
        foodQuery = query(foodQuery, where("category", "==", categoryFilter));
    }

    try {
        const snapshot = await getDocs(foodQuery);
        let foodList = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === user.uid) { // Only show food items of logged-in user
                foodList += `
                    <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                        <img src="${data.imageUrl}" width="100" height="100">
                        <p><strong>${data.foodName}</strong> (${data.category})</p>
                        <button onclick="editFood('${doc.id}', '${data.foodName}', '${data.imageUrl}', '${data.category}')">✏️ Edit</button>
                        <button onclick="deleteFood('${doc.id}')">🗑️ Delete</button>
                    </div>
                `;
            }
        });

        document.getElementById("foodList").innerHTML = foodList || "<p>No food items found.</p>";
    } catch (error) {
        alert("Error fetching food items: " + error.message);
    }
}

// ✏️ Edit Food Item
window.editFood = function (foodId, foodName, imageUrl, category) {
    const newFoodName = prompt("Enter new food name:", foodName);
    const newImageUrl = prompt("Enter new image URL:", imageUrl);
    const newCategory = prompt("Enter new category:", category);

    if (newFoodName && newImageUrl && newCategory) {
        updateDoc(doc(db, "foods", foodId), {
            foodName: newFoodName,
            imageUrl: newImageUrl,
            category: newCategory
        })
        .then(() => {
            alert("Food item updated successfully!");
            loadFoodItems(); // Refresh list
        })
        .catch(error => alert("Error updating food: " + error.message));
    }
};

// 🗑️ Delete Food Item
window.deleteFood = function (foodId) {
    if (confirm("Are you sure you want to delete this food item?")) {
        deleteDoc(doc(db, "foods", foodId))
        .then(() => {
            alert("Food item deleted successfully!");
            loadFoodItems(); // Refresh list
        })
        .catch(error => alert("Error deleting food: " + error.message));
    }
};

// 🔍 Filter Food by Category
document.getElementById("filterCategory").addEventListener("change", function () {
    loadFoodItems(this.value);
});

// 🚪 Logout
window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};
