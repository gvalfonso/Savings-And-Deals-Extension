import { settings } from "./background";
import { ItemsEntity } from "./search.type";
import { Suggestion } from "./suggestion.type";

var helperModal: HTMLDivElement;
var iconButton: HTMLAnchorElement;
var logoContainer: HTMLDivElement;
var logoImg: HTMLImageElement;

interface MessageBaseType {
  type: string;
}
interface ToggleMessage extends MessageBaseType {
  iconHidden: boolean;
}
interface SuggestionsMessage extends MessageBaseType {
  items: Suggestion[];
}

chrome.runtime.sendMessage(
  { type: "GET_CONFIG" },
  (response: typeof settings) => {
    createHelper(response);
  }
);

chrome.runtime.onMessage.addListener(function (
  msg: SuggestionsMessage | MessageBaseType
) {
  switch (msg.type) {
    case "SUGGESTIONS":
      clearHelperModal();
      if ((msg as SuggestionsMessage).items.length !== 0) {
        (msg as SuggestionsMessage).items.forEach((item) => {
          const itemDiv = createItem(item);
          helperModal.appendChild(itemDiv);
        });
      } else if ((msg as SuggestionsMessage).items.length === 0) {
        const imgDiv = document.createElement("img");
        imgDiv.src = chrome.runtime.getURL("images/best-deal-sticker.png");
        imgDiv.id = "savings-and-deals-best-deal";
        helperModal.appendChild(imgDiv);
      }
      break;
    case "TOGGLE":
      toggleIcon((msg as ToggleMessage).iconHidden);
      break;
    case "LOADING":
      clearHelperModal();
      const imgDiv = document.createElement("img");
      imgDiv.src = chrome.runtime.getURL("images/loading.gif");
      imgDiv.id = "savings-and-deals-loading";
      helperModal.appendChild(imgDiv);
      break;
    default:
      break;
  }
});

function clearHelperModal() {
  helperModal.querySelectorAll("*").forEach((ele) => {
    ele.remove();
  });
}

function toggleModal() {
  helperModal.id =
    helperModal.id === "savings-and-deals-modal-opaque"
      ? "savings-and-deals-modal-clear"
      : "savings-and-deals-modal-opaque";
}

function toggleIcon(hidden: boolean) {
  iconButton.className = hidden
    ? "savings-and-deals-icon-hidden"
    : "savings-and-deals-icon";
  helperModal.id = "savings-and-deals-modal-clear";
}

function createHelper(config: typeof settings) {
  iconButton = document.createElement("a");
  if (config.iconHidden) iconButton.className = "savings-and-deals-icon-hidden";
  else iconButton.className = "savings-and-deals-icon";
  iconButton.onclick = toggleModal;

  logoContainer = document.createElement("div");
  logoContainer.id = "savings-and-deals-logo-container";
  iconButton.appendChild(logoContainer);

  logoImg = document.createElement("img");
  logoImg.id = "savings-and-deals-image-logo";
  logoImg.src = chrome.runtime.getURL("images/icon128letters.png");
  logoContainer.appendChild(logoImg);

  document.getElementsByTagName("body")[0].appendChild(iconButton);

  helperModal = document.createElement("div");
  helperModal.id = "savings-and-deals-modal-clear";
  document.getElementsByTagName("body")[0].appendChild(helperModal);

  const imgDiv = document.createElement("img");
  imgDiv.src = chrome.runtime.getURL("images/loading.gif");
  imgDiv.id = "savings-and-deals-loading";
  helperModal.appendChild(imgDiv);
}

function createItem(item: Suggestion): HTMLDivElement {
  const itemWrapper = document.createElement("div");
  itemWrapper.style.padding = "2px 0";
  const itemDiv = document.createElement("a");
  itemDiv.className = "savings-and-deals-item-box";
  itemDiv.href = item.url;

  const productImage = document.createElement("img");
  productImage.src = item.image;
  productImage.id = "savings-and-deals-rating-image";
  itemDiv.appendChild(productImage);

  const siteLogo = document.createElement("img");
  siteLogo.src = chrome.runtime.getURL(item.logo);
  siteLogo.id = "savings-and-deals-rating-site-logo";
  itemDiv.appendChild(siteLogo);

  const itemTitle = document.createElement("p");
  itemTitle.className = "savings-and-deals-item-title";
  itemTitle.innerText = item.name.substring(0, 40);
  if (item.name.length > 40) itemTitle.innerText = itemTitle.innerText + "...";
  itemDiv.appendChild(itemTitle);

  const price = document.createElement("p");
  price.innerText =
    "₱" + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  price.id = "savings-and-deals-rating-price";
  itemDiv.appendChild(price);

  const rating = document.createElement("p");
  rating.innerText = "★ " + item.rating.toFixed(2).toString();
  rating.id = "savings-and-deals-rating-star";
  itemDiv.appendChild(rating);
  itemWrapper.appendChild(itemDiv);
  return itemWrapper;
}
