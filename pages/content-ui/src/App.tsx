import { useEffect, useState } from 'react';
/*
to do: 
- grid toggle
- clear cookie button

*/

function checkCookie(cookieName) {
  return document.cookie.indexOf(cookieName + '=') > -1;
}

export default function App() {
  useEffect(() => {
    const overlayGridContainer = document.createElement('div');
    overlayGridContainer.innerHTML = `<div class='overlay-grid' ${checkCookie('_bl_chrome-extension_grid') ? '' : "style='display:none'"} >
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
          <div class='overlay-grid__item'></div>
        </div>`;
    document.body.style.position = 'relative';
    document.body.prepend(overlayGridContainer);
  }, []);

  const themeJSON = JSON.parse(document.querySelector('#OnlineStorePreviewBarNextData')?.textContent);
  let adminURL, adminID, adminScope;
  if (themeJSON?.pageSpecificData?.resource) {
    adminURL = themeJSON.pageSpecificData.resource.url;
    adminID = themeJSON.pageSpecificData.resource.id;
    adminScope = themeJSON.pageSpecificData.resource.type.toLowerCase();
  }

  let url = new URL(window.location.href);
  url.searchParams.delete('preview_theme_id');
  url.searchParams.delete('blCookieSet');
  url.searchParams.append('preview_theme_id', themeJSON.theme.id);
  getCookies('_bl_dev__').forEach(cookie => {
    url.searchParams.append('blCookieSet', cookie);
  });

  function getCookies(match) {
    let cookieParts = document.cookie.split(';'),
      cookies = {};

    for (let i = 0; i < cookieParts.length; i++) {
      let name_value = cookieParts[i],
        equals_pos = name_value.indexOf('='),
        name = name_value.slice(0, equals_pos).trim(),
        value = name_value.slice(equals_pos + 1);
      cookies[name] = value;
    }
    return Object.keys(cookies).filter(val => val.includes(match));
  }

  const [buttonText, setButtonText] = useState('Copy Preview Theme URL');

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setButtonText('Preview Theme Copied!');
    setTimeout(() => {
      setButtonText('Copy Preview Theme URL');
    }, 1000);
  }

  function openTab(link) {
    window.open(link, '_blank');
  }

  function Button({ text, callback, url }) {
    if (!url && !callback) {
      return null;
    } else if (!url && callback) {
      return (
        <button className="text-[10px] text-white underline underline-offset-4 mr-4" onClick={callback}>
          {text}
        </button>
      );
    } else {
      return (
        <button
          className="text-[10px] text-white underline underline-offset-4 mr-4"
          onClick={() => {
            openTab(url);
          }}>
          {text}
        </button>
      );
    }
  }

  function hidePreviewBar() {
    document.cookie = `_bl_chrome-extension_preview-bar=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document
      .querySelector('#chrome-extension-boilerplate-react-vite-content-view-root')
      .shadowRoot.querySelector('#themePreviewBar').style.display = 'none';
  }
  return (
    <div
      id="themePreviewBar"
      className="fixed bottom-0 px-10 py-2 transition-colors bg-[#283455c5] hover:bg-[#283455] rounded-r-[20px] animate-fade"
      style={{ zIndex: 2147483648, display: checkCookie('_bl_chrome-extension_preview-bar') ? '' : 'none' }}>
      <div className="text-[12px] text-white relative">
        Viewing {!themeJSON.theme.isDraft ? 'live' : ''} theme:{' '}
        <span className="font-bold">{themeJSON.theme.name}</span>
        <svg
          className="absolute cursor-pointer"
          onClick={() => hidePreviewBar()}
          style={{ right: '-25px', top: '3px' }}
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0.464467 7.53553C0.171573 7.24264 0.171573 6.76777 0.464467 6.47487L6.47487 0.464466C6.76777 0.171572 7.24264 0.171572 7.53553 0.464466C7.82843 0.757359 7.82843 1.23223 7.53553 1.52513L1.52513 7.53553C1.23223 7.82843 0.75736 7.82843 0.464467 7.53553Z"
            fill="white"
          />
          <path
            d="M7.53553 7.53553C7.24264 7.82843 6.76777 7.82843 6.47487 7.53553L0.464467 1.52513C0.171573 1.23223 0.171573 0.757359 0.464467 0.464466C0.75736 0.171572 1.23223 0.171572 1.52513 0.464466L7.53553 6.47487C7.82843 6.76777 7.82843 7.24264 7.53553 7.53553Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="flex">
        <Button
          text={buttonText}
          callback={() => {
            copyToClipboard(url.href);
          }}
        />
        <Button text={`Open in ${adminScope?.replace(/^./, adminScope[0].toUpperCase())} Admin`} url={adminURL || ''} />
        <Button
          text={'Open in ACF'}
          url={
            adminID
              ? `https://admin.shopify.com/store/brooklinen2/apps/accentuate/app/edit?scope=${adminScope}&id=${adminID}`
              : ''
          }
        />
      </div>
    </div>
  );
}
