import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
const app = express();
const PORT = process.env.PORT || 6000;
import userRouter from './routes/user.js';
// import {Server} from 'http'
// const server = Server(app);
import  socketConn  from './utils/Connection/socketConn.js';
const server = socketConn(app)
// console.log('->',server)
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/uploads', express.static('./uploads'));
app.use(cookieParser());
app.use(cors());
// middlewares
app.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'Backend server is runnings!' });
  } catch (error) {
    res.status(500).json({ error });
  }
});
app.use('/api', userRouter);
server.listen(PORT, () => {
  console.log(`project is running on`, process.env.PORT);
});
