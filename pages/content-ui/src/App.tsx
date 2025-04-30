import { useEffect, useState } from 'react';
/*
to do: 
- grid toggle
- clear cookie button

*/
export default function App() {
  useEffect(() => {
    const overlayGridContainer = document.createElement('div');
    overlayGridContainer.innerHTML = `<div class='overlay-grid' style='display:none' >
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

  return (
    <div
      id="themePreviewBar"
      className="fixed bottom-0 px-10 py-2 transition-colors bg-[#283455c5] hover:bg-[#283455] rounded-r-[20px]"
      style={{ zIndex: 2147483648 }}>
      <div className="text-[12px] text-white">
        Viewing {!themeJSON.theme.isDraft ? 'live' : ''} theme:{' '}
        <span className="font-bold">{themeJSON.theme.name}</span>
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
