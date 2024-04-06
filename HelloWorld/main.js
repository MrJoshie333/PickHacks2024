// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
function genericOnClick(info) {

  let selectedText = info.selectionText
  let decryptedText = "You're Mother"

  switch (info.menuItemId) {
    case 'caesar':
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 400,
        height: 200
      });
      decryptedText = "Enter a shift value"
      break;
    case 'vigenere':
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 400,
        height: 200
      });
      break;
    case 'railfence':
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 400,
        height: 200
      });
      break;
    
    
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
  }

  chrome.storage.local.set({ "selectedText": selectedText })
  chrome.storage.local.set({ "decryptedText": decryptedText })
  chrome.storage.local.set({"mode": info.menuItemId})
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
    title: 'Vigenere',
    parentId: parent,
    contexts: ['selection'],
    id: 'vigenere'
  });
  chrome.contextMenus.create({
    title: 'Rail Fence',
    parentId: parent,
    contexts: ['selection'],
    id: 'railfence'
  });

  // // Create a checkbox item.
  // chrome.contextMenus.create({
  //   title: 'checkbox',
  //   type: 'checkbox',
  //   id: 'checkbox'
  // });

});


function caesarCipher(str, shift, decrypt = false) {
  const s = decrypt ? (26 - shift) % 26 : shift;
  const n = s > 0 ? s : 26 + (s % 26);
  return [...str]
    .map((l, i) => {
      const c = str.charCodeAt(i);
      if (c >= 65 && c <= 90)
        return String.fromCharCode(((c - 65 + n) % 26) + 65);
      if (c >= 97 && c <= 122)
        return String.fromCharCode(((c - 97 + n) % 26) + 97);
      return l;
    })
    .join('');
};
  
