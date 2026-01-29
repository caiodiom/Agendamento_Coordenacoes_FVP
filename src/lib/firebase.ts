import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, update, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://coordenacoes-fvp-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export { ref, onValue, set, push, update, get };
