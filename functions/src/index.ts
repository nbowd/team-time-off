// import { collection, getDocs } from 'firebase/firestore'
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

export const helloWorld = onRequest(async (request, response) => {
  const snapshot = await db.collection('Requests').get();

  let employees:any = [];
  snapshot.forEach((doc:any) => {
    let id = doc.id;
    let data = doc.data();

    employees.push({id, ...data });
  });

  logger.info("firestore test", {structuredData: true});

  response.status(200).send(JSON.stringify(employees));
});
