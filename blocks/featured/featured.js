import { div, ul, li } from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // check if block has class video
  if (block.classList.contains('video')) {
    const videoPath = block.querySelector('a').href;
    console.log(videoPath);
  }
  const img = block.querySelector('img');
  const imgOpt = createOptimizedPicture(img.src, 'alt', true, [{ width: '3000px' }]);
  block.replaceWith(imgOpt);
}
