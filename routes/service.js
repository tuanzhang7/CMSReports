var express = require('express');
var shared = require('./shared');
var http = require('http');
var _ = require('underscore');

exports.getLiveSummary = function getLiveSummary(callback) {
    var today = new Date();

    var month = today.getMonth() + 1; //January is 0!
    var year = today.getFullYear();
    var _facetFields = [
        { name: "User-Status", field: '@{NCMS.model}userStatus', multiple: false }
    ];
    //var projects = shared.projects.slice(1);

    var projects = shared.projects;
    var typeList = shared.typeList;
    var summary =[];
    for (var i = 0; i < projects.length; i++) {
        var obj = projects[i];
        if(obj.isVirtual){
            projects.splice(i, 1);
        }
    }

    var tasksToGo = projects.length * typeList.length;
    projects.forEach(function (projectE) {
        //for loog not working here
        //for (var i = 0; i < projects.length; i++) {
        var project = projectE.name;
        var query = projectE.query;
        var baseURL=projectE.baseURL;
        typeList.forEach(function (type) {
            //for (var j = 0; j < typeList.length; j++) {
            var typeField = type.field;
            var typeValue = type.value;
            var typeName = type.name;
            var typeContainer = type.container;
            //multi
            var typeQuery = ' AND '+typeField+':"' + typeValue + '"';
            if (typeValue.indexOf('|') > 0) {
                var mult = typeValue.split('|');
                var temp = "";
                for (var x = 0; x < mult.length; x++) {
                    if (x == 0) {
                        temp = ' '+typeField+':"' + mult[x] + '"';
                    }
                    else {
                        temp = temp + ' OR '+typeField+':"' + mult[x] + '"';
                    }
                }
                typeQuery = ' AND (' + temp + ')';
            }

            var queryWithType = query + typeQuery;

            getLive(project, queryWithType, _facetFields,baseURL, function (data) {
                var _data = data[0].data;
                for (var k = 0; k < _data.length; k++) {
                    var name = _data[k].field;
                    var value = _data[k].value;

                    var status={
                        "name":name,
                        "value": value
                    };
                    var item = {
                        "project": project,
                        "type": typeName,
                        "status": name,
                        "value": value,
                        "container": typeContainer
                    };
                    summary.push(item);
                }
                if (--tasksToGo === 0) {
                    return callback({
                        "year": year,
                        "month": month,
                        "data" : summary
                    });
                }
            });
        })
    })
};

exports.getLiveProjectDetail = function getLiveProjectDetail(project,callback) {
    var projectPara = project;
    var today = new Date();

    var month = today.getMonth() + 1; //January is 0!
    var year = today.getFullYear();
    var projects = shared.projects;
    var facetFields = shared.facetFields;
    var scropQuery = '';
    var _project = '';
    var baseURL;
    for (var i = 0; i < projects.length; i++) {
        var name = projects[i].name;
        if (projectPara.toString().toLowerCase() === name.toString().toLowerCase()) {
            scropQuery = projects[i].query;
            _project = name;
            baseURL=projects[i].baseURL;
        }
    }
    
    if (scropQuery == '') {
        _project = projects[0].name;
        scropQuery = projects[0].query;
        baseURL=projects[0].baseURL;
    }
    
    getLive(_project, scropQuery, facetFields,baseURL, function (data) {
        return callback({
            "data" : data,
            "year": year,
            "month": month,
            "project": project,
            "projects": projects
        });
    // more code below using the filename
    });
};

exports.getLiveProjectsInfo = function getLiveProjectsInfo(callback) {
    var today = new Date();
    
    var month = today.getMonth() + 1; //January is 0!
    var year = today.getFullYear();
    var _facetFields = [
        { name: "User-Status", field: '@{NCMS.model}userStatus', multiple: false }
    ];
    var projects = shared.projects.slice(1);

    var summary =[];
    
    var tasksToGo = projects.length;
    projects.forEach(function (projectE) {
        //for loog not working here
        //for (var i = 0; i < projects.length; i++) {
        var project = projectE.name;
        var query = projectE.query;
        var baseURL=projectE.baseURL;
        getLive(project, query, _facetFields,baseURL, function (data) {
            var _data = data[0].data;
            for (var k = 0; k < _data.length; k++) {
                var status = _data[k].field;
                var value = _data[k].value;
                    
                var item = {
                    "project": project,
                    "status": status,
                    "value": value,
                    "date": today
                };
                summary.push(item);
            }
            if (--tasksToGo === 0) {
                return callback({
                    "data" : summary,
                    "year": year,
                    "month": month
                });
            }
        });
    })
};

function getLive(project, scropQuery, facetFields,baseURL, callback) {
    if (typeof baseURL === 'undefined') {
        baseURL = 'http://nlbcmsr.nlb.gov.sg/solr/alfresco/afts?wt=json&fl=*&indent=on&';
    }

    var facetQueryFiels = "";
    for (var i = 0; i < facetFields.length; i++) {
        var field = facetFields[i].field;
        facetQueryFiels = facetQueryFiels + '&facet.field=' + field;
    }
    var facetQuery = '&facet=true&facet.limit=10&facet.mincount=1&rows=0' + facetQueryFiels;
    //var query = scropQuery;//'q=+PATH:"/app:company_home/cm:NLB_Project/cm:GT/cm:PictureSG//*"  AND @NCMS\:Dc_format_m:"image"';
    var url = baseURL + scropQuery + facetQuery;
    //console.log('url: ' + url);
    
    http.get(url, function (res) {
        //console.log("Got response: " + res.statusCode);
        res.on('data', function (d) {
            var responseObject = JSON.parse(d);
            var facet_fields = responseObject.facet_counts.facet_fields;
            
            var date = new Date();
            var arrays = [];
            for (var i = 0; i < facetFields.length; i++) {
                var _field = facetFields[i].field;
                var name = facetFields[i].name;
                var multiple = facetFields[i].multiple;
                
                var facetArray = [];
                var facetValues = shared.getFacetValues(facet_fields[_field]);
                for (index = 0; index < facetValues.length; index++) {
                    var field = facetValues[index].item;
                    var value = facetValues[index].value;
                    var item = {
                        "project": project,
                        "field": field,
                        "value": value,
                        "date": date
                    };
                    facetArray.push(item);
                }
                var array = {
                    field: name,
                    multiple: multiple,
                    data: facetArray
                };
                arrays.push(array);
            }
            return callback(arrays);
        });
        
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}