let id = (id) => document.getElementById(id);

let classes = (classes) => document.getElementsByClassName(classes);

let username = id("name");
let phone = id("phone");
let email = id("email");
let course = id("course");
let errorMsg = classes("error");
let form = id("form");
let successMsg = id("form-success-msg");
//let successIcon = classes("success-icon");
//let failureIcon = classes("failure-icon");

let errorCount = 0;

form.addEventListener("submit", (e) => {
  errorCount = 0;

  check(username, 0, "Name cannot be blank!");
  check(phone, 1, "Phone number cannot be blank!");
  check(email, 2, "Email cannot be blank!");
  check(course, 3, "Course cannot be blank!");

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
  if (id.value.trim() === "") {
    showError(id, serial, message);
  } else {
    let response;

    switch (serial) {
      case 0:
        response = validateName(id);
        break;
      case 1:
        response = validatePhoneNo(id);
        break;
      case 2:
        response = validateEmail(id);
        break;
      default:
        response = true;
        break;
    }

    if (response == true) {
      showNoError(id, serial);
    } else {
      showError(id, serial, response);
    }
  }
};

function showError(id, serial, msg) {
  errorMsg[serial].innerHTML = msg;

  errorCount++;

  id.classList.remove("border-font-color-sec");

  if (!id.classList.contains("border-2")) {
    id.classList.add("border-2");
  }

  if (!id.classList.contains("rounded-md")) {
    id.classList.add("rounded-md");
  }

  id.classList.add("border-font-color-red-dark");
}

function showNoError(id, serial) {
  errorMsg[serial].innerHTML = "";

  id.classList.remove("border-font-color-red-dark");

  if (!id.classList.contains("border-2")) {
    id.classList.add("border-2");
  }

  if (!id.classList.contains("rounded-md")) {
    id.classList.add("rounded-md");
  }

  id.classList.add("border-font-color-sec");
}

function validateName(id) {
  if (id.value.length < 2) {
    return "Name must be atleast 2 characters long!";
  } else {
    return true;
  }
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
