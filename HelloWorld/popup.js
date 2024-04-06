

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve selected text from local storage
    chrome.storage.local.get("selectedText", function(data) {
      var selectedText = data.selectedText;
      document.getElementById("selectedText").textContent = 'Selected text: ' + selectedText;
    });
  
    // Retrieve decrypted result text from local storage
    chrome.storage.local.get("decryptedText", function(data) {
      var decryptedText = data.decryptedText;
      document.getElementById("decryptedText").textContent = 'Decrypted text: ' + decryptedText;
    });
});