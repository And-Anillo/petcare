// Safely select navigation buttons from the DOM
const btnGoToLogin = document.getElementById("go-to-login");
const btnGoToRegister = document.getElementById("go-to-register");
const ctaLogin = document.getElementById("cta-login");
const ctaRegister = document.getElementById("cta-register");

// Define the paths to the login and register pages
const loginPage = "/src/views/login.html";
const registerPage = "/src/views/register.html";

// If "Go to Login" button exists, add click event
if (btnGoToLogin) {
btnGoToLogin.addEventListener("click", () => {
    window.location.href = loginPage;
});
}

// If "Go to Register" button exists, add click event
if (btnGoToRegister) {
btnGoToRegister.addEventListener("click", () => {
    window.location.href = registerPage;
});
}

// If CTA "Already have an account" exists, add click event
if (ctaLogin) {
ctaLogin.addEventListener("click", () => {
    window.location.href = loginPage;
});
}

// If CTA "I want to register" exists, add click event
if (ctaRegister) {
ctaRegister.addEventListener("click", () => {
    window.location.href = registerPage;
});
}
