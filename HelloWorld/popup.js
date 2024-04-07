
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve selected text from local storage
    chrome.storage.local.get("selectedText", function(data) {
      var selectedText = data.selectedText;
      document.getElementById("selectedText").textContent = selectedText;
    });
  
    // Retrieve decrypted result text from local storage
    chrome.storage.local.get("decryptedText", function(data) {
      var decryptedText = data.decryptedText;
      document.getElementById("decryptedText").textContent = decryptedText;
    });
    
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
              document.getElementById("decryptedText").textContent = caesarCipher(text, userInput.value);
              // document.getElementById("decryptedText").textContent = findBestDecryption(text)

              var decrypted = document.getElementById("decryptedText").textContent;
          });
      }
      else if (mode == "atbash") {
        document.getElementById('title').textContent = "Atbash Cipher"
        var text = document.getElementById('selectedText').textContent;
        document.getElementById("decryptedText").textContent = atbashCipher(text);
      }
      else if (mode == "decrypt") {
        var text = document.getElementById("selectedText").textContent;
        result = findBestDecryption(text)
        document.getElementById("decryptedText").textContent = result[0];
        document.getElementById('title').textContent = "Detected: " + result[1];
        
      }
      else if (mode === "vigenere") {
        document.getElementById('title').textContent = "Vigenere Cipher"
        var text = document.getElementById('selectedText').textContent;
        document.getElementById("decryptedText").textContent = vigenereCipher(text);
      }
      else if (mode === "railfence") {
        document.getElementById('title').textContent = "Rail Fence Cipher"
        var text = document.getElementById('selectedText').textContent;
        document.getElementById("decryptedText").textContent = railfenceCipher(text);
      }
      var text = document.getElementById("decryptedText").textContent;
      document.getElementById("score").textContent = "English Score: " + rateSimilarityToEnglish(text);
    });
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
    decryptedText = caesarCipher(text, key);

    // Calculate the similarity score of the decrypted text to English
    const similarityScore = rateSimilarityToEnglish(decryptedText);

    // Update the best decryption if the current decryption has higher similarity
    if (similarityScore < bestSimilarity) {
      bestSimilarity = similarityScore;
      bestDecryption = decryptedText;
      cipher = "Caesar Cipher (" + key + ")";
    }
  }

  // ===== Atbash Cipher =====

  decryptedText = atbashCipher(text);
  // Calculate the similarity score of the decrypted text to English
  const similarityScore = rateSimilarityToEnglish(decryptedText);

  // Update the best decryption if the current decryption has higher similarity
  if (similarityScore < bestSimilarity) {
      bestSimilarity = similarityScore;
      bestDecryption = decryptedText;
      cipher = "Atbash Cipher";
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
      "country", "course", "cut", "dark", "day", "deep", "did", "didn't", "different", "distance", "do", "does", "dog", "don’t", 
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
      "that’s", "the", "their", "them", "themselves", "then", "there", "these", "they", "thing", "think", "third", "this", "those", "though", "thought", 
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

  // Check the presence of common English words in the text
  const words = text.toLowerCase().split(/[^\w']+/);
  for (let word of words) {
      if (commonWords.includes(word)) {
        score -= (5 * words.filter(x => x==word).length); // Adjust the score for each common English word found
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