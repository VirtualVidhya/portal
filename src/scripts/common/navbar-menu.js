let btn = document.getElementById("topbar-menu-btn");
btn.addEventListener("click", Menu);

let closeBtnIcon = document.querySelector(
  "#topbar-menu-btn > svg[data-state='close']"
);
let openBtnIcon = document.querySelector(
  "#topbar-menu-btn > svg[data-state='open']"
);

function Menu() {
  let list = document.querySelector(".topbar-menu");
  let body = document.body;

  if (btn.name === "close") {
    btn.name = "open";

    closeBtnIcon.style.display = "block";
    openBtnIcon.style.display = "none";

    list.classList.add("translate-x-[640px]", "opacity-100");
    body.style.overflow = "hidden";
  } else {
    btn.name = "close";

    closeBtnIcon.style.display = "none";
    openBtnIcon.style.display = "block";

    list.classList.remove("translate-x-[640px]", "opacity-100");
    body.style.overflow = "";
  }

  // if (btn.name === "open") {
  //   btn.name = "close";

  //   closeBtnIcon.style.display = "none";
  //   openBtnIcon.style.display = "block";

  //   // btn.classList.remove("fa-bars");
  //   // btn.classList.add("fa-xmark");

  //   list.classList.add("translate-x-[640px]");
  //   list.classList.add("opacity-100");

  //   body.style.overflow = "hidden";
  // } else {
  //   btn.name = "open";

  //   openBtnIcon.style.display = "none";
  //   closeBtnIcon.style.display = "block";

  //   // btn.classList.add("fa-bars");
  //   // btn.classList.remove("fa-xmark");

  //   list.classList.remove("translate-x-[640px]");
  //   list.classList.remove("opacity-100");

  //   body.style.overflow = "";
  // }
}
