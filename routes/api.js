var express = require('express');
var service = require('./service');
var router = express.Router();

var http = require('http');

/* GET home page. */
router.get('/live', function (req, res) {
    service.getLiveProjectsInfo(function (data) {
        res.json(data);
    });
});
router.get('/live/summary', function (req, res) {
    service.getLiveSummary(function (data) {
        res.json(data);
    });
});
router.get('/live/:project', function (req, res) {
    var projectPara = req.params.project;
    service.getLiveProjectDetail(projectPara,function (data) {
        res.json(data);
    });
});

module.exports = router;