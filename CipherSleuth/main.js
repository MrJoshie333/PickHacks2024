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
    title: 'Atbash',
    parentId: parent,
    contexts: ['selection'],
    id: 'atbash'
  });
  chrome.contextMenus.create({
    title: 'Affine',
    parentId: parent,
    contexts: ['selection'],
    id: 'affine'
  });
  chrome.contextMenus.create({
    title: 'Rail Fence',
    parentId: parent,
    contexts: ['selection'],
    id: 'railfence'
  });
  chrome.contextMenus.create({
    title: 'Base64',
    parentId: parent,
    contexts: ['selection'],
    id: 'base64'
  });
  chrome.contextMenus.create({
    title: 'Binary',
    parentId: parent,
    contexts: ['selection'],
    id: 'binary'
  });
  
  // A generic onclick callback function.
  chrome.contextMenus.onClicked.addListener(genericOnClick);
});

// A generic onclick callback function.
function genericOnClick(info) {
  if (info.selectionText) {
    let selectedText = info.selectionText

    var popupWidth = 600;
    var popupHeight = 400;

    switch (info.menuItemId) {
      case 'decrypt':
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: popupWidth,
          height: popupHeight
        });
        break;
      
      case 'caesar':
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: popupWidth,
          height: popupHeight
        });
        break;
      case 'atbash':
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: popupWidth,
          height: popupHeight
        });
        break;
      case 'affine':
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: popupWidth,
          height: popupHeight
        });
        break;
      case 'railfence', 'base64', 'binary':
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: popupWidth,
          height: popupHeight
        });
        break;
      
      
      
      default:
        // Standard context menu item function
        console.log('Standard context menu item clicked.');
    }

    chrome.storage.local.set({ "selectedText": selectedText })
    chrome.storage.local.set({"mode": info.menuItemId})
  }
}



