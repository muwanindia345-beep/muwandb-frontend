const axios = require('axios');
const API = 'https://muwandb-server-production.up.railway.app'\;
axios.post(API + '/auth/refresh-keys', { username: 'Perman899', password: '1234567890' }, { headers: { 'Content-Type': 'application/json', 'x-source': 'web' }, timeout: 15000 })
  .then(res => console.log('SUCCESS', res.status, JSON.stringify(res.data)))
  .catch(e => {
    console.log('ERROR message:', e.message);
    console.log('ERROR code:', e.code);
    if (e.response) console.log('STATUS:', e.response.status, 'DATA:', JSON.stringify(e.response.data));
    else if (e.request) console.log('NO RESPONSE — network/CORS/timeout issue');
  });
