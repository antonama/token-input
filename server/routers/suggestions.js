var express = require("express");
var router = express.Router();

router.get("/get/:prefix", function (req, res) {
    res.json([
        "anton",
        "artur",
        "arkadiy",
        "boris",
        "vladimir",
        "denis",
        "egor"
    ].filter(function (item) {
        return item.indexOf(req.params.prefix) === 0;
    }))
});

module.exports = router;
