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
    label: `Standard and School Name <span class="form-req-label">*</span>`,
    placeholder: "e.g., 10th Grade - XYZ School",
  },
  "college-student": {
    label: `Course and College Name <span class="form-req-label">*</span>`,
    placeholder: "e.g., B.Sc. Computer Science - XYZ University",
  },
  "self-employed/business-owner": {
    label: `Nature of Your Work <span class="form-req-label">*</span>`,
    placeholder: "e.g., Freelance Graphic Designer, Bakery Owner etc.",
  },
  employed: {
    label: `Occupation and Company Name <span class="form-req-label">*</span>`,
    placeholder: "e.g., Software Engineer - XYZ Corp.",
  },
  "freelancer/contactor": {
    label: `Type of Freelancing Work <span class="form-req-label">*</span>`,
    placeholder: "e.g., Content Writing, Web Development, etc.",
  },
  unemployed: {
    label: `Type of Work You're Seeking <span class="form-req-label">*</span>`,
    placeholder: "e.g., Marketing, IT Support, Teaching, etc.",
  },
  homemaker: {
    label: `Additional Work Details (If Any)`,
    placeholder: "e.g., Volunteer work, Home business, etc.",
  },
  retired: {
    label: `Previous Occupation`,
    placeholder: "e.g., Former Teacher, Retired Doctor, etc.",
  },
};

const photoInput = id("photo");
const photoLabel = id("photo-label");
const photoField = id("photo-field");

const aadharInput = id("aadhar");
const aadharLabel = id("aadhar-label");
const aadharField = id("aadhar-field");

// const pfNameInput = id("parent-first-name");
// const pmNameInput = id("parent-middle-name");
// const plNameInput = id("parent-last-name");

// const parentOccupationInput = id("parent-occupation");

const contactNoInput = id("contact-no");
const emailInput = id("email");
const parentContactNoInput = id("parent-contact-no");

const currAddLine1Input = id("curr-add-line1");
const currAddLine2Input = id("curr-add-line2");
const currCityInput = id("curr-city");
const currStateInput = id("curr-state");
const currPinInput = id("curr-pincode");

const perAddLine1Input = id("per-add-line1");
const perAddLine2Input = id("per-add-line2");
const perCityInput = id("per-city");
const perStateInput = id("per-state");
const perPinInput = id("per-pincode");

const courseInput = id("course");
const academicQualInput = id("academic-qual");
// compProficiency
// relevantSkills
// prevTraining

const hearAboutInput = id("reference");
const tncInput = id("t&c");

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
// genderInput.addEventListener("invalid", function (e) {
//   e.preventDefault();
// });
empStatusInput.addEventListener("blur", () =>
  check(empStatusInput, 6, "Please select your employment status!")
);
// empStatusInput.addEventListener("invalid", function (e) {
//   e.preventDefault();
// });
empStatusInput.addEventListener("change", () => {
  const selectedValue = empStatusInput.value;

  clearError(occupationInput, 7);
  clearInput(occupationInput);

  if (occupationDetailsMap[selectedValue]) {
    occupationLabel.innerHTML = occupationDetailsMap[selectedValue].label;
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

// pfNameInput.addEventListener("blur", () =>
//   check(pfNameInput, 10, "Parent's First-Name cannot be blank!")
// );
// pmNameInput.addEventListener("blur", () =>
//   check(pmNameInput, 11, "Parent's Middle-Name cannot be blank!")
// );
// plNameInput.addEventListener("blur", () =>
//   check(plNameInput, 12, "Parent's Last-Name cannot be blank!")
// );
// parentOccupationInput.addEventListener("blur", () =>
//   check(parentOccupationInput, 13, "Parent's Occupation cannot be blank!")
// );

contactNoInput.addEventListener("blur", () =>
  check(contactNoInput, 10, "Mobile Number cannot be blank!")
);
emailInput.addEventListener("blur", () =>
  check(emailInput, 11, "Email cannot be blank!")
);
parentContactNoInput.addEventListener("blur", () =>
  check(parentContactNoInput, 12, "Parent's Mobile Number cannot be blank!")
);
currAddLine1Input.addEventListener("blur", () =>
  check(currAddLine1Input, 13, "Apt, Suite Info cannot be blank!")
);
currAddLine2Input.addEventListener("blur", () =>
  check(currAddLine2Input, 14, "Street Address cannot be blank!")
);
currCityInput.addEventListener("blur", () =>
  check(currCityInput, 15, "City cannot be blank!")
);
currStateInput.addEventListener("blur", () =>
  check(currStateInput, 16, "State cannot be blank!")
);
// currStateInput.addEventListener("invalid", function (e) {
//   e.preventDefault();
// });
currPinInput.addEventListener("blur", () =>
  check(currPinInput, 17, "PIN Code cannot be blank!")
);
perAddLine1Input.addEventListener("blur", () =>
  check(perAddLine1Input, 18, "Apt, Suite Info cannot be blank!")
);
perAddLine2Input.addEventListener("blur", () =>
  check(perAddLine2Input, 19, "Street Address cannot be blank!")
);
perCityInput.addEventListener("blur", () =>
  check(perCityInput, 20, "City cannot be blank!")
);
perStateInput.addEventListener("blur", () =>
  check(perStateInput, 21, "State cannot be blank!")
);
// perStateInput.addEventListener("invalid", function (e) {
//   e.preventDefault();
// });
perPinInput.addEventListener("blur", () =>
  check(perPinInput, 22, "PIN Code cannot be blank!")
);

courseInput.addEventListener("blur", () =>
  check(courseInput, 23, "Course Name cannot be blank!")
);
academicQualInput.addEventListener("blur", () =>
  check(academicQualInput, 24, "Academic Qualification cannot be blank!")
);

hearAboutInput.addEventListener("blur", () =>
  check(hearAboutInput, 28, "This field cannot be blank!")
);

form.addEventListener("submit", (e) => {
  errorCount = 0;

  if (fNameInput.validity.valueMissing) {
    console.log("missing");
    fNameInput.setCustomValidity("");
  }

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

  // check(pfNameInput, 10, "Parent's First-Name cannot be blank!");
  // check(pmNameInput, 11, "Parent's Middle-Name cannot be blank!");
  // check(plNameInput, 12, "Parent's Last-Name cannot be blank!");
  // check(parentOccupationInput, 13, "Parent's Occupation cannot be blank!");

  check(contactNoInput, 10, "Mobile Number cannot be blank!");
  check(emailInput, 11, "Email cannot be blank!");
  check(parentContactNoInput, 12, "Parent's Mobile Number cannot be blank!");

  check(currAddLine1Input, 13, "Apt, Suite Info cannot be blank!");
  check(currCityInput, 14, "Street Address cannot be blank!");
  check(currAddLine2Input, 15, "Street Address cannot be blank!");
  check(currStateInput, 16, "State cannot be blank!");
  check(currPinInput, 17, "PIN Code cannot be blank!");

  check(perAddLine1Input, 18, "Apt, Suite Info cannot be blank!");
  check(perAddLine2Input, 19, "Street Address cannot be blank!");
  check(perCityInput, 20, "City cannot be blank!");
  check(perStateInput, 21, "State cannot be blank!");
  check(perPinInput, 22, "PIN Code cannot be blank!");

  check(courseInput, 23, "Course Name cannot be blank!");
  check(academicQualInput, 24, "Academic Qualification cannot be blank!");

  check(hearAboutInput, 28, "This field cannot be blank!");
  check(tncInput, 29, "");

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
      showValidInputIndication(id, serial);

      if (serial === 8) {
        photoLabel.innerText = `${id.files[0].name}`;
        photoLabel.classList.remove(`file-upload-text`);
      } else if (serial === 9) {
        aadharLabel.innerText = `${id.files[0].name}`;
        aadharLabel.classList.remove(`file-upload-text`);
      }
    } else {
      showInvalidInputIndication(id, serial, response);

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
    if (18 <= serial && serial <= 22) {
      clearError(id, serial);
      return;
    }

    showInvalidInputIndication(id, serial, message);
  } else {
    let response;

    switch (serial) {
      case 0:
      case 1:
      case 2:
        // case 10:
        // case 11:
        // case 12:
        response = validateName(id, serial);
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
      case 10:
      case 12:
        response = validateMobileNo(id);
        break;
      case 11:
        response = validateEmail(id);
        break;
      case 13:
      case 14:
      case 18:
      case 19:
        response = validateAddLine(id);
        break;
      case 15:
      case 20:
        response = validateCity(id);
        break;
      case 16:
      case 21:
        response = validateState(id);
        break;
      case 17:
      case 22:
        response = validatePin(id);
        break;
      case 23:
        response = validateCourse(id);
        break;
      case 24:
        response = validateAcademicQualification(id);
        break;
      case 28:
        response = validateHearAboutInfo(id);
        break;
      case 29:
        response = validateTnc(id);
        break;
      default:
        response = true;
        break;
    }

    if (response == true) {
      showValidInputIndication(id, serial);
    } else {
      showInvalidInputIndication(id, serial, response);
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

function showInvalidInputIndication(id, serial, msg) {
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

function showValidInputIndication(id, serial) {
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

function validateName(id, serial) {
  const valueWithoutSpaces = id.value.replace(/\s/g, "");

  if (valueWithoutSpaces.length < 2) {
    let nameStr = "Name";

    if (serial === 0) {
      nameStr = "First-Name";
    } else if (serial === 1) {
      nameStr = "Middle-Name";
    } else if (serial === 2) {
      nameStr = "Last-Name";
    } else if (serial === 10) {
      nameStr = "Parent's First-Name";
    } else if (serial === 11) {
      nameStr = "Parent's Middle-Name";
    } else if (serial === 12) {
      nameStr = "Parent's Last-Name";
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

function validateMobileNo(id) {
  var phoneno = /^(6|7|8|9)\d{9}$/;

  if (!id.value.match(phoneno)) {
    return "Please enter a valid mobile number!";
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

function validateAddLine(id) {
  // const valueWithoutSpaces = id.value.replace(/\s/g, "");

  if (id.value.length > 100) {
    if (id === "currAddLine1Input") {
      return "Apt/Suite info cannot exceed 100 characters.";
    } else if (id === "currAddLine2Input") {
      return "Street address cannot exceed 100 characters.";
    }
  }
  return true;
}

function validateCity(id) {
  const cityRegex = /^[A-Za-z\s]+$/;

  if (!cityRegex.test(id.value.trim())) {
    return "City name can only contain letters and spaces!";
  } else {
    return true;
  }
}

function validateState(id) {
  return id.value ? true : "Please select your state!";
}

function validatePin(id) {
  const pinRegex = /^[1-9][0-9]{5}$/;

  if (!pinRegex.test(id.value.trim())) {
    return "Please enter a valid indian pincode!";
  } else {
    return true;
  }
}

function validateCourse(id) {
  const list = document.getElementById("course-list");
  const options = Array.from(list.options).map((opt) => opt.value);

  if (!options.includes(id.value)) {
    return "Please select a valid course from the list!";
  } else {
    return true;
  }
}

function validateAcademicQualification(id) {
  return id.value ? true : "Please enter your academic qualification!";
}

function validateHearAboutInfo(id) {
  return id.value ? true : "Please fill up this field!";
}

function validateTnc(id) {
  if (!id.checked) {
    return "You must accept the terms & conditions to submit an application!";
  } else {
    return true;
  }
}
