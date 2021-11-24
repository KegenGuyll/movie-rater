import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
//Don't forget to add this config file
import config from './firebaseConfig';

const app = initializeApp(config);
const analytics = getAnalytics(app);
