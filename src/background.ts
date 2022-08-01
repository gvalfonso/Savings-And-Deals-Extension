import { LazadaSearchResult } from "./lazada.types";
import { ShopeeProductData, ShopVouchersEntity } from "./product.type";
import { RecommendedItemsShopeeSearchResult } from "./recommended.type";
import { ItemsEntity, ShopeeSearchResult } from "./search.type";
import { Suggestion } from "./suggestion.type";
import { sleep } from "./utils";

export const settings = {
  iconHidden: false,
};

const suggestions: Record<string, { time: number; items: any[] }> = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "GET_CONFIG":
      sendResponse(settings);
      break;
    default:
      break;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    if (activeTab.url?.includes("shopee.ph")) {
      settings.iconHidden = !settings.iconHidden;
      sendMessageToContent(activeTab.id || -1, {
        type: "TOGGLE",
        iconHidden: settings.iconHidden,
      });
    }
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (tab.url) {
      if (
        suggestions[tab.url] &&
        new Date().getTime() - suggestions[tab.url].time < 60000
      ) {
        sendMessageToContent(tab.id || -1, {
          type: "SUGGESTIONS",
          items: suggestions[tab.url].items || [],
        });
        return;
      }
      var combinedSuggestions: Suggestion[] = [];
      if (tab.url.includes("shopee")) {
        const { shopid, itemid } = getIds(tab.url);
        if (itemid && shopid) {
          sendMessageToContent(tab.id || -1, { type: "LOADING" });
          var productData = await getProductData(itemid, shopid);
          while (!productData.data) {
            productData = await getProductData(itemid, shopid);
            await sleep(5000);
          }
          const bestVoucher = getBestDiscount(
            productData.data.price_min,
            productData.data.shop_vouchers || []
          );
          var targetProduct: Record<string, any> = {
            price: productData.data.price_min,
            name: productData.data.name,
            shopid: productData.data.shopid,
            itemid: productData.data.itemid,
            catid: productData.data.categories?.[0].catid || 0,
          };
          if (bestVoucher) {
            targetProduct = {
              ...targetProduct,
              voucher: bestVoucher.highestVoucherDiscountValue,
              price:
                productData.data.price_min -
                bestVoucher.highestVoucherDiscountValue,
            };
          }
          const shopeeSuggestions = await getShopeeSuggestionsFromInsideShopee(
            targetProduct,
            itemid,
            shopid,
            tab.url
          );
          // const lazadaSuggestions = await getLazadaSuggestionsFromOutside(
          //   targetProduct.name,
          //   targetProduct.price
          // );
          combinedSuggestions = [
            ...shopeeSuggestions,
            // ...lazadaSuggestions,
          ];
          combinedSuggestions = combinedSuggestions.sort(
            (a, b) => b.price - a.price
          );
        } else {
          sendMessageToContent(tab.id || -1, { type: "LOADING" });
        }
      } else if (tab.url.includes("lazada")) {
      }
      sendMessageToContent(tab.id || -1, {
        type: "SUGGESTIONS",
        items: combinedSuggestions,
      });
    }
  }
});

async function getLazadaSuggestionsFromOutside(name: string, price: number) {
  const lazadaResult = await searchLazada(name);
  const filteredLazadaItems = lazadaResult.mods.listItems
    ?.filter((item) => +item.price < price && +item.ratingScore > 4)
    .filter((item) => +item.price / price > 0.3)
    ?.slice(0, 10)
    .sort((a, b) => +b.price - +a.price)
    .map((item) => ({
      name: item.name,
      price: +item.price,
      rating: +item.ratingScore,
      url: `https:${item.itemUrl}`,
      image: item.image,
      logo: "images/lazada-logo.png",
    }));
  return filteredLazadaItems || [];
}

async function getShopeeSuggestionsFromInsideShopee(
  targetProduct: Record<string, any>,
  itemid: string,
  shopid: string,
  url: string
) {
  const otherProducts = await searchForOtherProducts(targetProduct.name);
  const otherRecommendedProducts = await searchForRecommendedProducts(
    targetProduct.name,
    targetProduct.shopid,
    targetProduct.itemid,
    targetProduct.catid
  );
  otherProducts.items = [
    ...(otherProducts.items || []),
    ...((otherRecommendedProducts.data.sections?.[0]?.data?.item as any).map(
      (i: any) => ({ item_basic: i })
    ) || []),
  ];
  otherProducts.items = [
    ...(otherProducts.items || []),
    ...((otherRecommendedProducts.data.sections?.[0]?.data?.item as any).map(
      (i: any) => ({ item_basic: i })
    ) || []),
  ].filter((i) => i.item_basic.catid === targetProduct.catid);
  otherProducts.items = otherProducts.items?.filter(
    (val, index, self) =>
      val.item_basic &&
      index ===
        self.findIndex((t) => t.item_basic.itemid === val.item_basic.itemid) &&
      val.item_basic.sold > 0 &&
      val.item_basic.item_rating.rating_star > 4 &&
      val.item_basic.itemid.toString() != itemid
  );
  otherProducts.items.forEach(
    (i) =>
      (i.item_basic.price_min_after_discount =
        i.item_basic.price_min -
        parseDiscount(
          i.item_basic.price_min,
          i.item_basic.voucher_info?.label || ""
        ))
  );
  otherProducts.items = otherProducts.items?.filter(
    (i) => i.item_basic.price_min_after_discount < targetProduct.price
  );
  const rankedItems: Suggestion[] = otherProducts.items
    ?.filter((i) => i.item_basic.price_min / targetProduct.price > 0.3)
    ?.slice(0, 10)
    .sort((a, b) => b.item_basic.price_min - a.item_basic.price_min)
    .map((item) => ({
      name: item.item_basic.name,
      price: item.item_basic.price_min_after_discount / 100000,
      rating: item.item_basic.item_rating.rating_star,
      url: `https://shopee.ph/product/${item.item_basic.shopid}/${item.item_basic.itemid}`,
      image: `https://cf.shopee.ph/file/${item.item_basic.image}`,
      logo: "images/shopee-logo.png",
    }));
  suggestions[url] = {
    time: new Date().getTime(),
    items: rankedItems,
  };
  return rankedItems;
}

async function sendMessageToContent(tabId: number, data: Record<string, any>) {
  chrome.tabs.sendMessage(tabId, data);
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

async function searchLazada(name: string): Promise<LazadaSearchResult> {
  return (
    await fetch(
      `https://www.lazada.com.ph/catalog/?_keyori=ss&ajax=true&from=input&isFirstRequest=true&page=1&q=${name}`,
      {
        method: "GET",
        mode: "no-cors",
      }
    )
  ).json();
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

async function searchForRecommendedProducts(
  searchKeyword: string,
  shopid: number,
  itemid: number,
  categoryid: number
): Promise<RecommendedItemsShopeeSearchResult> {
  return (
    await fetch(
      `https://shopee.ph/api/v4/recommend/recommend?bundle=product_detail_page&catid=${categoryid}&item_card=3&itemid=${itemid}&keyword=${encodeURIComponent(
        searchKeyword
      )}&limit=48&section=you_may_also_like&shopid=${shopid}`,
      {
        method: "GET",
        mode: "cors",
      }
    )
  ).json();
}
