import { initPriceDebugger, setPriceDebuggerEnabled } from './priceDebugger';

function checkCookie(cookieName) {
  return document.cookie.indexOf(cookieName + '=') > -1;
}

function getStringBetween(str, start, end) {
  const result = str.match(new RegExp(start + '(.*)' + end));

  return result[1];
}

const audienceLibrary = {
  '2644784': 'Paid Social Prospects',
  '2645222': 'Prospects (non-email and non-paid social)',
  '2645208': 'All Prospects',
  '2645188': 'NumOrders=0',
  '2645189': 'Email Prospects',
  '2644785': 'utm_medium=email',
  '2644783': 'utm_campaign=AWR_',
  '2644782': 'utm_campaign=PROS_',
  '2644778': 'utm_medium=paid-social',
  '2099609': 'Other Audience (combo)',
  '2532675': 'Purchasers',
  '2532880': 'High Intent, Non-Purchaser',
  '2532878': 'Medium Intent, Non-Purchaser',
  '2532874': 'Low Intent, Non-Purchaser',
  '2532901': 'Non-Purchasers',
  '2356145': 'Curious',
  '2356144': 'Interested',
  '2356143': 'Focused',
  '2356142': 'Satisfied',
  '2091451': '0 Sessions in Last 30 Days',
  '2091453': '1+ Sessions in the Last 30 Days',
  '2099467': 'Upper Funnel - Paid Social (combo)',
  '2098607': 'Lower Funnel - Internal',
  '2091474': 'Informed Prospects (combo)',
  '2091448': 'Engaged Prospects (combo)',
  '2029865': 'Customer Audience',
  '2064995': 'Upper Funnel - Direct Mail',
  '2064991': 'Upper Funnel - Print',
  '2087258': 'Lower Funnel - Loyalty',
  '2099817': 'Lower Funnel - Organic Social (Referrer Wildcard)',
  '2099460': 'Lower Funnel - Organic Search (Referrer Wildcard)',
  '2087255': 'Lower Funnel - SMS',
  '2080689': 'Upper funnel - Influencer (combo)',
  '2080688': 'Upper Funnel - Influencer Raw UTM Source',
  '2087254': 'Lower Funnel - Email',
  '2087527': 'Lower Funnel - Brand (Wildcard UTM Campaign)',
  '2099905': 'Lower Funnel - Organic Social (combo)',
  '2098479': 'Inquisitive Prospects (combo)',
  '2099906': 'Lower Funnel - Tracking Page',
  '2099901': 'Lower Funnel - Organic Social Raw Medium',
  '2087274': 'Upper Funnel - Paid Social Raw UTM Medium',
  '2087524': 'Upper Funnel - Non Brand (Wildcard UTM Campaign)',
  '2087496': 'Upper Funnel - Paid Social (Wildcards)',
  '2029827': 'Inquisitive Prospect - Paid Social',
  '2064990': 'Upper Funnel - Display',
  '2094075': 'Lower Funnel - Direct',
  '2029838': 'Lower Funnel - Affiliate',
  '2064980': 'Upper Funnel - Influencer Raw UTM Medium',
  '880705': 'Has Not Purchased',
  '360432': 'Has Purchased',
  '739217': 'Has Purchased 2 times',
  '1048532': 'Visited Checkout',
  '1044816': 'Visited Cart',
  '1044815': 'Visited PLP',
  '1044822': 'Visited PDP',
  '368257': 'Newsletter Subscribers',
  '360428': 'Direct Traffic',
  '360429': 'Search Traffic',
  '360430': 'Paid Search Traffic',
  '360431': 'Referral Traffic',
};

//Fire message to browser window indicating extension is ready

window.postMessage(
  {
    type: 'BROOKLINEN_EXTENSION_READY',
  },
  '*',
);

let promo: unknown;
const pricePopup = initPriceDebugger(() => promo);

window.addEventListener('message', event => {
  if (event.source !== window || !event.data.type) return;
  if (event.data.type === 'BROOKLINEN_DY') {
    const audienceJSON = JSON.parse(document?.querySelector('#dy-audiences')?.textContent ?? 'null');
    event.data.audiences =
      audienceJSON?.audiences?.map((id: string) => audienceLibrary[id as keyof typeof audienceLibrary]) ?? [];
    promo = event.data.payload;
    chrome.storage.local.set({ dyData: event.data });
    chrome.runtime.sendMessage(event.data);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //let all cookies set in this function expire after 30 days
  const date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = `_bl_chrome_extension_id=${sender.id}; expires=${expires}; path=/;`;
  if (request.context) {
    switch (request.context) {
      case 'overlayGrid': {
        const overlayGrid = document.querySelector('.overlay-grid') as HTMLElement | null;
        if (request.checked) {
          document.cookie = `_bl_chrome-extension_grid=true; expires=${expires}; path=/;`;
          if (overlayGrid) overlayGrid.style.display = 'grid';
        } else {
          document.cookie = `_bl_chrome-extension_grid=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          if (overlayGrid) overlayGrid.style.display = 'none';
        }
        break;
      }
      case 'priceDebugger': {
        if (request.checked) {
          document.cookie = `_bl_chrome-extension_price-debugger=true; expires=${expires}; path=/;`;
          setPriceDebuggerEnabled(true, pricePopup);
        } else {
          document.cookie = `_bl_chrome-extension_price-debugger=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          setPriceDebuggerEnabled(false, pricePopup);
        }
        break;
      }
      case 'previewBar': {
        const previewBar = document
          .querySelector('#chrome-extension-boilerplate-react-vite-content-view-root')
          ?.shadowRoot?.querySelector('#themePreviewBar') as HTMLElement | null;
        if (request.checked) {
          document.cookie = `_bl_chrome-extension_preview-bar=true; expires=${expires}; path=/;`;
          if (previewBar) previewBar.style.display = 'initial';
        } else {
          document.cookie = `_bl_chrome-extension_preview-bar=true; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          if (previewBar) previewBar.style.display = 'none';
        }
        break;
      }
      default:
        break;
    }
  } else if (request.cookie) {
    document.cookie = `${request.cookie}=true${expires}; path=/`;
    //refresh page after cookie is set
    location.reload();
  } else if (request.loading) {
    const promoJSON = JSON.parse(
      `{${getStringBetween(document.querySelector('#defaultData')?.textContent ?? '', 'window.Brooklinen.promo = {', '};')}}`,
    );
    sendResponse({
      overlayGrid: checkCookie('_bl_chrome-extension_grid'),
      previewBar: checkCookie('_bl_chrome-extension_preview-bar'),
      priceDebugger: checkCookie('_bl_chrome-extension_price-debugger'),
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
