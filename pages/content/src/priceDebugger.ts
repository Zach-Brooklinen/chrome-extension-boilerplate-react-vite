let enabled = false;

export function setPriceDebuggerEnabled(value: boolean, pricePopup: HTMLElement) {
  enabled = value;
  if (!value) pricePopup.style.display = 'none';
}

export function initPriceDebugger(getPromo: () => unknown): HTMLElement {
  const pricePopup = document.createElement('div');
  pricePopup.style.cssText =
    'position:fixed;background:#fff;color:#283455;padding:8px 12px;border:1px solid #283455;border-radius:6px;font-size:12px;pointer-events:auto;z-index:2147483647;display:none;line-height:1.6;';
  document.body.appendChild(pricePopup);

  document.addEventListener('mouseover', e => {
    if (!enabled) return;
    const el = (e.target as Element).closest('.Price [data-prices]');
    if (!el) return;
    const data = JSON.parse(el.getAttribute('data-prices') ?? '{}');
    const promo = getPromo() as any;
    const tags = [...data.tags];
    let swdAmount, bundleAmount, compareAtAmount;

    if (promo?.discounts?.swd?.enabled == true && data?.tags?.length > 0) {
      swdAmount = tags.includes('Discount Codes: Allow') ? promo?.discounts?.swd?.amount : 0;
    }

    if (data?.tags?.length > 0) {
      if (tags.includes('Product Bundle')) {
        bundleAmount = parseInt(tags.find(tag => tag.includes('Discount Amount:'))?.split(':')?.[1]);
      }
      if (tags.includes('Active Last Call')) {
        compareAtAmount = parseInt(tags.find(tag => tag.includes('Discount Amount:'))?.split(':')?.[1]);
      }
    }

    let productId;
    if (data.item.id) {
      productId =
        typeof data.item.id == 'number' ? data.item.id : data?.item?.id?.replace('gid://shopify/Product/', '');
    }

    const priceValues = Object.values(data.prices ?? {})
      .map(Number)
      .filter(v => !isNaN(v) && v > 0);

    const basePrice = priceValues.length ? Math.max(...priceValues) / 100 : 0;

    const discounts = [swdAmount, bundleAmount, compareAtAmount].filter(
      v => typeof v === 'number' && !isNaN(v),
    ) as number[];
    const totalDiscountPercentage = +((1 - discounts.reduce((acc, d) => acc * (1 - d / 100), 1)) * 100).toFixed(2);

    console.log(discounts, 'discounts');
    let runningPrice = basePrice;
    const breakdownRows = discounts
      .map(discount => {
        const discountAmount = runningPrice * (discount / 100);
        const priceAfter = runningPrice - discountAmount;
        const row = `<div>$${runningPrice.toFixed(2)} − ${discount}% ($${discountAmount.toFixed(2)}) = <span class="t5">$${priceAfter.toFixed(2)}</span></div>`;
        runningPrice = priceAfter;
        return row;
      })
      .join('');

    const shopifyUrl = `https://admin.shopify.com/store/brooklinen2/products/${productId}`;
    const acfUrl = `https://admin.shopify.com/store/brooklinen2/apps/accentuate/app/edit?scope=product&id=${productId}`;
    pricePopup.innerHTML = `
  <div style="position:absolute;right:8px;display:flex;justify-content:flex-end;"><span id="price-debugger-close" style="cursor:pointer;font-size:14px;line-height:1;padding:0 2px;">✕</span></div>
  <div class="p6">
  <div>
  <span class="t5">Base Prices</span> <hr/>
  <div>
  <span class="p6"><a href="${acfUrl}" target="_blank" data-color="night-sky-dark">From Price (ACF): </a></span>${data.prices?.fromPrice ?? '—'}
  </div>
  <div>
  <span class="p6"><a href="${shopifyUrl}" target="_blank" data-color="night-sky-dark">Lowest Priced Variant: </a></span>${data.prices?.minVariantPrice ?? '—'}
  </div>
  <div><span class="p6"><a href="${shopifyUrl}" target="_blank" data-color="night-sky-dark">Base Shopify Price: </a></span>${data.prices?.variantPrice ?? '—'}</div>
  <div><span class="p6"><a href="${shopifyUrl}" target="_blank" data-color="night-sky-dark">Compare Price:</a></span> ${data.prices?.fromComparePrice ?? '—'}</div>
  </div><br/>
  <div class="p6">
  <span class="t5">Discounts</span>
  <hr/>
  <div>
  Compare At Discount: <span class="t5">${compareAtAmount ? compareAtAmount + '%' : '-'}</span><br/>
  <span style="font-style: italic">Includes TPR / Category / Last Call discounts</span>
  </div>
  <div>
  Sitewide Discount:  <span class="t5">${swdAmount ? swdAmount + '%' : '-'}</span>
  </div>
  <div>
  Bundle Discount:  <span class="t5">${bundleAmount ? bundleAmount + '%' : '-'}</span>
  </div>
  <div>
  Total Discount:  <span class="t5">${discounts.length ? totalDiscountPercentage + '%' : '-'}</span>
  </div>
  <br/>
  <div>
  <span class="t5">Price Breakdown</span> <hr/>
  <div>Highest Base Price: <span class="t5">$${basePrice}</span></div>
  ${breakdownRows}
  ${discounts.length ? `<div><span class="t5">Final: $${runningPrice.toFixed(2)}</span></div>` : ''}
  </div>
  </div>
  `;
    pricePopup.querySelector('#price-debugger-close')?.addEventListener('click', () => {
      pricePopup.style.display = 'none';
    });

    const rect = el.getBoundingClientRect();
    pricePopup.style.display = 'block';
    const popupHeight = pricePopup.offsetHeight;
    pricePopup.style.left = rect.left + 'px';
    pricePopup.style.top = rect.top - popupHeight - 8 + 'px';
  });

  pricePopup.addEventListener('mouseleave', () => {
    pricePopup.style.display = 'none';
  });

  return pricePopup;
}
