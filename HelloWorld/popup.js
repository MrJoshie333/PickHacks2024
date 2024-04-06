document.addEventListener('DOMContentLoaded', function() {
    var params = new URLSearchParams(window.location.search);
    var selectedText = params.get('text');
    document.getElementById('selectedText').textContent = 'Selected text: ' + selectedText;
  });
  
  function handleUserInput() {
    var userInput = document.getElementById('userInput').value;
    // Do something with the user input
  }