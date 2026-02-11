// Typing animation effect for hero title
document.addEventListener('DOMContentLoaded', function() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const text = typingElement.textContent;
  typingElement.textContent = '';
  typingElement.style.display = 'inline-block';
  
  let charIndex = 0;
  const speed = 80; // milliseconds per character
  
  function type() {
    if (charIndex < text.length) {
      typingElement.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(type, speed);
    } else {
      typingElement.classList.add('typing-complete');
    }
  }
  
  // Start typing after a small delay
  setTimeout(type, 300);
});
