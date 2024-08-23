export function scrollFadeOut(element, offset = 0) {
  function updateOpacity() {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Determine the adjusted start position with the offset
    const startFade = Math.max(rect.top + offset, 0); // Start fading with the offset applied
    const endFade = rect.bottom + offset; // Adjust the bottom by the offset as well
    const fadeRange = endFade - startFade;

    // Ensure the fadeRange is positive
    if (fadeRange <= 0) return;

    // Calculate the new opacity value based on the scroll position
    const opacity = Math.max(0, Math.min(1, fadeRange / rect.height));

    // Apply the calculated opacity to the element
    element.style.opacity = opacity;
  }

  // Listen to scroll events
  window.addEventListener('scroll', updateOpacity);

  // Trigger the initial opacity update
  updateOpacity();
}
