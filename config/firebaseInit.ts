import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
//Don't forget to add this config file
import config from './firebaseConfig';

const app = initializeApp(config);
//const analytics = getAnalytics(app);
//logEvent(analytics, 'notification_received');
const db = getFirestore(app);

export default db;
