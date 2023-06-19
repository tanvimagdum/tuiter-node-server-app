import { connect } from "mongoose";
import * as usersDao from "./users-dao.js";

var currentUserVar;
const AuthController = (app) => {
    const register = async (req, res) => {
        const username = req.body.username;
        const user = await usersDao.findUserByUsername(username);
        if (user) {
          res.sendStatus(409);
          return;
        }
        const receivedUser = req.body;
        const newUser = await usersDao.createUser(receivedUser);
        req.session["currentUser"] = newUser;
        // currentUserVar = newUser;
        res.json(newUser);
    };
     
    const login = async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
            const user = await usersDao.findUserByCredentials(username, password);
            if (user) {
              req.session["currentUser"] = user;
            // currentUserVar = user;
              res.json(user);
            } else {
              res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }  
    };
     
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        // const currentUser = currentUserVar;
        console.log(currentUser);
        if (!currentUser) {
          res.sendStatus(404);
          return;
        }
        res.json(currentUser);
    };
     
    const logout = async (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
     
    const update = async (req, res) => {
        const currentUser = req.session["currentUser"];
        // const currentUser = currentUserVar;
        if (!currentUser) {
            res.sendStatus(404);
            return;
        }
        const userId = currentUser._id;
        const updates = req.body;
        const updatedUser = await usersDao.updateUser(userId, updates);
        if (updatedUser) {
            req.session["currentUser"] = updatedUser;
            // currentUserVar= updatedUser;
            res.json(updatedUser);
        } else {
            res.sendStatus(404);
        }  
     };


 app.post("/api/users/register", register);
 app.post("/api/users/login",    login);
 app.post("/api/users/profile",  profile);
 app.post("/api/users/logout",   logout);
 app.put("/api/users",           update);
};

export default AuthController;

