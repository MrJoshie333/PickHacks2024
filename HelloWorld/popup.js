
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
    
    chrome.storage.local.get("mode", function(data) {
      var mode = data.mode;

      // Check if mode is "caesar"
      if (mode === "caesar") {
          var userInput = document.getElementById('userInput');
          // Show the input element
          userInput.style.display = 'block';
          // Add event listener for 'input' event
          userInput.addEventListener('input', function(event) {
              var text = document.getElementById("decryptedText").textContent;
              document.getElementById("decryptedText").textContent = caesarCipher(text, userInput.value);
          });
      }

      // Check if mode is "vigenere"
      if (mode === "vigenere") {
        ;
      }

      // Check if mode is "railfence"
      if (mode === "railfence") {
        ;
      }
      
  });
});