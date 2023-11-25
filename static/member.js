let//
signupDiv = document.querySelector(".title-signup"),
loginDiv = document.querySelector(".title-login");

signupDiv.addEventListener("click", () => {
    let//
    signupForm = document.querySelector(".signup"),
    loginForm = document.querySelector(".login");

    signupForm.style.display = "flex";
    loginForm.style.display = "none";
});

loginDiv.addEventListener("click", () => {
    let//
    signupForm = document.querySelector(".signup"),
    loginForm = document.querySelector(".login"),
    loginBtn = document.querySelector(".login-btn");

    signupForm.style.display = "none";
    loginBtn.style.backgroundColor = "rgba(83,186,190,0.5)";
    loginForm.style.display = "flex";
});