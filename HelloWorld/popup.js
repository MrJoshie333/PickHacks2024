
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
              var text = document.getElementById("selectedText").textContent;
              document.getElementById("decryptedText").textContent = caesarCipher(text.slice(15), userInput.value);
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