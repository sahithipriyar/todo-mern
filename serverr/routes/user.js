const express = require("express");
const router = express.Router();
const userInfo = require("../modals/user-modal");
const todoInfo = require("../modals/todo-modal");
const { checkExistingUser } = require("../utility")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = 9;
require('dotenv').config();
const SECRET_KEY = "0859bc0e6f724beff5f618e9f73428e3bb85e3bf4bbea0e0ba96e0a193dac908c4aa435dcab3c4363539ffc521127cdc28e97657f018a8510575ccf4ace7befd"

router.post("/login", (req, res) => {
    //res.status(200).send("Login works")
    userInfo.find({ username: req.body.username }).then((userData) => {
        if (userData.length) {
            bcrypt.compare(req.body.password, userData[0].password).then((val) => {
                if (val) {
                    const authToken = jwt.sign(userData[0].username, SECRET_KEY)
                    console.log(authToken);
                    res.status(200).send({ "status": "success", "token": authToken })
                } else {
                    res.status(400).send({ "status": "access denied", "message": "wrong password" })
                }
            })
        } else {
            res.status(400).send({ "status": "Invalid user", "message": "User not found" })
        }
    })
})


router.post("/register", async (req, res) => {
    // res.status(200).send("signup works")
    if (await checkExistingUser(req.body.username)) {
        res.status(400).send({ "status": "Invalid user", "message": 'Username exists please try with different one' })
    } else {
        if (req.body.password === req.body.cpassword) {
            bcrypt.genSalt(salt).then((saltHash) => {
                bcrypt.hash(req.body.password, saltHash).then((passwordHash) => {
                    userInfo.create({ username: req.body.username, password: passwordHash })
                        .then(() => {
                            todoInfo.create({ username: req.body.username, todoList: [] })
                        })
                        .then(() => {
                            res.status(200).send({ "status": "success", "message": "Registerd successfully" })
                        }).catch((err) => {
                            res.status(400).send({ "status": "Failed", "message": "Database Error" })
                        })
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })

        } else {
            return res.status(400).send({ "status": "Failed", "message": "Password mismatch" })
        }
    }
})


router.get("/todolist", (req, res) => {
    // console.log("indes",req.headers.authorization,jwt.verify(req.headers.authorization,SECRET_KEY))
    try {
        // console.log(req.headers)
        const userName = jwt.verify(req.headers.authorization, SECRET_KEY);
        userInfo.find({ username: userName }).then((users) => {
            if (users.length) {
                todoInfo.find({ username: users[0].username }).then((listFound) => {
                    // console.log(listFound)
                    res.status(200).send({ "status": "success", "message": "sending toDolist", "data": listFound[0].todoList, "username": listFound[0].username, "currentOngoing": listFound[0].currentOngoing });
                });
            }
            else {
                res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
            }
        });
    }
    catch (err) {
        if (err.message === "invalid signature") {
            console.log("invalid signature");
            res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
        }
        else if (err.message === "jwt must be provided") {
            console.log("authorization jwt not found");
            res.status(400).send({ "status": "failed", "message": "authorization jwt not found ,Invalid user, loginIn again" });
        }
        // console.log(err);
    }
})

router.post("/add-todo-item", (req, res) => {
    // console.log("indes",req.headers.authorization,jwt.verify(req.headers.authorization,SECRET_KEY))
    try {
        // console.log(req.body)
        const userName = jwt.verify(req.headers.authorization, SECRET_KEY);
        userInfo.find({ username: userName }).then((users) => {
            if (users.length) {
                todoInfo.find({ username: users[0].username }).then((listFound) => {
                    let newitem = {
                        activityName: req.body.todo,
                        status: "Pending",
                        bufferTime: 0,
                        StartTime: 0
                    }
                    let newTodo = [...listFound[0].todoList, newitem]
                    todoInfo.updateOne({ username: users[0].username }, { $set: { todoList: newTodo } })
                        .then((val) => {
                            console.log(val)
                            res.status(200).send({ "status": "success", "message": "todo Added successfully" });

                        })
                });
            }
            else {
                res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
            }
        });
    }
    catch (err) {
        if (err.message === "invalid signature") {
            console.log("invalid signature");
            res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
        }
        else if (err.message === "jwt must be provided") {
            console.log("authorization jwt not found");
            es.status(400).send({ "status": "failed", "message": "authorization jwt not found ,Invalid user, loginIn again" });
        }
        // console.log(err);
    }
})



router.put("/todo-start", (req, res) => {
    // console.log("indes",req.headers.authorization,jwt.verify(req.headers.authorization,SECRET_KEY))
    try {
        // console.log(req.body)
        const userName = jwt.verify(req.headers.authorization, SECRET_KEY);
        userInfo.find({ username: userName }).then((users) => {
            if (users.length) {
                todoInfo.find({ username: users[0].username }).then((listFound) => {
                    let newTodo = [...listFound[0].todoList]
                    listFound[0].currentOngoing = req.body.index.toString();
                    listFound[0].todoList[req.body.index].status = req.body.status;
                    listFound[0].todoList[req.body.index].StartTime = req.body.StartDate;
                    console.log(listFound[0].todoList[req.body.index], listFound[0].currentOngoing)
                    todoInfo.updateOne({ username: users[0].username }, { $set: { todoList: [...listFound[0].todoList], currentOngoing: req.body.index.toString() } })
                        .then((val) => {
                            console.log(val)
                            res.status(200).send({ "status": "success", "message": "todo updated successfully" });

                        })
                });
            }
            else {
                res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
            }
        });
    }
    catch (err) {
        if (err.message === "invalid signature") {
            console.log("invalid signature");
            res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
        }
        else if (err.message === "jwt must be provided") {
            console.log("authorization jwt not found");
            es.status(400).send({ "status": "failed", "message": "authorization jwt not found ,Invalid user, loginIn again" });
        }
        // console.log(err);
    }
})


router.put("/todo-pause", (req, res) => {
    // console.log("indes",req.headers.authorization,jwt.verify(req.headers.authorization,SECRET_KEY))
    try {
        // console.log(req.body)
        const userName = jwt.verify(req.headers.authorization, SECRET_KEY);
        userInfo.find({ username: userName }).then((users) => {
            if (users.length) {
                todoInfo.find({ username: users[0].username }).then((listFound) => {
                    listFound[0].currentOngoing = "";
                    listFound[0].todoList[req.body.index].status = req.body.status;
                    listFound[0].todoList[req.body.index].StartTime = "";
                    listFound[0].todoList[req.body.index].bufferTime += req.body.timeBuffer;
                    console.log(listFound[0].todoList[req.body.index], listFound[0].currentOngoing)
                    todoInfo.updateOne({ username: users[0].username }, { $set: { todoList: [...listFound[0].todoList], currentOngoing: "" } })
                        .then((val) => {
                            console.log(val)
                            res.status(200).send({ "status": "success", "message": "todo updated successfully" });

                        })
                });
            }
            else {
                res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
            }
        });
    }
    catch (err) {
        if (err.message === "invalid signature") {
            console.log("invalid signature");
            res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
        }
        else if (err.message === "jwt must be provided") {
            console.log("authorization jwt not found");
            es.status(400).send({ "status": "failed", "message": "authorization jwt not found ,Invalid user, loginIn again" });
        }
        // console.log(err);
    }
})


router.put("/todo-end", (req, res) => {
    // console.log("indes",req.headers.authorization,jwt.verify(req.headers.authorization,SECRET_KEY))
    try {
        // console.log(req.body)
        const userName = jwt.verify(req.headers.authorization, SECRET_KEY);
        userInfo.find({ username: userName }).then((users) => {
            if (users.length) {
                todoInfo.find({ username: users[0].username }).then((listFound) => {
                    listFound[0].currentOngoing = "";
                    listFound[0].todoList[req.body.index].status = req.body.status;
                    listFound[0].todoList[req.body.index].StartTime = "";
                    listFound[0].todoList[req.body.index].bufferTime = req.body.timeBuffer;
                    console.log(listFound[0].todoList[req.body.index], listFound[0].currentOngoing)
                    todoInfo.updateOne({ username: users[0].username }, { $set: { todoList: [...listFound[0].todoList], currentOngoing: "" } })
                        .then((val) => {
                            console.log(val)
                            res.status(200).send({ "status": "success", "message": "todo updated successfully" });

                        })
                });
            }
            else {
                res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
            }
        });
    }
    catch (err) {
        if (err.message === "invalid signature") {
            console.log("invalid signature");
            res.status(400).send({ "status": "failed", "message": "Invalid user, loginIn again" })
        }
        else if (err.message === "jwt must be provided") {
            console.log("authorization jwt not found");
            es.status(400).send({ "status": "failed", "message": "authorization jwt not found ,Invalid user, loginIn again" });
        }
        // console.log(err);
    }
})





router.post("/logout", (req, res) => {
    res.status(200).send({ "status": "success", "message": "Loggedout successfully" })
})

module.exports = router;