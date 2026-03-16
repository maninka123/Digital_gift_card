const revealItems = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const memoryRotator = document.querySelector("[data-memory-rotator]");
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

async function buildMemoryRotator() {
  if (!memoryRotator) {
    return;
  }

  const imageDir = memoryRotator.dataset.imageDir;
  const prefix = memoryRotator.dataset.imagePrefix;
  const extension = memoryRotator.dataset.imageExtension;
  const discoveredImages = [];

  for (let index = 1; index <= 20; index += 1) {
    const src = `${imageDir}/${prefix}${index}${extension}`;

    // Probe sequentially named images like Image_1.jpeg, Image_2.jpeg, ...
    const exists = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });

    if (!exists) {
      break;
    }

    discoveredImages.push({
      src,
      alt: `Memory snapshot ${index} with Yaling and friends.`,
    });
  }

  if (!discoveredImages.length) {
    memoryRotator.innerHTML = "<div class=\"film-empty\">More memories coming soon.</div>";
    return;
  }

  memoryRotator.innerHTML = `
    ${discoveredImages
      .map(
        (image, index) => `
          <img
            class="film-slide${index === 0 ? " is-active" : ""}"
            src="${image.src}"
            alt="${image.alt}"
          />
        `
      )
      .join("")}
    <div class="film-dots" aria-hidden="true">
      ${discoveredImages
        .map(
          (_, index) => `<span class="film-dot${index === 0 ? " is-active" : ""}"></span>`
        )
        .join("")}
    </div>
  `;

  const filmSlides = memoryRotator.querySelectorAll(".film-slide");
  const filmDots = memoryRotator.querySelectorAll(".film-dot");

  if (filmSlides.length > 1 && !reduceMotion) {
    window.setInterval(() => {
      filmSlides[filmIndex].classList.remove("is-active");
      filmDots[filmIndex].classList.remove("is-active");

      filmIndex = (filmIndex + 1) % filmSlides.length;

      filmSlides[filmIndex].classList.add("is-active");
      filmDots[filmIndex].classList.add("is-active");
    }, 2600);
  }
}

buildMemoryRotator();
