// API endpoint for users
const apiUrl = "http://localhost:3000/users";

// DOM elements for form and inputs
const nameComplete = document.getElementById("register-name");
const formRegister = document.getElementById("register-form");
const registerUser = document.getElementById("register-username");
const registerEmail = document.getElementById("register-email");
const registerPhone = document.getElementById("register-phone");
const registerPassword = document.getElementById("register-password");

// Handle registration form submission
formRegister.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload
  createAccount();        // Call the function to handle registration
});

// Function to register a new user
async function createAccount() {
  // Check for empty fields (including full name)
if (
    nameComplete.value === "" ||
    registerUser.value === "" ||
    registerEmail.value === "" ||
    registerPhone.value === "" ||
    registerPassword.value === ""
) {
    alert("Please complete all fields.");
    return;
}

const newUserValue = registerUser.value.trim();
const newEmailValue = registerEmail.value.trim();

    try {
    // Step 1: Fetch existing users to check for duplicates
    const responseCheck = await fetch(apiUrl);
    if (!responseCheck.ok) {
    alert("Error checking existing users. Please try again later.");
    return;
    }

    const existingUsers = await responseCheck.json();

    // Step 2: Validate if username or email is already in use
    const userExists = existingUsers.some(user => user.user === newUserValue);
    const emailExists = existingUsers.some(user => user.email === newEmailValue);

    if (userExists) {
    alert("Username already exists. Please choose another.");
    return;
    }

    if (emailExists) {
    alert("Email is already registered.");
    return;
    }

    // Step 3: Create the new user object
    const newUser = {
    nameComplete: nameComplete.value.trim(),
    user: newUserValue,
    email: newEmailValue,
    phone: registerPhone.value.trim(),
    password: registerPassword.value.trim()
    };

    // Step 4: Send POST request to save new user
    const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
    });

    if (!response.ok) {
    alert("Something went wrong. Please try again later.");
    return;
    }

    // Step 5: Success — redirect to login
    alert("Registered successfully!");
    window.location.href = "/src/views/login.html";
} catch (error) {
    alert("Registration failed. Please check your connection or try again.");
    console.error("createAccount error:", error.message);
}
}
