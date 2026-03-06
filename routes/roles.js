var express = require('express');
var router = express.Router();
let { roles } = require('../utils/data');
let { IncrementalId } = require('../utils/IncrementalIdHandler');

// GET all roles (not deleted)
router.get('/', function (req, res) {
    let result = roles.filter(e => !e.isDeleted);
    res.send(result);
});

// GET role by ID
router.get('/:id', function (req, res) {
    let result = roles.find(e => !e.isDeleted && e.id == req.params.id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

// POST Create Role
router.post('/', function (req, res) {
    let newObj = {
        id: IncrementalId(roles),
        name: req.body.name,
        description: req.body.description || "",
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    roles.push(newObj);
    res.status(201).send(newObj);
});

// PUT Update Role
router.put('/:id', function (req, res) {
    let result = roles.find(e => e.id == req.params.id && !e.isDeleted);
    if (result) {
        let body = req.body;
        if (body.name) result.name = body.name;
        if (body.description !== undefined) result.description = body.description;
        result.updatedAt = new Date();
        res.send(result);
    } else {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

// DELETE Soft Delete Role
router.delete('/:id', function (req, res) {
    let result = roles.find(e => e.id == req.params.id && !e.isDeleted);
    if (result) {
        result.isDeleted = true;
        result.updatedAt = new Date();
        res.send({ message: "Role deleted successfully", result });
    } else {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

module.exports = router;
