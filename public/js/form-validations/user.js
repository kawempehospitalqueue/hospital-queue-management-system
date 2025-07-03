document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = {
    userName: document.getElementById("userName"),
    email: document.getElementById("email"),
    phoneNumber: document.getElementById("phoneNumber"),
    role: document.getElementById("role"),
    room: document.getElementById("room"),
    profileImage: document.getElementById("profileImage"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
  };
  const invalidationMessage = document.querySelector(".invalidation-message");
  const profileImagePreview = document.getElementById("profileImagePreview");
  
  function validateForm() {
    let isValid = true;
    let errorMessage = "Failed to submit!\n";
    invalidationMessage.textContent = "";
    
    // Reset styles
    Object.values(inputs).forEach(input => input.style.border = "1px #dddddd solid");

    if (!inputs.userName.value.trim()) {
      isValid = false;
      errorMessage += "Full name is required.\n";
      inputs.userName.style.border = "1px #ef1515 solid";
    }

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!inputs.email.value.trim() || !inputs.email.value.trim().match(emailPattern)) {
      isValid = false;
      errorMessage += "A valid email address is required.\n";
      inputs.email.style.border = "1px #ef1515 solid";
    }

    if (inputs.role.value.trim() === "") {
      isValid = false;
      errorMessage += "Please select a user role.\n";
      inputs.role.style.border = "1px #ef1515 solid";
    }

    if (inputs.role.value.trim() === "doctor" && inputs.room.value.trim() === "") {
      isValid = false;
      errorMessage += "Please assign the doctor to a room.\n";
      inputs.room.style.border = "1px #ef1515 solid";
    }

    const phonePattern = /^\d{10}$/;
    if (!inputs.phoneNumber.value.trim() || !phonePattern.test(inputs.phoneNumber.value.trim())) {
      isValid = false;
      errorMessage += "Phone number is invalid.\n";
      inputs.phoneNumber.style.border = "1px #ef1515 solid";
    }

    if (!inputs.password.value.trim()) {
      isValid = false;
      errorMessage += "Password is required.\n";
      inputs.password.style.border = "1px #ef1515 solid";
    } else if (inputs.password.value.length < 6) {
      isValid = false;
      errorMessage += "Password must be at least 6 characters long.\n";
      inputs.password.style.border = "1px #ef1515 solid";
    }

    if (!inputs.confirmPassword.value.trim()) {
      isValid = false;
      errorMessage += "Confirm password is required.\n";
      inputs.confirmPassword.style.border = "1px #ef1515 solid";
    } else if (inputs.password.value !== inputs.confirmPassword.value) {
      isValid = false;
      errorMessage += "Passwords do not match.\n";
      inputs.confirmPassword.style.border = "1px #ef1515 solid";
    }

    if (inputs.profileImage.files.length > 0) {
      const file = inputs.profileImage.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        isValid = false;
        errorMessage += "Profile image size must be less than 2MB.\n";
        inputs.profileImage.style.border = "1px #ef1515 solid";
      }
    }

    if (!isValid) {
      invalidationMessage.innerHTML = `<i class="bi bi-exclamation-circle"></i> <p>${errorMessage}</p>`;
      invalidationMessage.style = "background-color: #ffeeee; padding: 10px;";
    }

    return isValid;
  }

  form.addEventListener("submit", function (event) {
    if (!validateForm()) {
      event.preventDefault();
    }
  });

  // Profile image preview
  inputs.profileImage.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      profileImagePreview.src = "/img/profile-img.png";
    }
  });
});
