let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);

const form = id("form");
const successMsg = id("form-success-msg");
// let errorMsg = classes("error");
// let successIcon = classes("success-icon");
// let failureIcon = classes("failure-icon");

const fNameInput = id("first-name");
const mNameInput = id("middle-name");
const lNameInput = id("last-name");

const ageInput = id("age");

const dobInput = id("dob");
const monthDobInput = id("month-dob");
const dayDobInput = id("day-dob");
const yearDobInput = id("year-dob");

const genderInput = id("gender");
const empStatusInput = id("employment-status");

const occupationField = id("occupation-field");
const occupationInput = id("occupation");
const occupationLabel = id("occupation-label");

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

// function setDobAttributes() {
//   const today = new Date();
//   const minYear = today.getFullYear() - 120; // Minimum age: 120 years
//   const maxYear = today.getFullYear() - 6 - 1; // Maximum age: 6 years

//   dobInput.setAttribute("min", `${minYear}-01-01`);
//   dobInput.setAttribute("max", `${maxYear}-12-31`);
// }
// setDobAttributes();

const inputConfig = [
  {
    element: fNameInput,
    changeEvent: "blur",
    blankErrMsg: "First-Name cannot be blank!",
  },
  {
    element: mNameInput,
    changeEvent: "blur",
    blankErrMsg: "Middle Name cannot be blank!",
  },
  {
    element: lNameInput,
    changeEvent: "blur",
    blankErrMsg: "Last-Name cannot be blank!",
  },

  {
    element: ageInput,
    changeEvent: "blur",
    blankErrMsg: "Age cannot be blank!",
  },

  {
    element: monthDobInput,
    changeEvent: "blur",
    blankErrMsg: "",
  },
  {
    element: dayDobInput,
    changeEvent: "blur",
    blankErrMsg: "",
  },
  {
    element: yearDobInput,
    changeEvent: "blur",
    blankErrMsg: "",
  },

  {
    element: genderInput,
    changeEvent: "blur",
    blankErrMsg: "Please select your gender!",
  },
  {
    element: empStatusInput,
    changeEvent: "blur",
    blankErrMsg: "Please select your employment status!",
  },
  {
    element: occupationInput,
    changeEvent: "blur",
    blankErrMsg: "This field cannot be blank!",
    errMsg: "This field cannot be blank!",
  },

  {
    element: photoInput,
    changeEvent: "focusout",
    blankErrMsg: "Please upload your passport-photo!",
  },
  {
    element: aadharInput,
    changeEvent: "focusout",
    blankErrMsg: "Please upload your aadhar-card!",
  },

  {
    element: contactNoInput,
    changeEvent: "blur",
    blankErrMsg: "Mobile Number cannot be blank!",
  },
  {
    element: emailInput,
    changeEvent: "blur",
    blankErrMsg: "Email cannot be blank!",
  },
  {
    element: parentContactNoInput,
    changeEvent: "blur",
    blankErrMsg: "Parent's Mobile Number cannot be blank!",
  },

  {
    element: currAddLine1Input,
    changeEvent: "blur",
    blankErrMsg: "Apt, Suite Info cannot be blank!",
  },
  {
    element: currAddLine2Input,
    changeEvent: "blur",
    blankErrMsg: "Street Address cannot be blank!",
  },
  {
    element: currCityInput,
    changeEvent: "blur",
    blankErrMsg: "City cannot be blank!",
  },
  {
    element: currStateInput,
    changeEvent: "blur",
    blankErrMsg: "State cannot be blank!",
  },
  {
    element: currPinInput,
    changeEvent: "blur",
    blankErrMsg: "PIN Code cannot be blank!",
  },

  {
    element: perAddLine1Input,
    changeEvent: "blur",
    blankErrMsg: "Apt, Suite Info cannot be blank!",
  },
  {
    element: perAddLine2Input,
    changeEvent: "blur",
    blankErrMsg: "Street Address cannot be blank!",
  },
  {
    element: perCityInput,
    changeEvent: "blur",
    blankErrMsg: "City cannot be blank!",
  },
  {
    element: perStateInput,
    changeEvent: "blur",
    blankErrMsg: "State cannot be blank!",
  },
  {
    element: perPinInput,
    changeEvent: "blur",
    blankErrMsg: "PIN Code cannot be blank!",
  },

  {
    element: courseInput,
    changeEvent: "blur",
    blankErrMsg: "Please select your course!",
  },
  {
    element: academicQualInput,
    changeEvent: "blur",
    blankErrMsg: "Academic Qualification cannot be blank!",
  },

  {
    element: hearAboutInput,
    changeEvent: "blur",
    blankErrMsg: "This field cannot be blank!",
  },
  {
    element: tncInput,
    changeEvent: "change",
    blankErrMsg:
      "You must accept the terms & conditions to submit an application!",
  },
];

inputConfig.forEach((item) => {
  if (item.element == occupationInput || item.element == tncInput) return;
  else if (
    item.element == monthDobInput ||
    item.element == dayDobInput ||
    item.element == yearDobInput
  ) {
    item.element.addEventListener(item.changeEvent, () => {
      check(dobInput, item.blankErrMsg);
    });

    return;
  }

  item.element.addEventListener(item.changeEvent, () => {
    check(item.element, item.blankErrMsg);
  });
});

empStatusInput.addEventListener("change", () => {
  const selectedValue = empStatusInput.value;

  clearError(occupationInput);
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
        check(occupationInput, "This field cannot be blank!");
      });
    }
  } else {
    occupationField.style.display = "none";
    occupationInput.required = false;
    // occupationInput.value = ""; // Reset input when hidden
  }
});

let errorCount = 0;

form.addEventListener("submit", (e) => {
  errorCount = 0;

  inputConfig.forEach((item) => {
    if (item.element == occupationInput) {
      if (occupationInput.required) {
        check(occupationInput, "This field cannot be blank!");
      }

      return;
    } else if (
      item.element == monthDobInput ||
      item.element == dayDobInput ||
      item.element == yearDobInput
    ) {
      check(dobInput, item.blankErrMsg);
      return;
    }

    check(item.element, item.blankErrMsg);
  });

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

let check = (element, errMsg) => {
  if (element === photoInput) {
    let response;

    response = validateAadharCard(element);

    if (response == true) {
      showValidInputIndication(element);

      photoLabel.innerText = `${element.files[0].name}`;
      photoLabel.classList.remove(`file-upload-text`);
    } else {
      showInvalidInputIndication(element, response);

      photoLabel.innerText = `Upload your passport-sized photo (png/jpeg/jpg)`;
      photoLabel.classList.add(`file-upload-text`);
    }

    return;
  } else if (element === aadharInput) {
    let response;

    response = validateAadharCard(element);

    if (response == true) {
      showValidInputIndication(element);

      aadharLabel.innerText = `${element.files[0].name}`;
      aadharLabel.classList.remove(`file-upload-text`);
    } else {
      showInvalidInputIndication(element, response);

      aadharLabel.innerText = `Upload your scanned copy of aadhar card (pdf)`;
      aadharLabel.classList.add(`file-upload-text`);
    }

    return;
  } else if (element === dobInput) {
    let response = validateDOB(element);

    if (response == true) {
      showValidInputIndication(element);
    } else {
      showInvalidInputIndication(element, response);
    }

    return;
  }

  if (element.value.trim() === "") {
    if (
      element === perAddLine1Input ||
      element === perAddLine2Input ||
      element === perCityInput ||
      element === perStateInput ||
      element === perPinInput
    ) {
      clearError(element);
      return;
    }

    showInvalidInputIndication(element, errMsg);
  } else {
    let response;

    switch (element) {
      case fNameInput:
      case mNameInput:
      case lNameInput:
        response = validateName(element);
        break;
      case ageInput:
        response = validateAge(element);
        break;
      case genderInput:
        response = validateGender(element);
        break;
      case empStatusInput:
        response = validateEmpStatus(element);
        break;
      case occupationInput:
        response = validateOccupation(element);
        break;
      case contactNoInput:
      case parentContactNoInput:
        response = validateMobileNo(element);
        break;
      case emailInput:
        response = validateEmail(element);
        break;
      case currAddLine1Input:
      case currAddLine2Input:
      case perAddLine1Input:
      case perAddLine2Input:
        response = validateAddLine(element);
        break;
      case currCityInput:
      case perCityInput:
        response = validateCity(element);
        break;
      case currStateInput:
      case perStateInput:
        response = validateState(element);
        break;
      case currPinInput:
      case perStateInput:
        response = validatePin(element);
        break;
      case courseInput:
        response = validateCourse(element);
        break;
      case academicQualInput:
        response = validateAcademicQualification(element);
        break;
      case hearAboutInput:
        response = validateHearAboutInfo(element);
        break;
      case tncInput:
        response = validateTnc(element);
        break;
      default:
        response = true;
        break;
    }

    if (response == true) {
      showValidInputIndication(element);
    } else {
      showInvalidInputIndication(element, response);
    }
  }
};

function clearInput(id) {
  id.value = "";
}

function clearError(id) {
  if (id === photoInput) {
    id = photoField;
  } else if (id === aadharInput) {
    id = aadharField;
  }

  const errorDiv = id.closest(".form-field").querySelector(".error");
  errorDiv.innerText = "";

  id.classList.remove("border-2");
  id.classList.remove("border-font-color-green");
  id.classList.remove("border-font-color-red-dark");
}

function showInvalidInputIndication(id, msg) {
  if (id === photoInput) {
    id = photoField;
  } else if (id === aadharInput) {
    id = aadharField;
  }

  const errorDiv = id.closest(".form-field").querySelector(".error");
  errorDiv.innerText = msg;

  errorCount++;

  if (id === dobInput) {
    let fields = [monthDobInput, dayDobInput, yearDobInput];

    for (let i = 0; i < fields.length; i++) {
      fields[i].classList.remove("border-font-color-green");

      if (!fields[i].classList.contains("border-2")) {
        fields[i].classList.add("border-2");
      }

      fields[i].classList.add("border-font-color-red-dark");
    }

    return;
  }

  id.classList.remove("border-font-color-green");

  if (!id.classList.contains("border-2")) {
    id.classList.add("border-2");
  }

  id.classList.add("border-font-color-red-dark");
}

function showValidInputIndication(id) {
  if (id === photoInput) {
    id = photoField;
  } else if (id === aadharInput) {
    id = aadharField;
  }

  const errorDiv = id.closest(".form-field").querySelector(".error");
  errorDiv.innerText = "";

  if (id === dobInput) {
    let fields = [monthDobInput, dayDobInput, yearDobInput];

    for (let i = 0; i < fields.length; i++) {
      fields[i].classList.remove("border-font-color-red-dark");

      if (!fields[i].classList.contains("border-2")) {
        fields[i].classList.add("border-2");
      }

      fields[i].classList.add("border-font-color-green");
    }

    return;
  }

  id.classList.remove("border-font-color-red-dark");

  if (!id.classList.contains("border-2")) {
    id.classList.add("border-2");
  }

  id.classList.add("border-font-color-green");
}

function validateName(id) {
  const valueWithoutSpaces = id.value.replace(/\s/g, "");

  if (valueWithoutSpaces.length < 2) {
    let nameStr = "Name";

    if (id === fNameInput) {
      nameStr = "First-Name";
    } else if (id === mNameInput) {
      nameStr = "Middle-Name";
    } else if (id === lNameInput) {
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
  console.log("validateDOB called");

  const month = monthDobInput.value;
  const date = dayDobInput.value;
  const year = yearDobInput.value;

  console.log(month, date, year);

  if (!month || !date || !year) {
    return "Please fill in all date of birth fields!";
  }

  const monthNumber = new Date(`${month} 1, 2000`).getMonth();

  const dob = new Date(year, monthNumber, date);
  const today = new Date();

  console.log(dob, today);

  if (
    isNaN(dob.getTime()) ||
    dob.getDate() != date ||
    dob.getMonth() != monthNumber
  ) {
    return "Please enter a valid date of birth!";
  }

  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  console.log(age, monthDiff, dayDiff);

  const adjustedAge =
    age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

  console.log(adjustedAge);

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

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Only PNG, JPEG, and JPG formats are allowed.";
  }

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

  const allowedTypes = ["application/pdf"];
  console.log(file.type);
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Only PDF format is allowed.";
  }

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
