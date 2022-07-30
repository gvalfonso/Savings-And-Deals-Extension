import { ItemsEntity } from "./search.type";

var iconButton = document.createElement("a");
iconButton.id = "savings-and-deals-icon";
iconButton.onclick = toggleModal;

var logoContainer = document.createElement("div");
logoContainer.id = "savings-and-deals-logo-container";
iconButton.appendChild(logoContainer);

var logoImg = document.createElement("img");
logoImg.id = "savings-and-deals-image-logo";
logoImg.src = chrome.runtime.getURL("icon128letters.png");
logoContainer.appendChild(logoImg);

document.getElementsByTagName("body")[0].appendChild(iconButton);

var helperModal = document.createElement("iframe");
helperModal.id = "savings-and-deals-modal-clear";
helperModal.innerText = "HELLO WORLD";
document.getElementsByTagName("body")[0].appendChild(helperModal);

chrome.runtime.sendMessage({ ready: true });

chrome.runtime.onMessage.addListener(function (
  msg:
    | {
        type: string;
        items: ItemsEntity[];
      }
    | { type: string }
) {
  switch (msg.type) {
    case "SUGGESTIONS":
      break;
    case "TOGGLE":
      console.log("TOOGLLGEEE");
      toggleIcon();
      break;
    default:
      break;
  }
});

function toggleModal() {
  helperModal.id =
    helperModal.id === "savings-and-deals-modal-opaque"
      ? "savings-and-deals-modal-clear"
      : "savings-and-deals-modal-opaque";
}

function toggleIcon() {
  iconButton.id = "savings-and-deals-icon-hidden";
  helperModal.id = "savings-and-deals-modal-clear";
}
