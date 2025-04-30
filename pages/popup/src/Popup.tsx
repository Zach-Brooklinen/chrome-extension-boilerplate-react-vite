import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { ToggleButton } from '@extension/ui';

const notificationOptions = {
  type: 'basic',
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const Popup = () => {
  const openConfluencePage = () =>
    chrome.tabs.create({
      url: 'https://brooklinen.atlassian.net/wiki/spaces/BO2/pages/2163802114/Brooklinen+Developer+Chrome+Extension',
    });

  const toggleValue = async e => {
    e.preventDefault();
    console.log(e.target.checked, e.target.name, 'target');
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    console.log(tab);
    sessionStorage.setItem(e.target.name, e.target.checked);
    console.log(sessionStorage, 'sessionStorage');
    if (e.target.checked) e.target.checked = false;
    else e.target.checked = true;
    await chrome.tabs.sendMessage(tab.id, {
      context: e.target.name,
      checked: e.target.checked,
    });
  };

  return (
    <div id="brooklinenPopup" className="bg-[#fdfaf8] text-[#283455] px-5">
      <button onClick={openConfluencePage}>Open Confluence Page!</button>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" name="overlayGrid" onClick={e => toggleValue(e)} className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#283455] dark:peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-[#283455]">Show Overlay Grid</span>
      </label>
      <br />

      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" name="previewBar" onClick={e => toggleValue(e)} className="sr-only peer" checked />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#283455] dark:peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-[#283455] dark:text-gray-300">
          Show Preview Bar {sessionStorage.getItem('previewBar')}{' '}
        </span>
      </label>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
