// Home Page
function startDiscovering() {
    window.location.href = 'instructions.html';
  }
  
// Instructions Page
document.addEventListener('DOMContentLoaded', (event) => {
  const ctaButton = document.querySelector('.cta-button');
  
  ctaButton.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/search_page';
  });
});

// Exit
document.addEventListener('DOMContentLoaded', () => {
  const circleElement = document.querySelector('.exit-footer');
  circleElement.addEventListener('click', () => {
    window.location.href = 'home.html';
  });
  // Placeholder for swipe left to return
  document.querySelector('.option-card:nth-child(1)').addEventListener('click', () => {
    alert('Swiped left to return!');
  });

  // Placeholder for swipe right for results
  document.querySelector('.option-card:nth-child(2)').addEventListener('click', () => {
    alert('Swiped right for results!');
  });

  // Placeholder for raise hand to exit
  document.querySelector('.exit-button').addEventListener('click', () => {
    window.location.href = 'home.html';
  });
});

// Songs selection page
document.addEventListener('DOMContentLoaded', () => {
  const circleElement = document.querySelector('.circle');
  circleElement.addEventListener('click', () => {
    window.location.href = 'exit.html';
  });

  const instructionBox = document.querySelector('.instruction-box');
  instructionBox.addEventListener('click', () => {
    window.location.href = 'results.html';
  });

  const helpBox = document.querySelector('.help-box');
  helpBox.addEventListener('click', () => {
    window.location.href = 'instructions.html';
  });

  // Placeholder for swipe left to return
  document.querySelector('.swipe-left').addEventListener('click', () => {
    alert('Swiped left to return!');
  });

  // Placeholder for swipe right for results
  document.querySelector('.swipe-right').addEventListener('click', () => {
    alert('Swiped right for results!');
  });

});
