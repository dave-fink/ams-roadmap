/* eslint-disable no-use-before-define, object-curly-newline, function-paren-newline */
import { div, dialog, button, span } from '../../scripts/dom-helpers.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  buildBlock, decorateBlock, loadBlock, loadCSS,
} from '../../scripts/aem.js';

/*
  This is not a traditional block, so there is no decorate function.
  Instead, links to a /modals/ path are automatically transformed into a modal.
  Other blocks can also use the createModal() and openModal() functions.
*/

// todo: p1 support video block
// todo: p6 add prev/next buttons


export async function createModal(fragment) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const $dialog = dialog();

  const dialogContent = div({ class: 'modal-content' },
    fragment.querySelector('.default-content-wrapper'),
  );

  const closeButton = button({ class: 'close-button', 'aria-label': 'Close', type: 'button' }, span({ class: 'icon icon-close' }));
  closeButton.addEventListener('click', () => closeDialog());
  $dialog.append(closeButton, dialogContent);

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);

  function closeDialog() {
    document.body.classList.add('modal-close');
    setTimeout(() => {
      document.body.classList.remove('modal-open', 'modal-close');
      block.remove();
    }, 1600);
  }

  // close on click outside the dialog
  $dialog.addEventListener('click', (e) => {
    const { left, right, top, bottom } = $dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) closeDialog();
  });


  block.innerHTML = '';
  block.append($dialog);

  return {
    block,
    showModal: () => {
      $dialog.showModal();
      // reset scroll position
      setTimeout(() => { dialogContent.scrollTop = 0; }, 0);
      document.body.classList.add('modal-open');
    },
  };
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment);
  showModal();
}
