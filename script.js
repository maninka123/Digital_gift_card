const revealItems = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const filmSlides = document.querySelectorAll(".film-slide");
const filmDots = document.querySelectorAll(".film-dot");
let filmIndex = 0;

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 80}ms`;
});

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (filmSlides.length > 1 && !reduceMotion) {
  window.setInterval(() => {
    filmSlides[filmIndex].classList.remove("is-active");
    filmDots[filmIndex].classList.remove("is-active");

    filmIndex = (filmIndex + 1) % filmSlides.length;

    filmSlides[filmIndex].classList.add("is-active");
    filmDots[filmIndex].classList.add("is-active");
  }, 2600);
}
