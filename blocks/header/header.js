/* eslint-disable no-use-before-define, object-curly-newline, function-paren-newline */
import { div, span, nav, form, input, a, img, li, ul } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {

  const $homeBtn = a({ class: 'home', href: `/` },
    img({ src: '/icons/adobe-logo.svg', width: 27, height: 27, alt: 'Adobe' }),
    span('Adobe Managed Services'),
  );

  const $header = div(
    $homeBtn,
  );

  block.replaceWith($header);
}
