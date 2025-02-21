// lottie.js
// import { DotLottie } from "@lottiefiles/dotlottie-web";
// import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

// window.loadLottieAnimation = function (elementId, animationSrc) {
//   const dotLottie = new DotLottie({
//     autoplay: true,
//     loop: true,
//     canvas: document.querySelector(`#${elementId}`),
//     src: animationSrc,
//   });
// };

// document.addEventListener("DOMContentLoaded", async () => {
//   const { DotLottie } = await import(
//     "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm"
//   );

//   window.loadLottieAnimation = function (elementId, animationSrc) {
//     const dotLottie = new DotLottie({
//       autoplay: true,
//       loop: true,
//       canvas: document.querySelector(`#${elementId}`),
//       src: animationSrc,
//     });
//   };

//   document.querySelectorAll("[data-lottie]").forEach((canvas) => {
//     window.loadLottieAnimation(canvas.id, canvas.dataset.lottie);
//   });
// });

// (async () => {
//   // Preload DotLottie module immediately
//   const { DotLottie } = await import(
//     "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm"
//   );

//   // Define the function globally
//   window.loadLottieAnimation = function (elementId, animationSrc) {
//     const dotLottie = new DotLottie({
//       autoplay: true,
//       loop: true,
//       canvas: document.querySelector(`#${elementId}`),
//       src: animationSrc,
//     });
//   };

//   // Start loading animations right away
//   document.querySelectorAll("[data-lottie]").forEach((canvas) => {
//     window.loadLottieAnimation(canvas.id, canvas.dataset.lottie);
//   });
// })();

// (async () => {
//   function loadLottie() {
//     // return import("https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm");
//     return import("https://esm.sh/@lottiefiles/dotlottie-web");
//   }

//   async function loadAnimation(elementId, animationSrc) {
//     const { DotLottie } = await loadLottie();
//     new DotLottie({
//       autoplay: true,
//       loop: true,
//       canvas: document.querySelector(`#${elementId}`),
//       src: animationSrc,
//     });
//   }

//   const observer = new IntersectionObserver(
//     (entries, observer) => {
//       entries.forEach(async (entry) => {
//         if (entry.isIntersecting) {
//           await loadAnimation(entry.target.id, entry.target.dataset.lottie);
//           observer.unobserve(entry.target); // Load only once
//         }
//       });
//     },
//     { rootMargin: "100px" }
//   );

//   document.querySelectorAll("[data-lottie]").forEach((el) => observer.observe(el));
// })();

// import lottie from "lottie-web";

// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll("[data-lottie]").forEach((canvas) => {
//     const animationPath = canvas.dataset.lottie;

//     lottie.loadAnimation({
//       container: canvas,
//       renderer: "canvas",
//       loop: true,
//       autoplay: true,
//       path: animationPath,
//     });
//   });
// });

// import lottie from "lottie-web";

// window.addEventListener("load", () => {
//   document.querySelectorAll("[data-lottie]").forEach((container) => {
//     const animationPath = container.dataset.lottie;
//     const placeholder = container.querySelector(".lottie-placeholder");

//     // Replace static image with animation
//     lottie.loadAnimation({
//       container, // Uses existing div
//       renderer: "canvas",
//       loop: true,
//       autoplay: true,
//       path: animationPath,
//     });

//     if (placeholder) placeholder.remove();

//     // Mark animation as loaded
//     container.setAttribute("data-loaded", "true");
//   });
// });

(async () => {
  let dotLottieModule;

  async function loadLottie() {
    // try {
    //   return import("@lottiefiles/dotlottie-web");
    // } catch (error) {
    //   console.warn("Local dotLottie failed, falling back to CDN.");
    //   return import("https://esm.sh/@lottiefiles/dotlottie-web");
    // }
    try {
      return await import("https://esm.sh/@lottiefiles/dotlottie-web");
    } catch (error) {
      console.warn("CDN failed, falling back to local dotLottie.");
      return await import("@lottiefiles/dotlottie-web");
    }
  }

  // Preload dotLottie library **after** the page loads
  window.addEventListener("DOMContentLoaded", async () => {
    dotLottieModule = await loadLottie();
  });

  async function loadAnimation(canvas) {
    // If the library isn’t loaded yet, load it now
    if (!dotLottieModule) dotLottieModule = await loadLottie();
    const { DotLottieWorker } = dotLottieModule;

    if (canvas.dataset.loaded === "true") return; // Prevent duplicate loading

    canvas.dataset.loaded = "true";

    const relativePath = canvas.dataset.lottie;
    const absoluteUrl = new URL(relativePath, window.location.origin).href;
    const placeholder = canvas
      .closest(".lottie-container")
      ?.querySelector(".lottie-placeholder");

    canvas.style.opacity = "0"; // Ensure it's hidden initially

    const animation = new DotLottieWorker({
      canvas: canvas,
      src: absoluteUrl,
      autoplay: true,
      loop: true,
      workerId: `worker-${canvas.id}`,
    });

    animation.addEventListener("frame", () => {
      if (canvas.style.opacity === "0") {
        requestAnimationFrame(() => {
          if (canvas.dataset.enabled == "true") return;

          canvas.style.transition = "opacity 0.2s ease-in-out";
          canvas.style.opacity = "1";
          canvas.dataset.enabled = "true";
          // console.log("Enabled", canvas);

          if (placeholder) placeholder.style.opacity = "0";
          // console.log("Removed", placeholder);

          setTimeout(
            () => requestAnimationFrame(() => placeholder?.remove()),
            200
          );
        });
        // canvas.style.transition = "opacity 0.2s ease-in-out";
        // canvas.style.opacity = "1"; // Fade in animation
        // console.log("Enabled", canvas);
        // if (placeholder) placeholder.style.opacity = "0"; // Fade out placeholder
        // console.log("Removed", placeholder);
        // setTimeout(() => placeholder?.remove(), 200); // Remove after fade-out
      }
    });
  }

  // **Smart Preloading Strategy**: Load animations **before** they are seen
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          // console.log("Entry", entry);
          // Start loading **before** it fully enters
          await loadAnimation(entry.target);
          observer.unobserve(entry.target); // Stop observing after first load
        }
      });
    },
    { rootMargin: "750px" } // Preload when the user is **750px away** from the animation
  );

  document
    .querySelectorAll("[data-lottie]")
    .forEach((el) => observer.observe(el));
})();
