// Get references to the open and close elements
const openPopup = document.getElementById('openPopup');
const closePopup = document.getElementById('closePopup');
const popup = document.getElementById('popup');

// Open the pop-up when the link is clicked
openPopup.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default link behavior
  popup.style.display = 'block';
});

// Close the pop-up when the close button is clicked
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});