import { ShopeeProductData, ShopVouchersEntity } from "./product.type";
import { ItemsEntity, ShopeeSearchResult } from "./search.type";
import { sleep } from "./utils";

var ready = false;

chrome.action.onClicked.addListener((tab) => {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id || -1, { type: "TOGGLE" });
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.ready) ready = true;
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (tab.url) {
      const { shopid, itemid } = getIds(tab.url);
      if (itemid && shopid) {
        const productData = await getProductData(itemid, shopid);
        const bestVoucher = getBestDiscount(
          productData.data.price_min,
          productData.data.shop_vouchers || []
        );
        if (bestVoucher) {
          productData.data.price_min =
            productData.data.price_min -
            bestVoucher.highestVoucherDiscountValue;
        }
        const otherProducts = await searchForOtherProducts(
          productData.data.name
        );
        otherProducts.items = otherProducts.items?.filter(
          (i) =>
            (i.item_basic.voucher_info
              ? i.item_basic.price_min -
                parseDiscount(
                  i.item_basic.price_min,
                  i.item_basic.voucher_info.label
                )
              : i.item_basic.price_min) < productData.data.price_min &&
            i.item_basic.sold > 0 &&
            i.itemid.toString() != itemid
        );
        otherProducts.items?.forEach(
          (i) =>
            (i.item_basic.price_min =
              i.item_basic.price_min -
              parseDiscount(
                i.item_basic.price_min,
                i.item_basic.voucher_info?.label || ""
              ))
        );
        const rankedItems = otherProducts.items
          ?.filter(
            (i) => i.item_basic.price_min / productData.data.price_min > 0.1
          )
          ?.slice(0, 10)
          .sort((a, b) => a.item_basic.price_min - b.item_basic.price_min);
        sendMessageToContent(tab, rankedItems || []);
      }
    }
  }
});

async function sendMessageToContent(
  tab: chrome.tabs.Tab,
  rankedItems: ItemsEntity[]
) {
  while (!ready) await sleep(1000);
  chrome.tabs.sendMessage(tab.id || -1, {
    type: "SUGGESTIONS",
    items: rankedItems,
  });
}

function getBestDiscount(currentPrice: number, vouchers: ShopVouchersEntity[]) {
  if (!vouchers || vouchers.length === 0) return undefined;
  const validVouchers = vouchers.filter(
    (i) =>
      i.end_time > new Date().getTime() / 1000 && i.min_spend < currentPrice
  );
  var highestVoucher!: ShopVouchersEntity;
  var highestVoucherDiscountValue: number = 0;
  validVouchers.forEach((voucher) => {
    var discountValue =
      voucher.discount_value || voucher.discount_percentage * currentPrice || 0;
    if (voucher.discount_cap && discountValue > voucher.discount_cap)
      discountValue = voucher.discount_cap;
    if (discountValue > highestVoucherDiscountValue) {
      highestVoucher = voucher;
      highestVoucherDiscountValue = discountValue;
    }
  });
  return { highestVoucher, highestVoucherDiscountValue };
}

function parseDiscount(itemPrice: number, voucherLabel: string) {
  const discount = voucherLabel.split(" ")?.[0];
  var discountAmount = 0;
  if (discount.includes("%")) {
    discountAmount = itemPrice * +discount.replace(/%/g, "");
  } else if (discount.includes("₱")) {
    discountAmount = +discount.replace(/₱/g, "") * 100000;
    if (discount.includes("K")) {
      discountAmount = +discount.replace(/[₱K]/g, "") * 100000 * 1000;
    }
  }
  return discountAmount || 0;
}

function getIds(url: string) {
  url = url.split("?")[0];
  var [shopid, itemid] = url.split("/").slice(4);
  if (!shopid || !itemid) {
    [shopid, itemid] = url.split(".").slice(-2);
  }
  if (+shopid > 0) return { shopid, itemid };
  return { shopid: undefined, itemid: undefined };
}

async function getProductData(
  itemid: string,
  shopid: string
): Promise<ShopeeProductData> {
  return (
    await fetch(
      `https://shopee.ph/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`,
      {
        method: "GET",
        mode: "cors",
      }
    )
  ).json();
}

async function searchForOtherProducts(
  searchKeyword: string
): Promise<ShopeeSearchResult> {
  return (
    await fetch(
      `https://shopee.ph/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(
        searchKeyword
      )}&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
      {
        method: "GET",
        mode: "cors",
      }
    )
  ).json();
}
