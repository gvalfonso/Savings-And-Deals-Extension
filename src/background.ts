import { LazadaSearchResult } from "./lazada.types";
import { ShopeeProductData, ShopVouchersEntity } from "./shopee/product.type";
import { RecommendedItemsShopeeSearchResult } from "./shopee/recommended.type";
import { ItemsEntity, ShopeeSearchResult } from "./shopee/search.type";
import {
  getShopeeSuggestions,
  getShopeeSuggestionsFromInsideShopee,
} from "./shopee/shopee.search";
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
          const shopeeSuggestions = await getShopeeSuggestions(
            itemid,
            shopid,
            tab.url
          );
          combinedSuggestions = [
            ...shopeeSuggestions,
            // ...lazadaSuggestions,
          ];
          combinedSuggestions = combinedSuggestions.sort(
            (a, b) => b.price - a.price
          );
          suggestions[tab.url] = {
            time: new Date().getTime(),
            items: combinedSuggestions,
          };
          return combinedSuggestions;
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

async function sendMessageToContent(tabId: number, data: Record<string, any>) {
  chrome.tabs.sendMessage(tabId, data);
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
