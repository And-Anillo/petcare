
// Get form and input fields from the DOM
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Handle form submission
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page reload
  login(); // Call login function
});

// Function to log in the user
async function login() {
    try {
    // Fetch user by email from JSON-Server
    const response = await fetch(`http://localhost:3000/users?email=${loginEmail.value}`);
    const data = await response.json();

    // Check if user exists
    if (data.length === 0) {
        alert("Incorrect email.");
        return;
    }

    const user = data[0]; // Assuming unique email per user

    // Check password
    if (user.password === loginPassword.value) {
      // Store user session in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Login successful!");

      // Redirect to dashboard or home page
        window.location.href = "../views/dashboard.html";
    } else {
        alert("Incorrect password.");
    }
    } catch (error) {
    alert("Error while logging in.");
    console.error(error.message);
    }
}
