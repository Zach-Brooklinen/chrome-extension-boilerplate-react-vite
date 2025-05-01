function checkCookie(cookieName) {
  return document.cookie.indexOf(cookieName + '=') > -1;
}

function getStringBetween(str, start, end) {
  const result = str.match(new RegExp(start + '(.*)' + end));

  return result[1];
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //let all cookies set in this function expire after 30 days
  let expires = '';
  const date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  expires = '; expires=' + date.toUTCString();
  if (request.context) {
    switch (true) {
      case request.context == 'overlayGrid':
        const overlayGrid = document.querySelector('.overlay-grid');
        if (request.checked) {
          document.cookie = `_bl_chrome-extension_grid=true; expires=${expires}; path=/;`;
          overlayGrid.style.display = 'grid';
        } else {
          document.cookie = `_bl_chrome-extension_grid=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          overlayGrid.style.display = 'none';
        }

        break;
      case request.context == 'previewBar':
        const previewBar = document
          .querySelector('#chrome-extension-boilerplate-react-vite-content-view-root')
          .shadowRoot.querySelector('#themePreviewBar');
        if (request.checked) {
          document.cookie = `_bl_chrome-extension_preview-bar=true; expires=${expires}; path=/;`;
          previewBar.style.display = 'initial';
        } else {
          document.cookie = `_bl_chrome-extension_preview-bar=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          previewBar.style.display = 'none';
        }
        break;
      default:
        break;
    }
  } else if (request.cookie) {
    document.cookie = `${request.cookie}=true${expires}; path=/`;
    //refresh page after cookie is set
    location.reload();
  } else if (request.loading) {
    const promoJSON = JSON.parse(
      `{${getStringBetween(document.querySelector('#defaultData').textContent, 'window.Brooklinen.promo = {', '};')}}`,
    );
    sendResponse({
      overlayGrid: checkCookie('_bl_chrome-extension_grid'),
      previewBar: checkCookie('_bl_chrome-extension_preview-bar'),
      promoObject: promoJSON,
    });
  } else if (request.clearCookies) {
    const cookieNames = document.cookie.split(/=[^;]*(?:;\s*|$)/);
    // Remove any that match the pattern
    for (let i = 0; i < cookieNames.length; i++) {
      if (/^_bl_dev__/.test(cookieNames[i])) {
        document.cookie = cookieNames[i] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    }
    location.reload();
  }
});
