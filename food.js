import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { collection, getDocs, query, where, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            loadFoodItems(); // Load food items when user logs in
        } else {
            window.location.href = "login.html"; // Redirect to login if not authenticated
        }
    });

    document.getElementById("searchInput").addEventListener("input", function () {
        searchFood(this.value.trim().toLowerCase());
    });
});

// 🍽️ Load Food Items (Ensuring Each Item is in Its Category)
async function loadFoodItems(categoryFilter = "all") {
    const user = auth.currentUser;
    if (!user) return;

    let foodQuery = collection(db, "foods");
    if (categoryFilter !== "all") {
        foodQuery = query(foodQuery, where("category", "==", categoryFilter));
    }

    try {
        const snapshot = await getDocs(foodQuery);
        let categorizedFood = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === user.uid) {
                if (!categorizedFood[data.category]) {
                    categorizedFood[data.category] = [];
                }
                categorizedFood[data.category].push({ id: doc.id, ...data });
            }
        });

        displayFoodItems(categorizedFood);
    } catch (error) {
        alert("Error fetching food items: " + error.message);
    }
}

// 🎯 Display Food Items in UI (With Price & Description)
function displayFoodItems(categorizedFood) {
    let foodListContainer = document.getElementById("foodList");
    foodListContainer.innerHTML = ""; // Clear previous content

    if (Object.keys(categorizedFood).length === 0) {
        foodListContainer.innerHTML = "<p>No food items found.</p>";
        return;
    }

    for (const category in categorizedFood) {
        let categorySection = document.createElement("div");
        categorySection.classList.add("category-section");
        
        let categoryTitle = document.createElement("h3");
        categoryTitle.innerText = category;
        categoryTitle.classList.add("category-title");
        categorySection.appendChild(categoryTitle);
        
        
        let itemsContainer = document.createElement("div");
        itemsContainer.classList.add("items-container");

        categorizedFood[category].forEach(data => {
            let foodItem = document.createElement("div");
            foodItem.classList.add("food-item");
            foodItem.innerHTML = `
                <img src="${data.imageUrl}" width="150" height="100">
                <p><strong>${data.foodName}</strong></p>
                <p> Price: ₹ ${data.price}</p>
                <p> ${data.description}</p>
                <button onclick="editFood('${data.id}', '${data.foodName}', '${data.imageUrl}', '${data.category}', '${data.price}', '${data.description}')">✏️ Edit</button>
                <button onclick="deleteFood('${data.id}')">🗑️ Delete</button>
            `;
            itemsContainer.appendChild(foodItem);
        });

        categorySection.appendChild(itemsContainer);
        foodListContainer.appendChild(categorySection);
    }
}

// 🔍 Search Functionality (Including Price & Description)
async function searchFood(searchTerm) {
    const user = auth.currentUser;
    if (!user) return;

    let foodQuery = collection(db, "foods");
    try {
        const snapshot = await getDocs(foodQuery);
        let filteredItems = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === user.uid && data.foodName.toLowerCase().includes(searchTerm)) {
                filteredItems.push({ id: doc.id, ...data });
            }
        });

        displayFoodItems({ searchResults: filteredItems });
    } catch (error) {
        alert("Error searching food: " + error.message);
    }
}

// ✏️ Edit Food Item (Including Price & Description)
window.editFood = function (foodId, foodName, imageUrl, category, price, description) {
    const newFoodName = prompt("Enter new food name:", foodName);
    const newImageUrl = prompt("Enter new image URL:", imageUrl);
    const newCategory = prompt("Enter new category:", category);
    const newPrice = prompt("Enter new price:", price);
    const newDescription = prompt("Enter new description:", description);

    if (newFoodName && newImageUrl && newCategory && newPrice && newDescription) {
        updateDoc(doc(db, "foods", foodId), {
            foodName: newFoodName,
            imageUrl: newImageUrl,
            category: newCategory,
            price: newPrice,
            description: newDescription
        })
        .then(() => {
            alert("Food item updated successfully!");
            loadFoodItems();
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
            loadFoodItems();
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


// Example logout function to clear local storage and cookies
function logout() {
    // Remove auth token from localStorage
    localStorage.removeItem('authToken');

    // Remove cookies if any
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to login page or refresh the page
    window.location.href = 'login.html'; // Adjust path as needed
}

// Attach event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', logout);
