export function scrollFadeOut(element, offset = 0) {
  function updateOpacity() {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const startFade = Math.max(rect.top + offset, 0); // Start fading with the offset applied
    const endFade = rect.bottom + offset; // Adjust the bottom by the offset as well
    const fadeRange = endFade - startFade;
    if (fadeRange <= 0) return;
    const opacity = Math.max(0, Math.min(1, fadeRange / rect.height));
    element.style.opacity = opacity.toString();
  }
  window.addEventListener('scroll', updateOpacity);
  updateOpacity();
}

function getMarginWidth() {
  const vw = window.innerWidth;
  const pageWidth = 1400; // match --page-width in styles.css
  return (vw - pageWidth) / 2 + 30;
}

export function scrollToMe(container, me, duration) {
  const containerRect = container.getBoundingClientRect();
  const meRect = me.getBoundingClientRect();
  const offsetLeft = meRect.left - containerRect.left + container.scrollLeft;
  const scrollStartPos = offsetLeft - getMarginWidth();
  const startPosition = container.scrollLeft;
  const distance = scrollStartPos - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easing = easeInOutQuad(progress);
    container.scrollLeft = startPosition + distance * easing;
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  requestAnimationFrame(animation);
}

export function fixYears(block, years) {
  block.addEventListener('scroll', () => {
    const scrollLeftPos = block.scrollLeft;
    const margin = getMarginWidth();
    years.forEach((year) => {
      const yearLeftPos = year.offsetLeft;
      if (scrollLeftPos >= yearLeftPos - margin) {
        console.log('fixed');
        year.classList.add('fixed');
      } else {
        year.classList.remove('fixed');
      }
    });
  });
}
