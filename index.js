const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true
});

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      const addPatientBtn = document.getElementById('add-patient-btn');
      const searchPatientBtn = document.getElementById('search-patient-btn');
      const backButton = document.getElementById('back-btn');
	  console.log('Back button element:', backButton);

      addPatientBtn.addEventListener('click', () => {
        window.location.href = 'add-patient.html';
      });

      searchPatientBtn.addEventListener('click', () => {
        window.location.href = 'search-patient.html';
      })
    `);
  });
});

// handle add patient request
ipcMain.on('add-patient', (event, patient) => {
	knex('patients')
	  .insert({
		name: patient.name,
		age: patient.age,
		contact_number: patient.contactNumber,
		medical_history: patient.medicalHistory
	  })
	  .then(() => {
		event.reply('patient-added');
	  })
	  .catch((error) => {
		console.error('Error adding patient:', error);
		event.reply('error', 'Error adding patient');
	  });
  });

// handle search patient request
ipcMain.on('search-patient', (event, searchTerm) => {
  knex('Patient')
    .where('FirstName', 'like', `%${searchTerm}%`)
    .orWhere('LastName', 'like', `%${searchTerm}%`)
    .then((results) => {
      event.reply('search-results', results);
    })
    .catch((error) => {
      console.error('Error searching patients:', error);
      event.reply('error', 'Error searching patients');
    });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}