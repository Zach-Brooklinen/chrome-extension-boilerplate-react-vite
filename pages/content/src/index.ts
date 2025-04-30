import { sampleFunction } from '@src/sampleFunction';

console.log('content script loaded');

// Shows how to call a function defined in another module
sampleFunction();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  console.log(request);
  console.log('i hear you!!');
  switch (true) {
    case request.context == 'overlayGrid':
      const overlayGrid = document.querySelector('.overlay-grid');
      overlayGrid.style.display = request.checked ? 'grid' : 'none';
      // code block
      break;
    case request.context == 'previewBar':
      const previewBar = document
        .querySelector('#chrome-extension-boilerplate-react-vite-content-view-root')
        .shadowRoot.querySelector('#themePreviewBar');
      console.log(previewBar, document.firstElementChild);
      previewBar.style.display = request.checked ? 'initial' : 'none';
      // code block
      break;
    default:
      break;
  }
});
