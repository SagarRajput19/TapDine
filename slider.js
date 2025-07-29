let slideIndex = 0;
const slides = document.querySelectorAll(".slider img");
const totalSlides = slides.length;

function autoSlide() {
  slides.forEach((img, i) => {
    img.style.opacity = i === slideIndex ? "1" : "0"; // Fade effect
  });

  document.querySelector(".slider").style.transform = `translateX(-${slideIndex * 100}%)`;

  slideIndex = (slideIndex + 1) % totalSlides;
}

setInterval(autoSlide, 3000); // Change slide every 3 seconds
