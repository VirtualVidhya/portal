let id = (id) => document.getElementById(id);

let classes = (classes) => document.getElementsByClassName(classes);

const fNameInput = id("first-name");
const mNameInput = id("middle-name");
const lNameInput = id("last-name");

const ageInput = id("age");

const dobInput = id("dob");
function setDobAttributes() {
  const today = new Date();
  const minYear = today.getFullYear() - 120; // Minimum age: 120 years
  const maxYear = today.getFullYear() - 6 - 1; // Maximum age: 6 years

  dobInput.setAttribute("min", `${minYear}-01-01`);
  dobInput.setAttribute("max", `${maxYear}-12-31`);
}
setDobAttributes();

const genderInput = id("gender");
const empStatusInput = id("employment-status");

const occupationField = document.getElementById("occupation-field");
const occupationInput = document.getElementById("occupation");
const occupationLabel = document.getElementById("occupation-label");
const occupationDetailsMap = {
  "school-student": {
    label: "Standard and School Name *",
    placeholder: "e.g., 10th Grade - XYZ School",
  },
  "college-student": {
    label: "Course and College Name *",
    placeholder: "e.g., B.Sc. Computer Science - XYZ University",
  },
  "self-employed/business-owner": {
    label: "Nature of Your Work *",
    placeholder: "e.g., Freelance Graphic Designer, Bakery Owner etc.",
  },
  employed: {
    label: "Occupation and Company Name *",
    placeholder: "e.g., Software Engineer - XYZ Corp.",
  },
  "freelancer/contactor": {
    label: "Type of Freelancing Work *",
    placeholder: "e.g., Content Writing, Web Development, etc.",
  },
  unemployed: {
    label: "Type of Work You're Seeking *",
    placeholder: "e.g., Marketing, IT Support, Teaching, etc.",
  },
  homemaker: {
    label: "Additional Work Details (If Any)",
    placeholder: "e.g., Volunteer work, Home business, etc.",
  },
  retired: {
    label: "Previous Occupation",
    placeholder: "e.g., Former Teacher, Retired Doctor, etc.",
  },
};

const photoInput = id("photo");
const photoLabel = id("photo-label");
const photoField = id("photo-field");

const aadharInput = id("aadhar");
const aadharLabel = id("aadhar-label");
const aadharField = id("aadhar-field");

let phone = id("phone");
let email = id("email");
let course = id("course");

let form = id("form");
let errorMsg = classes("error");
let successMsg = id("form-success-msg");
//let successIcon = classes("success-icon");
//let failureIcon = classes("failure-icon");

let errorCount = 0;

// Add blur event listeners
fNameInput.addEventListener("blur", () =>
  check(fNameInput, 0, "First-Name cannot be blank!")
);
mNameInput.addEventListener("blur", () =>
  check(mNameInput, 1, "Middle-Name cannot be blank!")
);
lNameInput.addEventListener("blur", () =>
  check(lNameInput, 2, "Last-Name cannot be blank!")
);
ageInput.addEventListener("blur", () =>
  check(ageInput, 3, "Age cannot be blank!")
);
dobInput.addEventListener("blur", () =>
  check(dobInput, 4, "DOB cannot be blank!")
);
genderInput.addEventListener("blur", () =>
  check(genderInput, 5, "Please select your gender!")
);
empStatusInput.addEventListener("blur", () =>
  check(empStatusInput, 6, "Please select your employment status!")
);

empStatusInput.addEventListener("change", () => {
  const selectedValue = empStatusInput.value;

  clearError(occupationInput, 7);
  clearInput(occupationInput);

  if (occupationDetailsMap[selectedValue]) {
    occupationLabel.textContent = occupationDetailsMap[selectedValue].label;
    occupationInput.placeholder =
      occupationDetailsMap[selectedValue].placeholder;
    occupationInput.required = !["homemaker", "retired"].includes(
      selectedValue
    ); // Optional for these categories
    occupationField.style.display = "block";

    if (occupationInput.required) {
      occupationInput.addEventListener("blur", () => {
        check(occupationInput, 7, "This field cannot be blank!");
      });
    }
  } else {
    occupationField.style.display = "none";
    occupationInput.required = false;
    // occupationInput.value = ""; // Reset input when hidden
  }
});

photoInput.addEventListener("focusout", () => {
  check(photoInput, 8, "Please upload your passport-photo!");
});

aadharInput.addEventListener("focusout", () => {
  check(aadharInput, 9, "Please upload your aadhar-card!");
});

form.addEventListener("submit", (e) => {
  errorCount = 0;

  check(fNameInput, 0, "First-Name cannot be blank!");
  check(mNameInput, 1, "Middle-Name cannot be blank!");
  check(lNameInput, 2, "Last-Name cannot be blank!");
  check(ageInput, 3, "Age cannot be blank!");
  check(dobInput, 4, "DOB cannot be blank!");
  check(genderInput, 5, "Please select your gender!");
  check(empStatusInput, 6, "Please select your employment status!");
  if (occupationInput.required) {
    check(occupationInput, 7, "This field cannot be blank!");
  }
  check(photoInput, 8, "Please upload your passport-photo!");
  check(aadharInput, 9, "Please upload your aadhar-card!");

  // check(phone, 1, "Phone number cannot be blank!");
  // check(email, 2, "Email cannot be blank!");
  // check(course, 3, "Course cannot be blank!");

  if (errorCount > 0) {
    e.preventDefault();
    return;
  }

  onSuccessfulSubmission();
});

function onSuccessfulSubmission() {
  form.classList.add("hidden");
  successMsg.classList.remove("hidden");
  successMsg.classList.add("flex");
}

let check = (id, serial, message) => {
  if (serial === 8 && serial === 9) {
    let response;

    switch (serial) {
      case 8:
        response = validatePassportPhoto(id);
        break;
      case 9:
        response = validateAadharCard(id);
        break;
      default:
        response = true;
        break;
    }

    if (response == true) {
      showNoError(id, serial);

      if (serial === 8) {
        photoLabel.innerText = `${id.files[0].name}`;
        photoLabel.classList.remove(`file-upload-text`);
      } else if (serial === 9) {
        aadharLabel.innerText = `${id.files[0].name}`;
        aadharLabel.classList.remove(`file-upload-text`);
      }
    } else {
      showError(id, serial, response);

      if (serial === 8) {
        photoLabel.innerText = `Upload your passport-sized photo (png/jpeg/jpg)`;
        photoLabel.classList.add(`file-upload-text`);
      } else if (serial === 9) {
        aadharLabel.innerText = `Upload your passport-sized photo (png/jpeg/jpg)`;
        aadharLabel.classList.add(`file-upload-text`);
      }
    }

    return;
  }

  if (id.value.trim() === "") {
    showError(id, serial, message);
  } else {
    let response;

    switch (serial) {
      case 0:
      case 1:
      case 2:
        response = validateName(id);
        break;
      case 3:
        response = validateAge(id);
        break;
      case 4:
        response = validateDOB(id);
        break;
      case 5:
        response = validateGender(id);
        break;
      case 6:
        response = validateEmpStatus(id);
        break;
      case 7:
        response = validateOccupation(id);
        break;
      case 8:
        response = validatePassportPhoto(id);
        break;
      case 9:
        response = validateAadharCard(id);
        break;
      // response = validatePhoneNo(id);
      // break;
      // response = validateEmail(id);
      // break;
      default:
        response = true;
        break;
    }

    if (response == true) {
      showNoError(id, serial);

      if (serial === 8) {
        photoLabel.innerText = `${id.files[0].name}`;
        photoLabel.classList.remove(`file-upload-text`);
      } else if (serial === 9) {
        aadharLabel.innerText = `${id.files[0].name}`;
        aadharLabel.classList.remove(`file-upload-text`);
      }
    } else {
      showError(id, serial, response);

      if (serial === 8) {
        photoLabel.innerText = `Upload your passport-sized photo (png/jpeg/jpg)`;
        photoLabel.classList.add(`file-upload-text`);
      } else if (serial === 9) {
        aadharLabel.innerText = `Upload your passport-sized photo (png/jpeg/jpg)`;
        aadharLabel.classList.add(`file-upload-text`);
      }
    }
  }
};

function clearInput(id) {
  id.value = "";
}

function clearError(id, serial) {
  if (serial === 8) {
    id = photoField;
  } else if (serial === 9) {
    id = aadharField;
  }

  errorMsg[serial].innerHTML = "";

  id.classList.remove("border-2");
  id.classList.remove("border-font-color-green");
  id.classList.remove("border-font-color-red-dark");
}

function showError(id, serial, msg) {
  if (serial === 8) {
    id = photoField;
  } else if (serial === 9) {
    id = aadharField;
  }

  errorMsg[serial].innerHTML = msg;

  errorCount++;

  id.classList.remove("border-font-color-green");

  if (!id.classList.contains("border-2")) {
    id.classList.add("border-2");
  }

  // id.classList.add("outline-2");
  // id.classList.add("outline-font-color-red-dark");

  // if (!id.classList.contains("rounded-md")) {
  //   id.classList.add("rounded-md");
  // }

  id.classList.add("border-font-color-red-dark");
}

function showNoError(id, serial) {
  if (serial === 8) {
    id = photoField;
  } else if (serial === 9) {
    id = aadharField;
  }

  errorMsg[serial].innerHTML = "";

  id.classList.remove("border-font-color-red-dark");

  if (!id.classList.contains("border-2")) {
    id.classList.add("border-2");
  }

  // id.classList.remove("outline-2");
  // id.classList.remove("outline-font-color-red-dark");

  // if (!id.classList.contains("rounded-md")) {
  //   id.classList.add("rounded-md");
  // }

  id.classList.add("border-font-color-green");
}

function validateName(id) {
  const valueWithoutSpaces = id.value.replace(/\s/g, "");

  if (valueWithoutSpaces.length < 2) {
    let nameStr = "Name";

    if (id == 0) {
      nameStr = "First-Name";
    } else if (id == 1) {
      nameStr = "Middle-Name";
    } else if (id == 2) {
      nameStr = "Last-Name";
    }

    return `${nameStr} must be atleast 2 characters long!`;
  } else {
    return true;
  }
}

function validateAge(id) {
  if (6 <= id.value && id.value <= 120) {
    return true;
  } else {
    return `Age must be between 6 and 120 years!`;
  }
}

function validateDOB(id) {
  const dob = new Date(id.value); // Convert input to Date
  const today = new Date();

  // Check if valid date
  if (isNaN(dob.getTime())) {
    return "Please enter a valid date of birth!";
  }

  // Calculate age
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  // Adjust age if birth date hasn't occurred yet this year
  const adjustedAge =
    age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

  // Validate age range
  if (adjustedAge < 6 || adjustedAge > 120) {
    return "Age must be between 6 and 120 years!";
  }

  return true;
}

function validateGender(id) {
  return id.value ? true : "Please select your gender!";
}

function validateEmpStatus(id) {
  return id.value ? true : "Please select your employment status!";
}

function validateOccupation(id) {
  const valueWithoutSpaces = id.value.replace(/\s/g, "");

  if (valueWithoutSpaces.length < 5) {
    return "Please provide more details (minimum 5 characters)";
  }
  return true;
}

function validatePassportPhoto(id) {
  const file = id.files[0];

  if (!file) {
    return "Please upload your passport-photo!";
  }

  // Validate file type
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Only PNG, JPEG, and JPG formats are allowed.";
  }

  // Validate file size (optional, e.g., max 2MB)
  const maxSizeInMB = 2;
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`;
  }

  return true;
}

function validateAadharCard(id) {
  const file = id.files[0];

  if (!file) {
    return "Please upload your aadhar-card!";
  }

  // Validate file type
  const allowedTypes = ["application/pdf"];
  console.log(file.type);
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Only PDF format is allowed.";
  }

  // Validate file size (optional, e.g., max 2MB)
  const maxSizeInMB = 2;
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`;
  }

  return true;
}

function validatePhoneNo(id) {
  var phoneno = /^(6|7|8|9)\d{9}$/;

  if (!id.value.match(phoneno)) {
    return "Please enter a valid contact number!";
  } else {
    return true;
  }
}

function validateEmail(id) {
  var reg = new RegExp("^[a-zA-Z0-9_.]+@[a-zA-Z0-9.]+$");

  if (!reg.test(id.value)) {
    return "Please enter a valid email address!";
  } else {
    return true;
  }
}
