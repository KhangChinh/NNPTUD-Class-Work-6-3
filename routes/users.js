var express = require('express');
var router = express.Router();
let { users, roles } = require('../utils/data');
let { IncrementalId } = require('../utils/IncrementalIdHandler');

// GET all users (not deleted)
router.get('/', function (req, res) {
    let result = users.filter(e => !e.isDeleted).map(u => {
        let role = roles.find(r => r.id == u.role);
        return { ...u, roleObj: role };
    });
    res.send(result);
});

// GET user by ID
router.get('/:id', function (req, res) {
    let user = users.find(e => !e.isDeleted && e.id == req.params.id);
    if (user) {
        let role = roles.find(r => r.id == user.role);
        res.status(200).send({ ...user, roleObj: role });
    } else {
        res.status(404).send({ message: "USER NOT FOUND" });
    }
});

// POST Create User
router.post('/', function (req, res) {
    let newObj = {
        id: IncrementalId(users),
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName || "",
        avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
        status: req.body.status || false,
        role: req.body.roleId, // Expecting role ID
        loginCount: 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    users.push(newObj);
    res.status(201).send(newObj);
});

// PUT Update User
router.put('/:id', function (req, res) {
    let result = users.find(e => e.id == req.params.id && !e.isDeleted);
    if (result) {
        let body = req.body;
        let allowedFields = ['username', 'password', 'email', 'fullName', 'avatarUrl', 'role', 'status'];
        allowedFields.forEach(field => {
            if (body[field] !== undefined) result[field] = body[field];
        });
        result.updatedAt = new Date();
        res.send(result);
    } else {
        res.status(404).send({ message: "USER NOT FOUND" });
    }
});

// DELETE Soft Delete User
router.delete('/:id', function (req, res) {
    let result = users.find(e => e.id == req.params.id && !e.isDeleted);
    if (result) {
        result.isDeleted = true;
        result.updatedAt = new Date();
        res.send({ message: "User deleted successfully", result });
    } else {
        res.status(404).send({ message: "USER NOT FOUND" });
    }
});

// POST Enable User
router.post('/enable', function (req, res) {
    const { email, username } = req.body;
    let user = users.find(u => u.email === email && u.username === username && !u.isDeleted);
    if (user) {
        user.status = true;
        user.updatedAt = new Date();
        res.send({ message: "User enabled successfully", user });
    } else {
        res.status(404).send({ message: "User not found or incorrect info" });
    }
});

// POST Disable User
router.post('/disable', function (req, res) {
    const { email, username } = req.body;
    let user = users.find(u => u.email === email && u.username === username && !u.isDeleted);
    if (user) {
        user.status = false;
        user.updatedAt = new Date();
        res.send({ message: "User disabled successfully", user });
    } else {
        res.status(404).send({ message: "User not found or incorrect info" });
    }
});

module.exports = router;