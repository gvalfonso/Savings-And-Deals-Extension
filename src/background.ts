import { getShopeeSuggestions } from "./shopee/shopee.search";
import { Suggestion } from "./suggestion.type";

export var settings = {
  iconHidden: false,
  modalHidden: true,
};
const suggestions: Record<string, { time: number; items: any[] }> = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "GET_CONFIG":
      sendResponse(settings);
      break;
    case "SET_CONFIG":
      settings = {
        ...settings,
        ...request.settings,
      };
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
          const shopeeSuggestions = await getShopeeSuggestions(itemid, shopid);
          if (shopeeSuggestions.isNotProduct) return;
          combinedSuggestions = [
            ...shopeeSuggestions.suggestions,
            // ...lazadaSuggestions,
          ];
          combinedSuggestions = combinedSuggestions.sort(
            (a, b) => b.price - a.price
          );
          suggestions[tab.url] = {
            time: new Date().getTime(),
            items: combinedSuggestions,
          };
          sendMessageToContent(tab.id || -1, {
            type: "SUGGESTIONS",
            items: combinedSuggestions,
          });
        } else {
          sendMessageToContent(tab.id || -1, { type: "LOADING" });
        }
      } else if (tab.url.includes("lazada")) {
      }
    }
  }
});

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
