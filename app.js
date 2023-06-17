import express from 'express';
import session from "express-session";
import cors from 'cors';
import HelloController from "./controllers/hello-controller.js";
import UserController from "./users/users-controller.js";
import TuitsController from "./controllers/tuits/tuits-controller.js";
import AuthController from "./users/auth-controller.js";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';

const app = express();

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
console.log(CONNECTION_STRING);

app.use(
    session({
      store: MongoStore.create({
        mongoUrl: CONNECTION_STRING,
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      }),
      secret: "any string",
      resave: false,
      saveUninitialized: true,
    })
);   

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000","https://a6--rococo-cuchufli-ca0ad3.netlify.app"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/tuiter");

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((error) => {
  console.log("Error connecting to MongoDB Atlas:", error);
});

TuitsController(app);
HelloController(app);
UserController(app);
AuthController(app);

app.listen(process.env.PORT || 4000);

