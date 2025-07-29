import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';

// Select the sidebar and food list container
const categoryListContainer = document.getElementById('categoryList');
const foodListContainer = document.getElementById('foodListContainer');
const searchInput = document.getElementById('searchInput');  // Search bar element

// Ensure we are logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in user UID:", user.uid);  // Log the current user UID

        // Fetch and display the food items related to this user
        fetchAndDisplayFood(user.uid);
    } else {
        console.log("No user logged in.");
        categoryListContainer.innerHTML = "<p>Please log in to view food items.</p>";
    }
});

// Fetch and display food items based on the authenticated user's UID
async function fetchAndDisplayFood(userId) {
    const foodQuery = query(collection(db, 'foods'), where('userId', '==', userId));

    try {
        const snapshot = await getDocs(foodQuery);
        const foodItems = snapshot.docs.map(doc => doc.data());

        // Log food items to check if we got the right data
        console.log("Food Items:", foodItems);

        if (foodItems.length === 0) {
            categoryListContainer.innerHTML = "<p>No food items found for this user.</p>";
            return;
        }

        // Sort food items alphabetically by food name (case-insensitive)
        foodItems.sort((a, b) => a.foodName.toLowerCase().localeCompare(b.foodName.toLowerCase()));

        // Group food items by category
        const categories = {};

        foodItems.forEach(item => {
            if (item.foodName && item.category && item.price && item.description) {
                if (categories[item.category]) {
                    categories[item.category].push(item);
                } else {
                    categories[item.category] = [item];
                }
            }
        });

        // Log categories to check the categorization
        console.log("Categories:", categories);

        // Display categories in the sidebar with item count
        Object.keys(categories).forEach(category => {
            const li = document.createElement('li');
            li.classList.add('category-item');  // Add class for styling
            li.innerHTML = `${category} <span class="item-count">${categories[category].length}</span>`;
            li.onclick = () => displayFoodItems(categories[category]);
            categoryListContainer.appendChild(li);
        });

        // Display all food items initially (filtered for the current user)
        displayFoodItems(foodItems);
        
        // Set up search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = foodItems.filter(item => 
                item.foodName.toLowerCase().includes(searchTerm)
            );
            displayFoodItems(filteredItems);
        });

    } catch (error) {
        console.error('Error fetching food items:', error);
    }
}


// // Display food items in the main container
// function displayFoodItems(items) {
//     foodListContainer.innerHTML = ''; // Clear previous food items
//     items.forEach(item => {
//         const foodDiv = document.createElement('div');
//         foodDiv.classList.add('food-item');
//         foodDiv.innerHTML = `
//             <h4>${item.foodName}</h4>
//             <p>Category: ${item.category}</p>
//             <p>Price: ₹${item.price}</p>
//             <p>${item.description}</p>
//         `;
//         foodListContainer.appendChild(foodDiv);
//     });
// }

document.getElementById('userIcon').addEventListener('click', function() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    
    // Toggle dropdown visibility
    if (dropdownMenu.style.display === "none" || dropdownMenu.style.display === "") {
        dropdownMenu.style.display = "block";
    } else {
        dropdownMenu.style.display = "none";
    }
});

// Close the dropdown if clicked outside of it
window.addEventListener('click', function(event) {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (!dropdownMenu.contains(event.target) && !document.getElementById('userIcon').contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});
