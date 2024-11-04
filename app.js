// Dummy users with credentials
const USERS = [
    { username: "user1", password: "pass1" },
    { username: "user2", password: "pass2" },
    // Add more users here
];
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

// Check if someone is logged in on page load
document.addEventListener("DOMContentLoaded", () => {
    const userType = localStorage.getItem("userType");
    
    if (userType === "user") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("order-section").style.display = "block";
    } else if (userType === "admin") {
        document.getElementById("admin-login-section").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        displayOrders();
    }
});

// Save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// Get orders from localStorage or initialize as empty
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// User login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const user = USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem("userType", "user"); // Mark as user logged in
        localStorage.setItem("username", username); // Save username for tracking
        document.getElementById("login-section").style.display = "none";
        document.getElementById("order-section").style.display = "block";
    } else {
        alert("Invalid username or password!");
    }
}

// Place order
function placeOrder() {
    const tableNumber = document.getElementById("table-number").value;
    const username = localStorage.getItem("username"); // Get current user's username
    
    const order = {
        username,
        tableNumber,
        items: {
            chai: document.getElementById("chai").value,
            cigarette: document.getElementById("cigarette").value,
            andaParatha: document.getElementById("anda-paratha").value,
            alooParatha: document.getElementById("aloo-paratha").value
        },
        time: new Date().toLocaleString(),
        status: "pending"
    };

    orders.push(order); // Add new order to orders list
    saveOrders(orders); // Save to localStorage
    alert("Order placed successfully!");
}

// Admin login
function adminLogin() {
    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem("userType", "admin"); // Mark as admin logged in
        document.getElementById("admin-login-section").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        displayOrders(); // Show orders when admin logs in
    } else {
        alert("Invalid admin credentials!");
    }
}

// Logout function
function logout() {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    location.reload(); // Reload to reset the state
}

// Display orders in admin dashboard
function displayOrders() {
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = ""; // Clear previous orders

    orders = JSON.parse(localStorage.getItem("orders")) || []; // Load latest orders

    orders.forEach((order, index) => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-item");
        orderDiv.innerHTML = `
            <p><strong>User:</strong> ${order.username}</p>
            <p><strong>Table:</strong> ${order.tableNumber}</p>
            <p><strong>Order Time:</strong> ${order.time}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <button onclick="approveOrder(${index})">Approve</button>
            <button onclick="completeOrder(${index})">Complete</button>
        `;
        ordersList.appendChild(orderDiv);
    });
}

// Approve order
function approveOrder(index) {
    orders[index].status = "in process";
    saveOrders(orders); // Update localStorage
    alert(`Order for Table ${orders[index].tableNumber} is now in process.`);
    displayOrders(); // Refresh order list
}

// Complete order
function completeOrder(index) {
    orders[index].status = "completed";
    saveOrders(orders); // Update localStorage
    alert(`Order for Table ${orders[index].tableNumber} is completed.`);
    displayOrders(); // Refresh order list
}



// connect front end to backend
const BASE_URL = "http://localhost:5000"; // Replace with your deployed URL

async function placeOrder() {
    const tableNumber = document.getElementById("table-number").value;
    const username = localStorage.getItem("loggedInUser");
    const order = {
        username,
        tableNumber,
        items: {
            chai: document.getElementById("chai").value,
            cigarette: document.getElementById("cigarette").value,
            andaParatha: document.getElementById("anda-paratha").value,
            alooParatha: document.getElementById("aloo-paratha").value
        },
        time: new Date().toLocaleString(),
        status: "pending"
    };

    // Send the order to the backend
    await fetch(`${BASE_URL}/placeOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });
    alert("Order placed successfully!");
}

async function displayOrders() {
    const response = await fetch(`${BASE_URL}/orders`);
    const orders = await response.json();

    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = ""; // Clear previous orders

    orders.forEach((order) => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-item");
        orderDiv.innerHTML = `
            <p><strong>User:</strong> ${order.username}</p>
            <p><strong>Table:</strong> ${order.tableNumber}</p>
            <p><strong>Order Time:</strong> ${order.time}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <button onclick="updateOrderStatus('${order._id}', 'in process')">Approve</button>
            <button onclick="updateOrderStatus('${order._id}', 'completed')">Complete</button>
        `;
        ordersList.appendChild(orderDiv);
    });
}

async function updateOrderStatus(orderId, status) {
    await fetch(`${BASE_URL}/updateOrder/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    alert(`Order status updated to "${status}".`);
    displayOrders();
}

// Automatically display orders for the admin on page load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("userType") === "admin") {
        displayOrders();
    }
});
