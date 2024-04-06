
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

    var text = document.getElementById("score").textContent;
    document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text.slice(14));
    
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
              document.getElementById("decryptedText").textContent = "Decrypted Text: " + caesarCipher(text.slice(15), userInput.value);
          });
          userInput.addEventListener('input', function(event) {
            var text = document.getElementById("score").textContent;
            document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text.slice(14));
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

function rateSimilarityToEnglish(text) {
  // Expected letter frequencies in English (approximate values)
  const expectedFrequencies = {
      'a': 8.17, 'b': 1.49, 'c': 2.78, 'd': 4.25, 'e': 12.70,
      'f': 2.23, 'g': 2.02, 'h': 6.09, 'i': 6.97, 'j': 0.15,
      'k': 0.77, 'l': 4.03, 'm': 2.41, 'n': 6.75, 'o': 7.51,
      'p': 1.93, 'q': 0.10, 'r': 5.99, 's': 6.33, 't': 9.06,
      'u': 2.76, 'v': 0.98, 'w': 2.36, 'x': 0.15, 'y': 1.97, 'z': 0.07
  };

  // Count the occurrences of each letter in the input text
  const frequencies = {};
  for (let char of text.toLowerCase()) {
      if (char >= 'a' && char <= 'z') {
          frequencies[char] = (frequencies[char] || 0) + 1;
      }
  }

  // Calculate the similarity score
  let score = 0;
  for (let char in frequencies) {
      const observedFrequency = (frequencies[char] / text.length) * 100;
      const expectedFrequency = expectedFrequencies[char];
      score += Math.abs(observedFrequency - expectedFrequency);
  }

  return score;
}