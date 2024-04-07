
document.addEventListener('DOMContentLoaded', function() {
    
  if (document.getElementById("selectedText")) {

  // Retrieve selected text from local storage
    chrome.storage.local.get("selectedText", function(data) {
      var selectedText = data.selectedText;
      document.getElementById("selectedText").textContent = selectedText;
    });
  
    decryptedText = ""
    
    chrome.storage.local.get("mode", function(data) {

      var mode = data.mode;

      // Check if mode is "caesar"
      if (mode === "caesar") {
        document.getElementById('title').textContent = "Caesar Cipher"
        var userInput = document.getElementById('userInput');
        // Show the input element
        userInput.style.display = 'inline-block';
        // Add event listener for 'input' event
        userInput.addEventListener('input', function(event) {
            var text = document.getElementById("selectedText").textContent;
            document.getElementById("decryptedText").textContent = caesarCipher(text, userInput.value, true);
            var text = document.getElementById("decryptedText").textContent;
            document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);
        });
      }
      else if (mode == "atbash") {
        document.getElementById('title').textContent = "Atbash Cipher"
        var text = document.getElementById('selectedText').textContent;
        document.getElementById("decryptedText").textContent = atbashCipher(text);
        var text = document.getElementById("decryptedText").textContent;
        document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);
      }
      else if (mode == "decrypt") {
        var text = document.getElementById("selectedText").textContent;
        result = findBestDecryption(text)
        document.getElementById("decryptedText").textContent = result[0];
        document.getElementById('title').textContent = "Detected: " + result[1];
        var text = document.getElementById("decryptedText").textContent;
        document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(result[0]);
        
      }
      else if (mode === "railfence") {
        document.getElementById('title').textContent = "Rail Fence Cipher"
        var userInput = document.getElementById('userInput');
        // Show the input element
        userInput.style.display = 'inline-block';
        userInput.placeholder = 'Enter # of rails';
        // Add event listener for 'input' event
        userInput.addEventListener('input', function(event) {
            var text = document.getElementById("selectedText").textContent;
            if (userInput.value > 1 && userInput.value < text.length) {
              document.getElementById("decryptedText").textContent = railFenceCipher(text, userInput.value);
              var text = document.getElementById("decryptedText").textContent;
              document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);
            }
            else if (userInput.value < 2){
              document.getElementById("decryptedText").textContent = "Use a key of 2 or higher...";
            }
            else {
              document.getElementById("decryptedText").textContent = "Sorry, key is too large...";
            }
        });
      }
      else if (mode === "affine") {
        document.getElementById('title').textContent = "Affine Cipher"
        var userInput = document.getElementById('userInput');
        userInput.style.display = 'inline-block';
        userInput.placeholder = "Enter Coefficient 1"
        var userInput2 = document.getElementById('userInput2');
        userInput2.style.display = 'inline-block';
        userInput2.placeholder = "Enter Coefficient 2"

        var text = document.getElementById('selectedText').textContent;
        document.getElementById("decryptedText").textContent = affineCipher(text);
        var text = document.getElementById("decryptedText").textContent;
        document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);

        userInput.addEventListener('input', function(event) {
          var text = document.getElementById("selectedText").textContent;
          if (userInput.value !== "" && userInput2.value !== "") {
            document.getElementById("decryptedText").textContent = affineCipher(text, userInput.value, userInput2.value);
            var text = document.getElementById("decryptedText").textContent;
            document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);
          }
          else {
            document.getElementById("decryptedText").textContent = "Enter your two coefficients...";
          }
      });
      
      userInput2.addEventListener('input', function(event) {
        var text = document.getElementById("selectedText").textContent;
          if (userInput.value !== "" && userInput2.value !== "") {
            document.getElementById("decryptedText").textContent = affineCipher(text, userInput.value, userInput2.value);
            var text = document.getElementById("decryptedText").textContent;
            document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);
          }
          else {
            document.getElementById("decryptedText").textContent = "Enter your two coefficients...";
          }
          
      });
      }

    });
  }
});

function findBestDecryption(text) {
  let bestDecryption = '';
  let bestSimilarity = Infinity; // Initialize with maximum possible similarity score
  let decryptedText = '';
  let cipher = '';

  // ===== Handling Original Text =====
  bestSimilarity = rateSimilarityToEnglish(text);
  bestDecryption = text;
  cipher = "Original Text";

  // ===== Caesar Cipher =====

  // Iterate over all possible rotation keys (0 to 25)
  for (let key = 0; key < 26; key++) {
    // Decrypt the text using the current rotation key
    decryptedText = caesarCipher(text, key, true);

    // Calculate the similarity score of the decrypted text to English
    var similarityScore = rateSimilarityToEnglish(decryptedText);

    // Update the best decryption if the current decryption has higher similarity
    if (similarityScore < bestSimilarity) {
      bestSimilarity = similarityScore;
      bestDecryption = decryptedText;
      originalShift = 26 - key;
      cipher = "Caesar Cipher (" + originalShift + ")";
    }
  }

  // ===== Atbash Cipher =====

  decryptedText = atbashCipher(text);
  // Calculate the similarity score of the decrypted text to English
  var similarityScore = rateSimilarityToEnglish(decryptedText);

  // Update the best decryption if the current decryption has higher similarity
  if (similarityScore < bestSimilarity) {
      bestSimilarity = similarityScore;
      bestDecryption = decryptedText;
      cipher = "Atbash Cipher";
  }

  // ===== Rail Fence Cipher =====

  for (let rails = 2; rails <= text.length; rails++) {
    // Decrypt the text using the current number of rails
    decryptedText = railFenceCipher(text, rails);

    // Calculate the similarity score of the decrypted text to English
    similarityScore = rateSimilarityToEnglish(decryptedText);

    // Update the best decryption if the current decryption has higher similarity
    if (similarityScore < bestSimilarity) {
      bestSimilarity = similarityScore;
      bestDecryption = decryptedText;
      cipher = "Rail Fence Cipher (" + rails + " rails)";
    }
  }

  // ===== Affine Cipher =====
  for (let a = 1; a < 26; a++) {
    for (let b = 0; b < 26; b++) {
      decryptedText = affineCipher(text, a, b);
      similarityScore = rateSimilarityToEnglish(decryptedText);
      if (similarityScore < bestSimilarity) {
        bestSimilarity = similarityScore;
        bestDecryption = decryptedText;
        cipher = "Affine Cipher (a=" + a + ", b=" + b + ")";
      }
    }
  }
  
  return [bestDecryption, cipher];
}

function rateSimilarityToEnglish(text) {
  // Expected letter frequencies in English (approximate values)
  const expectedFrequencies = {
      'a': 8.17, 'b': 1.49, 'c': 2.78, 'd': 4.25, 'e': 12.70,
      'f': 2.23, 'g': 2.02, 'h': 6.09, 'i': 6.97, 'j': 0.15,
      'k': 0.77, 'l': 4.03, 'm': 2.41, 'n': 6.75, 'o': 7.51,
      'p': 1.93, 'q': 0.10, 'r': 5.99, 's': 6.33, 't': 9.06,
      'u': 2.76, 'v': 0.98, 'w': 2.36, 'x': 0.15, 'y': 1.97, 'z': 0.07
  };

  // List of common English words
  const commonWords = [
      "able", "about", "above", "across", "add", "after", "again", "against", "ago", "air", "all", "almost", "alone", 
      "along", "already", "also", "although", "always", "am", "American", "among", "an", "and", "animal", "animals", 
      "another", "answer", "any", "anything", "are", "area", "around", "as", "asked", "at", "away", "back", "ball", 
      "be", "beautiful", "became", "because", "become", "been", "before", "began", "begin", "behind", "being", "below", 
      "bet", "better", "between", "big", "black", "blue", "boat", "body", "book", "both", "bottom", "box", "boy", "bring", 
      "brought", "build", "built", "but", "by", "called", "came", "can", "can't", "cannot", "car", "care", "carefully", "carry", 
      "center", "certain", "change", "check", "children", "city", "class", "close", "cold", "come", "common", "complete", "could", 
      "country", "course", "cut", "dark", "day", "deep", "did", "didn't", "different", "distance", "do", "does", "dog", "don't", 
      "done", "door", "down", "draw", "dry", "during", "each", "early", "earth", "easy", "eat", "either", "else", "end", "English", 
      "enough", "even", "ever", "every", "everyone", "everything", "example", "face", "fact", "fall", "family", "far", "fast", "father", 
      "feel", "feet", "felt", "few", "field", "finally", "find", "fine", "fire", "first", "fish", "five", "floor", "follow", "food", "foot", 
      "for", "form", "found", "four", "friend", "from", "front", "full", "game", "gave", "get", "girl", "give", "glass", "go", "going", 
      "gold", "gone", "good", "got", "great", "green", "ground", "group", "grow", "had", "half", "hand", "happened", "hard", "has", 
      "have", "he", "head", "hear", "heard", "heart", "heavy", "held", "help", "her", "here", "high", "him", "himself", "his", "hold", 
      "home", "horse", "hot", "hour", "house", "how", "however", "hundred", "I", "I'll", "I'm", "ice", "idea", "if", "important", "in", 
      "inside", "instead", "into", "is", "it", "it's", "its", "itself", "job", "just", "keep", "kept", "kind", "knew", "know", "land", "language", 
      "large", "last", "later", "lay", "learn", "learned", "least", "leave", "leaves", "left", "less", "let", "letter", "life", "light", 
      "like", "line", "list", "little", "live", "lived", "living", "long", "longer", "look", "low", "made", "main", "make", "man", "many", 
      "map", "matter", "may", "me", "mean", "men", "might", "mind", "miss", "money", "moon", "more", "morning", "most", "mother", "move", 
      "much", "must", "my", "name", "near", "need", "never", "new", "next", "night", "no", "not", "nothing", "notice", "now", "number", "of", 
      "off", "often", "oh", "old", "on", "once", "one", "only", "open", "or", "order", "other", "our", "out", "outside", "over", "own", "page", 
      "paper", "part", "past", "pattern", "people", "perhaps", "person", "picture", "piece", "place", "plants", "play", "point", "poor", "possible", 
      "power", "probably", "problem", "put", "question", "quite", "rain", "ran", "read", "ready", "real", "really", "red", "remember", "rest", "right", 
      "river", "road", "rock", "room", "round", "run", "sad", "said", "same", "sat", "saw", "say", "school", "sea", "second", "see", "seen", "sentence", 
      "set", "several", "shall", "she", "ship", "short", "should", "show", "shown", "side", "simple", "since", "six", "size", "sky", "small", "snow", 
      "so", "some", "someone", "something", "soon", "sound", "space", "special", "stand", "start", "state", "stay", "still", "stood", "stop", "story", 
      "strong", "study", "such", "suddenly", "summer", "sun", "sure", "surface", "system", "table", "take", "talk", "tall", "tell", "ten", "than", "that", 
      "that's", "the", "their", "them", "themselves", "then", "there", "these", "they", "thing", "think", "third", "this", "those", "though", "thought", 
      "three", "through", "time", "tiny", "to", "today", "together", "told", "too", "took", "top", "toward", "town", "tree", "true", "try", "turn", 
      "turned", "two", "under", "understand", "United States", "until", "up", "upon", "us", "use", "usually", "very", "voice", "walk", "walked", 
      "want", "warm", "was", "watch", "water", "way", "we", "weather", "well", "went", "were", "what", "when", "where", "whether", "which", "while", 
      "white", "who", "whole", "why", "wide", "wild", "will", "wind", "winter", "with", "within", "without", "words", "work", "world", "would", 
      "write", "year", "yes", "yet", "you", "young", "your"
  ];

  // Count the occurrences of each letter in the input text
  const frequencies = {};
  for (let char of text.toLowerCase()) {
      if (char >= 'a' && char <= 'z') {
          frequencies[char] = (frequencies[char] || 0) + 1;
      }
  }

  // Calculate the similarity score based on letter frequencies
  let score = 0;
  for (let char in frequencies) {
      if (char in expectedFrequencies) {
          const observedFrequency = (frequencies[char] / text.length) * 100;
          const expectedFrequency = expectedFrequencies[char];
          score += Math.abs(observedFrequency - expectedFrequency);
      }
  }

  // // Check the presence of common English words in the text
  // const words = text.toLowerCase().split(/[^\w']+/);
  // for (let word of words) {
  //     if (commonWords.includes(word)) {
  //       score -= (5 * words.filter(x => x==word).length); // Adjust the score for each common English word found
  //     }
  // }

  // Check the presence of common English words in the text
const words = text.toLowerCase().split(/[^a-zA-Z']+|'(?![a-zA-Z])/); // Split by non-alphabetic characters but keep single quotes intact
for (let word of words) {
    // Include the word and its subwords (if any)
    for (let i = 1; i <= word.length; i++) {
        const subword = word.substring(0, i);
        if (commonWords.includes(subword)) {
            score -= 5;
        }
    }
}

  return score;
}

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

function atbashCipher(text) {
  let lookup_table = {
    'A': 'Z', 'B': 'Y', 'C': 'X', 'D': 'W', 'E': 'V',
    'F': 'U', 'G': 'T', 'H': 'S', 'I': 'R', 'J': 'Q',
    'K': 'P', 'L': 'O', 'M': 'N', 'N': 'M', 'O': 'L',
    'P': 'K', 'Q': 'J', 'R': 'I', 'S': 'H', 'T': 'G',
    'U': 'F', 'V': 'E', 'W': 'D', 'X': 'C', 'Y': 'B', 'Z': 'A'
  };
  let cipher = '';
  for (let letter of text) {
    // checks for space
    if (letter.toUpperCase() in lookup_table) {
      match = lookup_table[letter.toUpperCase()];
      // adds the corresponding letter from the lookup_table
      if (letter.toUpperCase() !== letter) {
        cipher += match.toLowerCase();
      }
      else {
        cipher += match;
      }
      
    } else {
        // adds space
        cipher += letter;
    }
  }
  return cipher;
}

function makeFence(len, n) {
  var i, pip, period = 2 * (n - 1);
  var rows = [];
  for (i = 0; i < n; i++) {
    rows.push([]); // Initialize each element of the list as an empty array
  }
  for (i = 0; i < len; i++) {
    pip = i % period;
    r = pip < (n - 1) ? pip : period - pip;
    rows[r].push(i);
  }
  // Concatenate all sub-arrays into a single array
  return rows.reduce((acc, val) => acc.concat(val), []);
}

function railFenceCipher(text, n) {
  var i, len = text.length, mapped = makeFence(len,n), result = "";
  return text.split('').reduce(function(p,c,i,a){ return p + a[mapped.indexOf(i)]},'');
  for( i = 0; i < len; i++) result += text.substr( mapped.indexOf( i), 1);
  return result;  
}

function modInverse(a, m) {
  // Extended Euclidean Algorithm
  let [m0, x0, x1] = [m, 0, 1];
  while (a > 1) {
      let q = Math.floor(a / m);
      [m, a] = [a % m, m];
      [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0 ? x1 + m0 : x1;
}

function affineCipher(ciphertext, a, b) {
  const m = 26; // Size of the English alphabet
  const aInv = modInverse(a, m);
  let plaintext = '';
  for (let i = 0; i < ciphertext.length; i++) {
      const charCode = ciphertext.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) { // Uppercase letters
          const x = charCode - 65;
          const decryptedValue = (aInv * (x - b)) % m;
          const decryptedCharCode = decryptedValue < 0 ? decryptedValue + m : decryptedValue;
          plaintext += String.fromCharCode(decryptedCharCode + 65);
      } else if (charCode >= 97 && charCode <= 122) { // Lowercase letters
          const x = charCode - 97;
          const decryptedValue = (aInv * (x - b)) % m;
          const decryptedCharCode = decryptedValue < 0 ? decryptedValue + m : decryptedValue;
          plaintext += String.fromCharCode(decryptedCharCode + 97);
      } else {
          plaintext += ciphertext[i]; // Non-alphabetic characters remain unchanged
      }
  }
  return plaintext;
}