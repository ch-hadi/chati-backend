import admin from "firebase-admin";
import seviceAccount from "./kefc-firebase-firebase-adminsdk-mx9w6-4330a93cf0.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(seviceAccount)
})
export default admin;