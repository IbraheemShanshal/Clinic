ipcMain.on('add-visit', (event, visit) => {
    knex('visits')
      .insert({
        patient_id: visit.patientId,
        doctor_notes: visit.doctorNotes,
        current_medication: visit.currentMedication,
        visit_date: visit.visitDate
      })
      .then(() => {
        event.reply('visit-added');
      })
      .catch((error) => {
        console.error('Error adding visit:', error);
        event.reply('error', 'Error adding visit');
      });
  });