var express = require('express');
var moment = require('moment');
var router = express.Router();
var shared = require('./shared');
var http = require('http');
var _ = require('underscore');
var service = require('./service');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://172.30.11.195:3306/cmsstatistic';

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'CMS Report' });
});

router.get('/report', function (req, res) {
    var year = new Date().getFullYear();
    var month = (new Date().getMonth()+1);
    res.redirect(301, '/report/'+year+'/'+month);
});

router.get('/report/:project', function (req, res) {
    var projectPara = req.params.project;
    var projects = shared.projects;
    var title=projectPara;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var report = db.collection('report');
        var query = { project:projectPara};

        report.aggregate([
            {
                $match: query
            },
            {
                $group : {
                    _id : {  year: { $year: "$date" },month: { $month: "$date" } },
                    date : { $first : '$date' },
                    total: { $sum: '$value' }
                }
            },
            {
                $sort:{
                    _id: 1
                }
            },
            {
                $project:{
                    _id   : 0,
                    date:1,
                    total:1
                }
            }
        ],function (err, result) {
            assert.equal(null, err);
            var data=result;

            for(var i=0;i<data.length;i++){

                if(moment(data[i].date).isValid()){
                    data[i].date=moment(data[i].date).local().format("YYYY-MM-DD");
                }
            }
            //var data=[{"date":"2012-07-27","value":13},{"date":"2012-07-28","value":11},{"date":"2012-07-29","value":15},{"date":"2012-07-30","value":16},{"date":"2012-07-31","value":18},{"date":"2012-08-01","value":13},{"date":"2012-08-02","value":22},{"date":"2012-08-03","value":23},{"date":"2012-08-04","value":20},{"date":"2012-08-05","value":17},{"date":"2012-08-06","value":16},{"date":"2012-08-07","value":18},{"date":"2012-08-08","value":21},{"date":"2012-08-09","value":26},{"date":"2012-08-10","value":24},{"date":"2012-08-11","value":29},{"date":"2012-08-12","value":32},{"date":"2012-08-13","value":18},{"date":"2012-08-14","value":24},{"date":"2012-08-15","value":22},{"date":"2012-08-16","value":18},{"date":"2012-08-17","value":19},{"date":"2012-08-18","value":14},{"date":"2012-08-19","value":15},{"date":"2012-08-20","value":12},{"date":"2012-08-21","value":8},{"date":"2012-08-22","value":9},{"date":"2012-08-23","value":8},{"date":"2012-08-24","value":7},{"date":"2012-08-25","value":5},{"date":"2012-08-26","value":11},{"date":"2012-08-27","value":13},{"date":"2012-08-28","value":18},{"date":"2012-08-29","value":20},{"date":"2012-08-30","value":29},{"date":"2012-08-31","value":33},{"date":"2012-09-01","value":42},{"date":"2012-09-02","value":35},{"date":"2012-09-03","value":31},{"date":"2012-09-04","value":47},{"date":"2012-09-05","value":52},{"date":"2012-09-06","value":46},{"date":"2012-09-07","value":41},{"date":"2012-09-08","value":43},{"date":"2012-09-09","value":40},{"date":"2012-09-10","value":39},{"date":"2012-09-11","value":34},{"date":"2012-09-12","value":29},{"date":"2012-09-13","value":34},{"date":"2012-09-14","value":37},{"date":"2012-09-15","value":42},{"date":"2012-09-16","value":49},{"date":"2012-09-17","value":46},{"date":"2012-09-18","value":47},{"date":"2012-09-19","value":55},{"date":"2012-09-20","value":59},{"date":"2012-09-21","value":58},{"date":"2012-09-22","value":57},{"date":"2012-09-23","value":61},{"date":"2012-09-24","value":59},{"date":"2012-09-25","value":67},{"date":"2012-09-26","value":65},{"date":"2012-09-27","value":61},{"date":"2012-09-28","value":66},{"date":"2012-09-29","value":69},{"date":"2012-09-30","value":71},{"date":"2012-10-01","value":67},{"date":"2012-10-02","value":63},{"date":"2012-10-03","value":46},{"date":"2012-10-04","value":32},{"date":"2012-10-05","value":21},{"date":"2012-10-06","value":18},{"date":"2012-10-07","value":21},{"date":"2012-10-08","value":28},{"date":"2012-10-09","value":27},{"date":"2012-10-10","value":36},{"date":"2012-10-11","value":33},{"date":"2012-10-12","value":31},{"date":"2012-10-13","value":30},{"date":"2012-10-14","value":34},{"date":"2012-10-15","value":38},{"date":"2012-10-16","value":37},{"date":"2012-10-17","value":44},{"date":"2012-10-18","value":49},{"date":"2012-10-19","value":53},{"date":"2012-10-20","value":57},{"date":"2012-10-21","value":60},{"date":"2012-10-22","value":61},{"date":"2012-10-23","value":69},{"date":"2012-10-24","value":67},{"date":"2012-10-25","value":72},{"date":"2012-10-26","value":77},{"date":"2012-10-27","value":75},{"date":"2012-10-28","value":70},{"date":"2012-10-29","value":72},{"date":"2012-10-30","value":70},{"date":"2012-10-31","value":72},{"date":"2012-11-01","value":73},{"date":"2012-11-02","value":67},{"date":"2012-11-03","value":68},{"date":"2012-11-04","value":65},{"date":"2012-11-05","value":71},{"date":"2012-11-06","value":75},{"date":"2012-11-07","value":74},{"date":"2012-11-08","value":71},{"date":"2012-11-09","value":76},{"date":"2012-11-10","value":77},{"date":"2012-11-11","value":81},{"date":"2012-11-12","value":83},{"date":"2012-11-13","value":80},{"date":"2012-11-14","value":81},{"date":"2012-11-15","value":87},{"date":"2012-11-16","value":82},{"date":"2012-11-17","value":86},{"date":"2012-11-18","value":80},{"date":"2012-11-19","value":87},{"date":"2012-11-20","value":83},{"date":"2012-11-21","value":85},{"date":"2012-11-22","value":84},{"date":"2012-11-23","value":82},{"date":"2012-11-24","value":73},{"date":"2012-11-25","value":71},{"date":"2012-11-26","value":75},{"date":"2012-11-27","value":79},{"date":"2012-11-28","value":70},{"date":"2012-11-29","value":73},{"date":"2012-11-30","value":61},{"date":"2012-12-01","value":62},{"date":"2012-12-02","value":66},{"date":"2012-12-03","value":65},{"date":"2012-12-04","value":73},{"date":"2012-12-05","value":79},{"date":"2012-12-06","value":78},{"date":"2012-12-07","value":78},{"date":"2012-12-08","value":78},{"date":"2012-12-09","value":74},{"date":"2012-12-10","value":73},{"date":"2012-12-11","value":75},{"date":"2012-12-12","value":70},{"date":"2012-12-13","value":77},{"date":"2012-12-14","value":67},{"date":"2012-12-15","value":62},{"date":"2012-12-16","value":64},{"date":"2012-12-17","value":61},{"date":"2012-12-18","value":59},{"date":"2012-12-19","value":53},{"date":"2012-12-20","value":54},{"date":"2012-12-21","value":56},{"date":"2012-12-22","value":59},{"date":"2012-12-23","value":58},{"date":"2012-12-24","value":55},{"date":"2012-12-25","value":52},{"date":"2012-12-26","value":54},{"date":"2012-12-27","value":50},{"date":"2012-12-28","value":50},{"date":"2012-12-29","value":51},{"date":"2012-12-30","value":52},{"date":"2012-12-31","value":58},{"date":"2013-01-01","value":60},{"date":"2013-01-02","value":67},{"date":"2013-01-03","value":64},{"date":"2013-01-04","value":66},{"date":"2013-01-05","value":60},{"date":"2013-01-06","value":63},{"date":"2013-01-07","value":61},{"date":"2013-01-08","value":60},{"date":"2013-01-09","value":65},{"date":"2013-01-10","value":75},{"date":"2013-01-11","value":77},{"date":"2013-01-12","value":78},{"date":"2013-01-13","value":70},{"date":"2013-01-14","value":70},{"date":"2013-01-15","value":73},{"date":"2013-01-16","value":71},{"date":"2013-01-17","value":74},{"date":"2013-01-18","value":78},{"date":"2013-01-19","value":85},{"date":"2013-01-20","value":82},{"date":"2013-01-21","value":83},{"date":"2013-01-22","value":88},{"date":"2013-01-23","value":85},{"date":"2013-01-24","value":85},{"date":"2013-01-25","value":80},{"date":"2013-01-26","value":87},{"date":"2013-01-27","value":84},{"date":"2013-01-28","value":83},{"date":"2013-01-29","value":84},{"date":"2013-01-30","value":81}]
            res.render('report/project', {
                "title":title,
                "renderData":data,
                "project": projectPara,
                "projects": projects
            });
            db.close();
        });
    });

});

router.get('/report/:year/:month', function (req, res) {
    var year = req.params.year;
    var month = req.params.month;
    var firstDay = new Date(year, month - 1, 1);
    var lastDay = new Date(year, month, 1);

    var query = { date: { $gte: firstDay, $lt: lastDay } };
    //var report = db.get('report');
    var currentYear = new Date().getFullYear();
    var years = [(currentYear-1),currentYear];
    var monthNames = shared.monthNames;
    var title=year+"-"+month+" Projects Summary";
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        
        var report = db.collection('report');
        
        report.find(query).toArray(function (err, docs) {
            report.aggregate([
                {
                    $match: { $and:[query,{project: { $ne: "CMS" }}]}
                }, 
                {
                    $group: { _id: '$project', total: { $sum: '$value' } }
                }
            ]).toArray(function (err, result) {
                assert.equal(null, err);
                for(var i=0;i<docs.length;i++){
                    var type=docs[i].type;
                    var container=shared.getTypeContainer(type);
                    docs[i]=_.extend(docs[i],{"container":container});
                }

                res.render('report', {
                    "data" : docs,
                    "title":title,
                    "groupData" : result,
                    "year": year,
                    "month": month,
                    "monthNames":monthNames,
                    "years":years
                });
                db.close();
            });
        });
    });
});

router.get('/insertSummaryDataToDB/', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var report = db.collection('report');
        service.getLiveSummary(function (data) {
            var _list=data.data;
            var _date=new Date(data.year,data.month-1,1);
            for (var i = 0; i < _list.length; i++) {
                var item=_list[i];
                var project=item.project;
                var type=item.type;
                var status=item.status;
                var value=item.value;
                var reportItem={ project: project, type: type, status: status, value: value, date: _date };

                report.insertOne(reportItem);
            }
            res.render('fake', {
                "counter" : _list.length
            });
        });
    });
});

router.get('/insertFakeData/:year', function (req, res) {
    var year = req.params.year;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var report = db.collection('report');
        service.getLiveSummary(function (data) {
            var _list=data.data;
            //var _date=new Date(data.year,data.month-1,1);
            var itemList=[];

            for (var i = 0; i < _list.length; i++) {
                var item=_list[i];
                var project=item.project;
                var type=item.type;
                var status=item.status;
                var value=item.value;
                for (var j = 0; j < 12; j++) {
                    var date = new Date(year, j, 1);
                    var random = shared.getRandomInt(10, 1000);
                    var _value=Math.round(value*((j+1)/10)+random);
                    //var reportItem={ project: project, type: type, status: status, value: _value, date: date };
                    var reportItem={ project: project, date: date, type: type, status: status, value: _value };

                    itemList.push(reportItem);
                    //report.insertOne(reportItem);
                }
            }
            report.insertMany(itemList, function(err, r) {
                db.close();
            });

            res.render('fake', {
                "counter" : _list.length
            });
        });
    });
});
//router.get('/insertFakeData/', function (req, res) {
//    var year = req.params.year;
//    var report = db.get('report');
//
//    var statusList = ["Published", "Draft", "Unpublished"];
//    var projectList = ["BookSG", "PictureSG", "SMP", "NORA", "Infopedia", "MusicSG"];
//    var typeList = ["Posters", "Postcards", "Still images", "Ephemera", "Manuscripts", "Maps", "Monographs", "Periodicals", "Articles"];
//
//    var counter = 0;
//    report.remove({}, {}, function (e) {
//
//        for (var i = 0; i < 12; i++) {
//            var date = new Date(2015, i, 1);
//            for (index = 0; index < statusList.length; index++) {
//                var status = statusList[index];
//                for (j = 0; j < typeList.length; j++) {
//                    var type = typeList[j];
//                    for (w = 0; w < projectList.length; w++) {
//                        var value = getRandomInt(10, 10000);
//                        var project = projectList[w];
//                        report.insert({ project: project, type: type, status: status, value: value, date: date });
//                        //console.log(counter+"--"+project + " " + date+ " "+ type + "--" + status + " " + value);
//                        counter++;
//                    }
//                }
//            }
//        }
//    });
//    console.log("render now: ");
//    res.render('fake', {
//        "counter" : counter
//    });
//});

module.exports = router;