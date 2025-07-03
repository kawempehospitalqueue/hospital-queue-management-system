document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const invalidationMessage = document.querySelector(".invalidation-message");

  form.addEventListener("submit", function (event) {
    let isValid = true;

    // Clear previous styles
    emailInput.style = "border: 1px #dddddd solid";
    passwordInput.style = "border: 1px #dddddd solid";

    let errorMessage = `Failed to submit!\n`;

    // Clear previous messages
    invalidationMessage.textContent = "";

    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      !emailInput.value.trim() ||
      !emailInput.value.trim().match(emailPattern)
    ) {
      isValid = false;
      errorMessage += "A valid email address is required.\n";
      emailInput.style = "border: 1px #ef1515 solid";
    }

    if (!passwordInput.value.trim()) {
      isValid = false;
      errorMessage += "Please enter your password.\n";
      passwordInput.style = "border: 1px #ef1515 solid";
    }

  // If validation fails, prevent form submission and show the error message
    if (!isValid) {
      event.preventDefault();
      invalidationMessage.innerHTML = `<i class="bi bi-exclamation-circle"></i> 
      <p>${errorMessage}</p>`;
      invalidationMessage.style =
        "background-color: #ffeeee;  padding: 10px;";
    }
  });
});
