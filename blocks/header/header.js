/* eslint-disable no-use-before-define, object-curly-newline, function-paren-newline */
import { div, span, a, img } from '../../scripts/dom-helpers.js';

function animateHeader($hdr) {

  const featured = document.querySelector('.featured');
  if (!featured) return;

  let lastKnownScrollPosition = 0;
  let ticking = false;
  let bgTransitionPoint = 500;
  let fontTransitionPoint = 250;

  const $featured = document.querySelector('.featured');
  if ($featured) {
    const featuredHeight = $featured.clientHeight;
    bgTransitionPoint = featuredHeight;
    fontTransitionPoint = featuredHeight / 2;
  }

  function updateStyles(scrollPosition) {
    const backgroundTransitionFactor = Math.min(scrollPosition / bgTransitionPoint, 1);
    const fontTransitionFactor = Math.min(scrollPosition / fontTransitionPoint, 1);
    const bgColor = `rgba(255, 255, 255, ${backgroundTransitionFactor})`;
    let fontColor;
    if (scrollPosition === 0) {
      fontColor = 'white';
    } else {
      const fontColorValue = 255 - Math.round(255 * fontTransitionFactor);
      fontColor = `rgb(${fontColorValue}, ${fontColorValue}, ${fontColorValue})`;
    }
    $hdr.style.backgroundColor = bgColor;
    $hdr.style.color = fontColor;
  }

  updateStyles(window.scrollY);

  window.addEventListener('scroll', function() {
    lastKnownScrollPosition = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateStyles(lastKnownScrollPosition);
        ticking = false;
      });
      ticking = true;
    }
  });
}


export default async function decorate(block) {

  const $homeBtn = a({ class: 'home', href: `/` },
    img({ src: '/icons/adobe-logo.svg', width: 27, height: 27, alt: 'Adobe' }),
    span('Adobe Managed Services'),
  );

  const $searchBtn = div({ class: 'search' });
  $searchBtn.innerHTML = `
    <svg fill="currentColor" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.9,15.5c2.4-3.2,2.2-7.7-0.7-10.6c-3.1-3.1-8.1-3.1-11.3,0c-3.1,3.2-3.1,8.3,0,11.4
        c2.9,2.9,7.5,3.1,10.6,0.6c0,0.1,0,0.1,0,0.1l4.2,4.2c0.5,0.4,1.1,0.4,1.5,0c0.4-0.4,0.4-1,0-1.4L16.9,15.5
        C16.9,15.5,16.9,15.5,16.9,15.5L16.9,15.5z M14.8,6.3c2.3,2.3,2.3,6.1,0,8.5c-2.3,2.3-6.1,2.3-8.5,0C4,12.5,4,8.7,6.3,6.3
        C8.7,4,12.5,4,14.8,6.3z"/>
    </svg>
  `;

  const $header = div(
    $homeBtn,
    $searchBtn,
  );

  block.replaceWith($header);


  animateHeader(document.querySelector('header'));
}
