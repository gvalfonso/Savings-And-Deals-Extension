import { config } from "./config";
import { getProductData, getShopeeSuggestions } from "./shopee/shopee.search";
import { Suggestion } from "./types/suggestion.type";
export var settings = {
  iconHidden: false,
  modalHidden: false,
};

const suggestions: Record<string, { time: number; items: any[] }> = {};
const urlReadiness: Record<string, boolean> = {};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
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
    // case "GET_SUGGESTIONS":
    //   if (sender.tab) handleSuggestions(sender.tab);
    //   break;
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
  if (changeInfo.status === "complete" && tab.url) {
    handleSuggestions(tab);
  }
});

async function handleSuggestions(tab: chrome.tabs.Tab) {
  sendMessageToContent(tab.id || -1, { type: "LOADING" });
  if (!tab.url) return;
  if (
    suggestions[tab.url] &&
    new Date().getTime() - suggestions[tab.url].time < 300000
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
      const baseUrl = tab.url?.split("/").slice(0, 3).join("/");
      const shopeeSuggestions = await getShopeeSuggestions(
        itemid,
        shopid,
        baseUrl
      );
      if (shopeeSuggestions.success) return;
      combinedSuggestions = [...shopeeSuggestions.suggestions];
      suggestions[tab.url] = {
        time: new Date().getTime(),
        items: combinedSuggestions,
      };
      sendMessageToContent(tab.id || -1, {
        type: "SUGGESTIONS",
        items: combinedSuggestions,
      });
    }
  }
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
