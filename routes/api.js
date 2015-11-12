var express = require('express');
var service = require('./service');
var router = express.Router();

var http = require('http');
//var monk = require('monk');
//var db = monk('172.30.11.195:3306/cmsstatistic');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://172.30.11.195:3306/cmsstatistic';
// Use connect method to connect to the Server

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

//router.get('/report/:year/:month', function (req, res) {
//    var year = req.params.year;
//    var month = req.params.month;
//    var firstDay = new Date(year, month - 1, 1);
//    var lastDay = new Date(year, month, 1);
//    var query = { date: { $gte: firstDay, $lt: lastDay } };
//    //var report = db.get('report');
//    var monthNames=shared.monthNames;
//    MongoClient.connect(url, function (err, db) {
//        assert.equal(null, err);
        
//        var report = db.collection('report');
        
//        report.find(query).toArray(function (err, docs) {
//            report.aggregate([
//                {
//                    $match: query
//                }, 
//                {
//                    $group: { _id: '$project', total: { $sum: '$value' } }
//                }
//            ]).toArray(function (err, result) {
//                assert.equal(null, err);
                
//                res.json({
//                    "data" : docs,
//                    "groupData" : result,
//                    "year": year,
//                    "month": month,
//                    "monthNames": monthNames
//                }); 
                
//                db.close();
//            });
//        });
//    });
//});

module.exports = router;