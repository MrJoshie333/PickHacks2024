

document.addEventListener('DOMContentLoaded', function() {
    var params = new URLSearchParams(window.location.search);
    var selectedText = params.get('text');
    document.getElementById('selectedText').textContent = 'Selected text: ' + selectedText;

  
    // Retrieve decrypted result text from local storage
    chrome.storage.local.get("decryptedText", function(data) {
      var decryptedText = data.decryptedText;
      document.getElementById("decryptedText").textContent = 'Decrypted text: ' + decryptedText;
  });
});