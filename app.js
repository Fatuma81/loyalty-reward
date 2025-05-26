import { logVisit } from './rewards.js';

window.checkIn = async function () {
  const phone = document.getElementById('phone').value;
  if (!phone) return alert('Please enter a phone number.');
  const response = await logVisit(phone);
  document.getElementById('result').textContent = response.message;
}
