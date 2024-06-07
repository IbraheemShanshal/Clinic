const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-patient-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('search-term').value;
    // search for patients in database
    ipcRenderer.send('search-patient', searchTerm);
  });
});

ipcRenderer.on('search-results', (event, results) => {
  const searchResultsUl = document.getElementById('search-results');
  searchResultsUl.innerHTML = '';
  results.forEach((result) => {
    const li = document.createElement('li');
    li.textContent = `${result.FirstName} ${result.LastName}`;
    searchResultsUl.appendChild(li);
  });
});