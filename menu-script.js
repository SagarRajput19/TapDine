import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Get restaurant ID from URL
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("restaurant");

// Selectors
const foodListContainer = document.getElementById("foodList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

// Store food items globally for filtering
let foodItems = [];

// Fetch food items for this restaurant
async function loadFoodItems() {
    if (!restaurantId) {
        document.body.innerHTML = "<h2>Invalid QR Code</h2>";
        return;
    }

    let foodQuery = query(collection(db, "foods"), where("userId", "==", restaurantId));

    try {
        const snapshot = await getDocs(foodQuery);
        foodItems = []; // Reset array
        snapshot.forEach(doc => {
            const data = doc.data();
            foodItems.push({ id: doc.id, ...data });
        });

        displayFoodItems(foodItems);
    } catch (error) {
        alert("Error fetching food items: " + error.message);
    }
}

// Function to display filtered food items
function displayFoodItems(filteredItems) {
    foodListContainer.innerHTML = ""; // Clear previous items

    if (filteredItems.length === 0) {
        foodListContainer.innerHTML = "<p>No food items found.</p>";
        return;
    }

    filteredItems.forEach(data => {
        let foodItem = document.createElement("div");
        foodItem.classList.add("food-item");
        foodItem.innerHTML = `
            <img src="${data.imageUrl}" width="100" height="100">
            <div class="info">
           <div class="name-price"> 
            <p><strong>${data.foodName}</strong></p>
            <p class="price">₹${data.price}</p>
           </div>
            <p class ="dis">${data.description}</p>          
            </div>            
            
        `;
        foodListContainer.appendChild(foodItem);
    });
}

// Search & Filter Logic
function filterFoodItems() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    let filteredItems = foodItems.filter(item => {
        const matchesSearch = item.foodName.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayFoodItems(filteredItems);
}

// Attach event listeners
searchInput.addEventListener("input", filterFoodItems);
filterCategory.addEventListener("change", filterFoodItems);

// Load food items on page load
loadFoodItems();
