var express = require('express');
var router = express.Router();
var shared = require('./shared');
var http = require('http');
var service = require('./service');
var NodeCache = require( "node-cache" );

//21600 seconds 6 hours
var myCache = new NodeCache( { stdTTL: 21600, checkperiod: 120 } );
/* GET home page. */

router.get('/', function (req, res) {
    var title="Projects Summary";
    service.getLiveProjectsInfo(function (data) {
        res.render('projects',
        {
            title:title,
            "data": data,
            "projects": shared.projects
        });
    });
});
router.get('/summary', function (req, res) {
    var summaryData;
    summaryData = myCache.get("summaryData");
    var title="Projects Summary";
    if (summaryData != undefined) {
        res.render('summary', {
            title: title,
            renderData: summaryData
        });
    } else {
        service.getLiveSummary(function (data) {

            myCache.set("summaryData", data);
            res.render('summary', {
                title: title,
                renderData: data
            });
        });
    }
});

router.get('/:project', function (req, res) {
    var projectPara = req.params.project;
    var cacheName=projectPara+"_Data";
    var cacheData = myCache.get(cacheName);
    var title=projectPara;

    if ( cacheData == undefined ){
        service.getLiveProjectDetail(projectPara,function (data) {
            myCache.set( cacheName, data );

            res.render('project', {
                title:title,
                renderData:data
            });
        });
    }
    else{
        res.render('project',{
            title:title,
            renderData:cacheData
        });
    }
});
module.exports = router;