import { div } from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { scrollFadeOut } from '../../scripts/animations.js';


export default function decorate(block) {

  // check if block has class video
  if (block.classList.contains('video')) {
    const videoPath = block.querySelector('a').href;
    console.log(videoPath);
  }

  const $img = createOptimizedPicture(block.querySelector('img').src, 'alt', true, [{ width: '1400px' }]);
  const $content = block.querySelector('div > div:nth-of-type(2) > div');

  const $featured = div({ class: 'featured' },
    $img,
    div({ class: 'content' }, $content),
  );

  block.replaceWith($featured);

 // add class loaded after 300ms to $featured
  setTimeout(() => {
    $featured.classList.add('loaded');
    scrollFadeOut($content, -120);
  }, 400);



}
