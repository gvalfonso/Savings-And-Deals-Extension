chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (tab.url) {
      console.log(tab);
      console.log(tab.title);
      console.log(await getProductData());
    }
  }
});

async function getProductData(): Promise<any> {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(request);
    // const userId = request.userId;
    // if (userId) {
    //   fetchData(userId).then((data) => {
    //     sendResponse({ response: data });
    //   });
    //   return true;
    // }
  });
}
