/* eslint-disable no-await-in-loop */
import axios from 'axios';
import messages from './messages';

async function main() {
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    let endpoint = 'shipment';
    if (message.type === 'ORGANIZATION') {
      endpoint = 'organization';
    }

    try {
      await axios.post(`http://localhost:3000/${endpoint}`, message);
    } catch (error) {
      console.error(error.code);
    }
  }
}

main();
