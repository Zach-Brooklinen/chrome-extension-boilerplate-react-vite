import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';

const Popup = () => {
  const openPage = page =>
    chrome.tabs.create({
      url: page,
    });

  //toggle value
  const toggleValue = async e => {
    e.preventDefault();
    console.log(e.target.checked, e.target.name, 'target');
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    if (e.target.checked) e.target.checked = false;
    else e.target.checked = true;
    await chrome.tabs.sendMessage(tab.id, {
      context: e.target.name,
      checked: e.target.checked,
    });
  };

  //add cookie
  const handleSubmit = async e => {
    e.preventDefault();
    const cookie = e.target[0].value;

    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    await chrome.tabs.sendMessage(tab.id, {
      cookie: cookie,
    });
  };

  //use document cookies on the current tab to determine if toggles should be pre-checked
  const checkCookies = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    console.log(tab);

    chrome.windows.get(tab.windowId, function (win) {
      console.log('window', win); // THIS IS THE WINDOW OBJECT
    });
    await chrome.tabs
      .sendMessage(tab.id, {
        loading: true,
      })
      .then(res => {
        document.querySelector('[name="overlayGrid"]').checked = res.overlayGrid;
        document.querySelector('[name="previewBar"]').checked = res.previewBar;
        //document.querySelector('#promoVersion').innerHTML = res.promoObject.version;
      });
  };

  checkCookies();

  const clearDevCookies = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    await chrome.tabs.sendMessage(tab.id, {
      clearCookies: true,
    });
  };
  return (
    <div id="brooklinenPopup" className="bg-[#fdfaf8] text-[#283455] px-5 animate-fade relative">
      <h2 className="text-[12px] font-bold mb-[5px]">On-Page Toggles</h2>
      <label className="inline-flex items-center cursor-pointer mb-[10px]">
        <input type="checkbox" name="overlayGrid" onClick={e => toggleValue(e)} className="sr-only peer" />
        <div className="scale-75 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#283455] dark:peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-[12px] text-[#283455]">
          Show Overlay Grid {sessionStorage.getItem('overlayGrid')}
        </span>
      </label>

      <label className="inline-flex items-center cursor-pointer mb-[10px]">
        <input type="checkbox" name="previewBar" onClick={e => toggleValue(e)} className="sr-only peer" />
        <div className="scale-75 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#283455] dark:peer-checked:bg-blue-600"></div>{' '}
        <span className="ms-3 text-[12px] text-[#283455] dark:text-gray-300">
          Show Preview Bar {sessionStorage.getItem('previewBar')}
        </span>
      </label>

      <h2 className="text-[12px] font-bold mb-[5px]">Cookies</h2>
      <form onSubmit={e => handleSubmit(e)}>
        <label for="cookieInput" className="mb-2 text-[10px] text-gray-900 sr-only dark:text-white">
          Add _bl_dev__ cookie
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#283455"
              height="20"
              width="20"
              version="1.1"
              id="Layer_1"
              viewBox="0 0 300 300"
              xml:space="preserve">
              <g>
                <g>
                  <g>
                    <path d="M289.181,206.929c-13.5-12.186-18.511-31.366-12.453-48.699c1.453-4.159-0.94-8.686-5.203-9.82     c-27.77-7.387-41.757-38.568-28.893-64.201c2.254-4.492-0.419-9.898-5.348-10.837c-26.521-5.069-42.914-32.288-34.734-58.251     c1.284-4.074-1.059-8.414-5.178-9.57C184.243,1.867,170.626,0,156.893,0C74.445,0,7.368,67.076,7.368,149.524     s67.076,149.524,149.524,149.524c57.835,0,109.142-33.056,133.998-83.129C292.4,212.879,291.701,209.204,289.181,206.929z      M156.893,283.899c-74.095,0-134.374-60.281-134.374-134.374S82.799,15.15,156.893,15.15c9.897,0,19.726,1.078,29.311,3.21     c-5.123,29.433,11.948,57.781,39.41,67.502c-9.727,29.867,5.251,62.735,34.745,74.752c-4.104,19.27,1.49,39.104,14.46,53.365     C251.758,256.098,207.229,283.899,156.893,283.899z" />
                    <path d="M76.388,154.997c-13.068,0-23.7,10.631-23.7,23.701c0,13.067,10.631,23.7,23.7,23.7c13.067,0,23.7-10.631,23.7-23.7     C100.087,165.628,89.456,154.997,76.388,154.997z M76.388,187.247c-4.715,0-8.55-3.835-8.55-8.55s3.835-8.551,8.55-8.551     c4.714,0,8.55,3.836,8.55,8.551S81.102,187.247,76.388,187.247z" />
                    <path d="M173.224,90.655c0-14.9-12.121-27.021-27.02-27.021s-27.021,12.121-27.021,27.021c0,14.898,12.121,27.02,27.021,27.02     C161.104,117.674,173.224,105.553,173.224,90.655z M134.334,90.655c0-6.545,5.325-11.871,11.871-11.871     c6.546,0,11.87,5.325,11.87,11.871s-5.325,11.87-11.87,11.87S134.334,97.199,134.334,90.655z" />
                    <path d="M169.638,187.247c-19.634,0-35.609,15.974-35.609,35.61c0,19.635,15.974,35.61,35.609,35.61     c19.635,0,35.61-15.974,35.61-35.61C205.247,203.221,189.273,187.247,169.638,187.247z M169.638,243.315     c-11.281,0-20.458-9.178-20.458-20.46s9.178-20.46,20.458-20.46c11.281,0,20.46,9.178,20.46,20.46     S180.92,243.315,169.638,243.315z" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <input
            type="cookieInput"
            id="search"
            className="block w-full p-4 ps-10 pr-[95px] text-[12px] text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Cookie Name"
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-[#283455] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Add
          </button>
        </div>
      </form>

      <div className="mt-[10px] mb-[10px]">
        <button
          onClick={() => {
            clearDevCookies();
          }}
          className="w-full text-white end-2.5 bottom-2.5 bg-[#283455] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Clear All Dev Cookies
        </button>
      </div>
      <div className="text-[10px] absolute bottom-[-20px] flex">
        <button
          className="flex mr-[16px]"
          onClick={() =>
            openPage(
              'https://brooklinen.atlassian.net/wiki/spaces/BO2/pages/2163802114/Brooklinen+Developer+Chrome+Extension',
            )
          }>
          <svg
            className="mr-[5px]"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16"
            height="16"
            viewBox="0 -5 256 256"
            version="1.1"
            preserveAspectRatio="xMidYMid">
            <defs>
              <linearGradient x1="99.140087%" y1="112.708084%" x2="33.8589812%" y2="37.7549606%" id="linearGradient-1">
                <stop stop-color="#283455" offset="18%"></stop>
                <stop stop-color="#283455" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="0.92569163%"
                y1="-12.5823074%"
                x2="66.1800713%"
                y2="62.3057471%"
                id="linearGradient-2">
                <stop stop-color="#283455" offset="18%"></stop>
                <stop stop-color="#283455" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g>
              <path
                d="M9.26054484,187.329971 C6.61939782,191.637072 3.65318655,196.634935 1.13393863,200.616972 C-1.12098385,204.42751 0.0895487945,209.341911 3.85635171,211.669157 L56.6792921,244.175582 C58.5334859,245.320393 60.7697695,245.67257 62.8860683,245.153045 C65.0023672,244.633521 66.8213536,243.285826 67.9346417,241.412536 C70.0475593,237.877462 72.7699724,233.285929 75.7361837,228.369333 C96.6621947,193.831256 117.710105,198.057091 155.661356,216.179423 L208.037333,241.087471 C210.020997,242.031639 212.302415,242.132457 214.361632,241.366949 C216.420848,240.601441 218.082405,239.034833 218.967618,237.024168 L244.119464,180.137925 C245.896483,176.075046 244.088336,171.3377 240.056161,169.492071 C229.003977,164.291043 207.021507,153.92962 187.233221,144.380857 C116.044151,109.802148 55.5415672,112.036965 9.26054484,187.329971 Z"
                fill="#283455"></path>
              <path
                d="M246.11505,58.2319428 C248.756197,53.9248415 251.722408,48.9269787 254.241656,44.9449416 C256.496579,41.1344037 255.286046,36.2200025 251.519243,33.8927572 L198.696303,1.38633231 C196.82698,0.127283893 194.518741,-0.298915762 192.323058,0.209558312 C190.127374,0.718032386 188.241461,2.11550922 187.115889,4.06811236 C185.002971,7.60318607 182.280558,12.1947186 179.314347,17.1113153 C158.388336,51.6493918 137.340426,47.4235565 99.3891748,29.3012247 L47.1757299,4.5150757 C45.1920661,3.57090828 42.9106475,3.47008979 40.8514312,4.2355977 C38.7922149,5.00110562 37.1306578,6.56771434 36.2454445,8.57837881 L11.0935983,65.4646223 C9.31657942,69.5275012 11.1247267,74.2648471 15.1569014,76.1104765 C26.2090859,81.3115044 48.1915557,91.6729274 67.9798418,101.22169 C139.331444,135.759766 199.834028,133.443683 246.11505,58.2319428 Z"
                fill="#283455"></path>
            </g>
          </svg>
          <span>Confluence</span>
        </button>
        <button
          className="flex"
          onClick={() => openPage('https://github.com/Zach-Brooklinen/chrome-extension-boilerplate-react-vite')}>
          <svg
            className="mr-[5px]"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            version="1.1">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#283455">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path
                    d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                    id="github-[#142]"></path>
                </g>
              </g>
            </g>
          </svg>
          <span>Github</span>
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
