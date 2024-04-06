import { caesarCipher } from "./caesar";

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
function genericOnClick(info) {

  let selectedText = info.selectionText
  let decryptedText = "You're Mother"

  switch (info.menuItemId) {
    case 'caesar':
      chrome.windows.create({
        url: 'popup.html?text=' + encodeURIComponent(selectedText),
        type: 'popup',
        width: 400,
        height: 200
      });
      decryptedText = caesarCipher(selectedText, 4)
      break;
    case 'mono':
      chrome.windows.create({
        url: 'popup.html?text=' + encodeURIComponent(selectedText),
        type: 'popup',
        width: 400,
        height: 200
      });
      break;
    case 'homo':
      chrome.windows.create({
        url: 'popup.html?text=' + encodeURIComponent(selectedText),
        type: 'popup',
        width: 400,
        height: 200
      });
      break;
    
    
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
  }

  chrome.storage.local.set({ "decryptedText": decryptedText })
  
}



chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  let contexts = [
    'page',
    'selection',
    'link',
    'editable',
    'image',
    'video',
    'audio'
  ];

  chrome.contextMenus.create({
    title: 'Super Decrypt',
    contexts: ['selection'],
    id: 'decrypt'
  });

  // Create a parent item and two children.
  let parent = chrome.contextMenus.create({
    title: 'Choose a Cipher',
    contexts: ['selection'], // Add 'selection' context here
    id: 'choose'
  });
  chrome.contextMenus.create({
    title: 'Caesar',
    contexts: ['selection'], // Add 'selection' context here
    parentId: parent,
    id: 'caesar'
  });
  chrome.contextMenus.create({
    title: 'Monoalphabetic',
    parentId: parent,
    contexts: ['selection'],
    id: 'mono'
  });
  chrome.contextMenus.create({
    title: 'Homophonic',
    parentId: parent,
    contexts: ['selection'],
    id: 'homo'
  });

  // // Create a checkbox item.
  // chrome.contextMenus.create({
  //   title: 'checkbox',
  //   type: 'checkbox',
  //   id: 'checkbox'
  // });

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  chrome.contextMenus.create(
    { title: 'Oops', parentId: 999, id: 'errorItem' },
    function () {
      if (chrome.runtime.lastError) {
        console.log('Got expected error: ' + chrome.runtime.lastError.message);
      }
    }
  );
});
