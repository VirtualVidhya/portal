function setupScrollButton() {
  const btn = document.getElementById("scroll-up-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100 || window.scrollY > 100) {
      // btn.style.display = "block";
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

setupScrollButton();
