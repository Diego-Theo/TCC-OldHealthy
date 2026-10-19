document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const dots = Array.from(dotsContainer.children);

  let currentIndex = 0;
  let autoplayTimer = null;

  // Calcula quantos slides aparecem por tela com base na largura
  function getSlidesPerPage() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getSlidesPerPage());
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Atualiza estados dos dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  }

  // Eventos de clique nas setas
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  // Evento de clique nos dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = Math.min(index, getMaxIndex());
      updateCarousel();
      resetAutoplay();
    });
  });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 4000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pausa o autoplay ao passar o mouse por cima
  const carouselWrapper = document.querySelector(".carousel-wrapper");
  carouselWrapper.addEventListener("mouseenter", stopAutoplay);
  carouselWrapper.addEventListener("mouseleave", startAutoplay);

  // Suporte a gestos Touch/Arrastar no celular
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    isDragging = false;
    startAutoplay();
  });

  // Ajusta o posicionamento no redimensionamento da janela
  window.addEventListener("resize", updateCarousel);

  // Inicializa o carrossel
  updateCarousel();
  startAutoplay();
});