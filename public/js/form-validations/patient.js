document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const patientNameInput = document.getElementById("patientName");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const genderSelect = document.getElementById("gender");
  const assignedToSelect = document.getElementById("assignedTo");
  const dateOfBirthInput = document.getElementById("dateOfBirth");
  const addressInput = document.getElementById("address");
  const commentsInput = document.getElementById("comments");
  const invalidationMessage = document.querySelector(".invalidation-message");

  form.addEventListener("submit", function (event) {
    let isValid = true;

        // Clear previous styles
        patientNameInput.style = "border: 1px #dddddd solid";
        genderSelect.style = "border: 1px #dddddd solid";
        assignedToSelect.style = "border: 1px #dddddd solid";
        phoneNumberInput.style = "border: 1px #dddddd solid";
        dateOfBirthInput.style = "border: 1px #dddddd solid";
        addressInput.style = "border: 1px #dddddd solid";
        commentsInput.style = "border: 1px #dddddd solid";

    let errorMessage = "Failed to submit!\n";

    // Clear previous messages
    invalidationMessage.textContent = "";

    if (!patientNameInput.value.trim()) {
      isValid = false;
      errorMessage += "Patient's full Name is required.\n";
      patientNameInput.style = "border: 1px #ef1515 solid";
    }

    if (genderSelect.value.trim() === "") {
      isValid = false;
      errorMessage += "Please select patient's gender.\n";
      genderSelect.style = "border: 1px #ef1515 solid";
    }

    if (assignedToSelect.value.trim() === "") {
      isValid = false;
      errorMessage += "Please assign a patient to a doctor.\n";
      assignedToSelect.style = "border: 1px #ef1515 solid";
    }

    const phonePattern = /^\d{10}$/;
    if (!phoneNumberInput.value.trim() || !phonePattern.test(phoneNumberInput.value.trim())) {
      isValid = false;
      errorMessage += "Phone Number is invalid.\n";
      phoneNumberInput.style = "border: 1px #ef1515 solid";
    }

    if (!dateOfBirthInput.value.trim()) {
      isValid = false;
      errorMessage += "Please enter patient's date of birth.\n";
      dateOfBirthInput.style = "border: 1px #ef1515 solid";
    }

    if (addressInput.value.trim() === "") {
      isValid = false;
      errorMessage += "Please add patient's address.\n";
      addressInput.style = "border: 1px #ef1515 solid";
    }

    if (!commentsInput.value.trim()) {
      isValid = false;
      errorMessage += "Please add comments.\n";
      commentsInput.style = "border: 1px #ef1515 solid";
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
