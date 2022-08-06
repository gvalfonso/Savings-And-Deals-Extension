import { config } from "./config";
import { getProductData, getShopeeSuggestions } from "./shopee/shopee.search";
import { Suggestion } from "./types/suggestion.type";
import { getIds } from "./utils";

export var settings = {
  iconHidden: false,
  modalHidden: false,
};

const suggestions: Record<string, { time: number; items: any[] }> = {};

const supportedWebsites = ["shopee"];

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
    default:
      break;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    if (new RegExp(supportedWebsites.join("|")).test(activeTab.url || "")) {
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
    new Date().getTime() - suggestions[tab.url].time < 30000
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
      if (!shopeeSuggestions.success) return;
      combinedSuggestions = [...shopeeSuggestions.suggestions];
      suggestions[tab.url] = {
        time: new Date().getTime(),
        items: combinedSuggestions,
      };
      sendMessageToContent(tab.id || -1, {
        type: "SUGGESTIONS",
        items: combinedSuggestions,
      });
      if (combinedSuggestions.length > 0 && settings.iconHidden) {
        await chrome.action.setBadgeBackgroundColor({
          color: "#FFD580",
        });
        await chrome.action.setBadgeText({
          text: combinedSuggestions.length.toString(),
          tabId: tab.id || -1,
        });
      }
    }
  }
}

async function sendMessageToContent(tabId: number, data: Record<string, any>) {
  chrome.tabs.sendMessage(tabId, data);
}
