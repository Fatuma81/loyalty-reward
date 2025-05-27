// app.js
import { logVisit } from './reward.js';

window.checkIn = async function () {
  const phone = document.getElementById('phone').value.trim();
  if (!phone) return alert('Please enter a phone number.');

  const response = await logVisit(phone);
  const resultDiv = document.getElementById('result');
  
  if (response.status === 'error') {
    resultDiv.textContent = response.message;
    resultDiv.className = 'message error';
  } else if (response.status === 'reward') {
    resultDiv.textContent = response.message;
    resultDiv.className = 'message success';
  } else {
    resultDiv.textContent = response.message;
    resultDiv.className = 'message';
  }
};
