// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEmDc3YaL1t4mRZcCMORCS8woxHI3oLYo",
    authDomain: "kefc-firebase.firebaseapp.com",
    projectId: "kefc-firebase",
    storageBucket: "kefc-firebase.appspot.com",
    messagingSenderId: "227575151365",
    appId: "1:227575151365:web:2db5221cd894062de8d56c",
    measurementId: "G-QFZPS5LZL9"
};
let app = null;
let analytics = null;
const appAnalytics = (req, res) => {
    try {
        isSupported().then((result) => {
            if (result) {
                app = initializeApp(firebaseConfig);
                analytics = getAnalytics(app);
            }
        })

    } catch (error) {
        res.status(400).send({ success: false, messsage: error })
    }
}
export default appAnalytics;