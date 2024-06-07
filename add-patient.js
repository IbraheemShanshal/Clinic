const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-patient-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    // add patient to database
    ipcRenderer.send('add-patient', { firstName, lastName });
  });
});

ipcRenderer.on('patient-added', () => {
  alert('Patient added successfully!');
  // go back to home page
  window.location.href = 'index.html';
});