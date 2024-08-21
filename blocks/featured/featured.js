import { div, ul, li } from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {

  console.log(block)
  // check if block has class video
  if (block.classList.contains('video')) {
    const videoPath = block.querySelector('a').href;
    console.log(videoPath);
  }

  const content = block.querySelector('div > div:nth-of-type(2) > div');

  const img = block.querySelector('img');
  const imgOpt = createOptimizedPicture(img.src, 'alt', true, [{ width: '3000px' }]);

  const featured = div({ class: 'featured' },
    content,
  );


  block.replaceWith(imgOpt);
  block.append(featured);
}
