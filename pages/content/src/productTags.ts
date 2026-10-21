let enabled = false;

export function setProductTagsEnabled(value: boolean, tagsPopup: HTMLElement) {
  enabled = value;
  if (!value) tagsPopup.style.display = 'none';
}

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function initProductTags(): HTMLElement {
  const tagsPopup = document.createElement('div');
  tagsPopup.style.cssText =
    'position:fixed;background:#fff;color:#283455;padding:8px 12px;border:1px solid #283455;border-radius:6px;font-size:12px;pointer-events:auto;z-index:2147483647;display:none;line-height:1.6;max-width:360px;max-height:400px;overflow-y:auto;';
  document.body.appendChild(tagsPopup);

  document.addEventListener('mouseover', e => {
    if (!enabled) return;
    const el = (e.target as Element).closest('.Price [data-prices]');
    if (!el) return;
    const data = JSON.parse(el.getAttribute('data-prices') ?? '{}');
    const tags: string[] = Array.isArray(data?.tags) ? [...data.tags].sort((a, b) => a.localeCompare(b)) : [];

    let productId;
    if (data?.item?.id) {
      productId = typeof data.item.id == 'number' ? data.item.id : data.item.id.replace('gid://shopify/Product/', '');
    }

    const shopifyUrl = `https://admin.shopify.com/store/brooklinen2/products/${productId}`;
    const tagRows = tags.length
      ? tags.map(tag => `<li>${escapeHtml(tag)}</li>`).join('')
      : '<li style="font-style: italic">No tags</li>';

    tagsPopup.innerHTML = `
  <div style="position:absolute;right:8px;display:flex;justify-content:flex-end;"><span id="product-tags-close" style="cursor:pointer;font-size:14px;line-height:1;padding:0 2px;">✕</span></div>
  <div class="p6">
  <span class="t5">${productId ? `<a href="${shopifyUrl}" target="_blank" data-color="night-sky-dark">Product Tags</a>` : 'Product Tags'} (${tags.length})</span> <hr/>
  <ul style="list-style:disc;padding-left:16px;margin:0;">${tagRows}</ul>
  </div>
  `;
    tagsPopup.querySelector('#product-tags-close')?.addEventListener('click', () => {
      tagsPopup.style.display = 'none';
    });

    const rect = el.getBoundingClientRect();
    tagsPopup.style.display = 'block';
    const popupHeight = tagsPopup.offsetHeight;
    tagsPopup.style.left = rect.left + 'px';
    tagsPopup.style.top = Math.max(8, rect.top - popupHeight - 8) + 'px';
  });

  tagsPopup.addEventListener('mouseleave', () => {
    tagsPopup.style.display = 'none';
  });

  return tagsPopup;
}
