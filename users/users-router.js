const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-mw.js");

router.get("/", restricted, (req, res) => {
    Users.findBy({ department: req.jwt.department })
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;