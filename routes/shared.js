// Basic template based on: http://learn.jquery.com/using-jquery-core/document-ready/

var _this = this;
var projects = [
    {
        name: "CMS",
        query: 'q=(+PATH:"/app:company_home//*" )',
        isVirtual:true
    },
    {
        name: "PICTURESG",
        query: 'q=(+PATH:"/app:company_home/cm:NLB_Project/cm:GT/cm:PictureSG//*"  AND @NCMS\:Dc_format_m:"image")'
    },
    {
        name: "SM",
        query: 'q=(+PATH:"/app:company_home/cm:NCMS/cm:SMP/cm:WEB//*" OR +PATH:"/app:company_home/cm:NCMS/cm:SMP/cm:BACKEND//*")',
        baseURL:'http://ncmsr.nlb.gov.sg/solr/alfresco/afts?wt=json&fl=*&indent=on&'
    },
    {
        name: "HISTORYSG",
        query: 'q=(+PATH:"/app:company_home/cm:NLB_Project/cm:HistorySG//*")'
    },
    {
        name: "INFOPEDIA",
        query: 'q=(@NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Singapore Infopedia" AND @NCMS\:dc_type_m:"nlbt:article" AND @NCMS\:Dc_format_m:"text/html")'
    },
    {
        name: "MUSICSG",
        query: 'q=(+PATH:"/app:company_home/cm:NLB_Project/cm:MusicSG//*")'
    },
    {
        name: "NORA",
        query: 'q=(+@NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>NORA*" AND @NCMS\:userStatus:"Published")'
    },
    {
        name: "WAS",
        query: 'q=(+PATH:"/app:company_home/cm:NLB_Project/cm:GT//*" AND @NCMS\:Relation_isPartOf:"*>>WAS*" AND @NCMS\:dc_type_m:"nlbt:Website")'
    },
    {
        name: "BookSG",
        query: 'q=((@NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Singapore Heritage Collection" AND @NCMS\:Dc_format_m:"application/pdf")OR (@NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>British Library\: Southeast Asia"  AND @NCMS\:Dc_format_m:"application/pdf") OR (@NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Retro"  AND @NCMS\:Dc_format_m:"application/pdf")OR @NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Rare Materials Collection" OR @NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Digital Legal Deposit"  OR @NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Donors\' Collections" OR (@NCMS\:Relation_isPartOf:"Collection:NLB Collections>>Singapore Collection>>Singapore Heritage Collection>>Illustrations {18502046}" OR @NCMS\:Relation_isPartOf:"_Collections:Illustrations {18502045}"))'    }
];
exports.projects = projects;

var facetFields = [
    { name: "User-Status", field: '@{NCMS.model}userStatus', multiple: false },
    { name: "MineType", field: '@{http://www.alfresco.org/model/content/1.0}content.mimetype', multiple: true },
    { name: "DC-Type", field: '@{NCMS.model}dc_type_m.u', multiple: true },
    { name: "Language", field: '@{NCMS.model}dc_language_m.u', multiple: true }
];
exports.facetFields = facetFields;

var typeList = [
    { name: "Still images (Photographic)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Photograph {18335736}', container: "Image-based" },
    { name: "Still images (Posters)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Poster {18335739}', container: "Image-based" },
    { name: "Still images (Postcards)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Postcard {18335738}', container: "Image-based" },
    { name: "Still images (MONO)", field:"@NCMS\:Relation_isPartOf" , value: 'Collection:NLB Collections>>Singapore Collection>>Singapore Heritage Collection>>Illustrations {18502046}|_Collections:Illustrations {18502045}', container: "Image-based" },

    { name: "Maps", field:"@NCMS\:dc_type_m" , value: 'nlbt:Map {18335728}', container: "Text-based" },
    { name: "Monographs", field:"@NCMS\:dc_type_m" , value: 'nlbt:Book {18335717}|nlbt:Digitised Book {18335805}|nlbt:Electronic Book {18335721}|nlbt:Bibliography {18335715}|nlbt:Conference Proceedings {18336006}|nlbt:Research Report {18335740}', container: "Text-based" },
    { name: "Periodicals", field:"@NCMS\:dc_type_m" , value: 'nlbt:Periodical {18335735}|nlbt:Digitised Periodical {18335985}|nlbt:Electronic Periodical{18335722}|nlbt:Directory {18540421}|nlbt:Annual Report {18336015}', container: "Text-based" },
    { name: "Manuscripts", field:"@NCMS\:dc_type_m" , value: 'nlbt:Manuscript {18335727}|nlbt:E-mail {18540420}' , container: "Text-based" },
    { name: "Ephemera / Documents", field:"@NCMS\:dc_type_m" , value: 'nlbt:Pamphlet {18335734}|nlbt:Document {18335981}|nlbt:Programme {18498410}|nlbt:Ephemera {18491069}|nlbt:Newspaper Article {18335895}|nlbt:Magazine Article {18335989}', container: "Text-based" },
    { name: "Music scores", field:"@NCMS\:dc_type_m" , value: 'nlbt:Music Score {18335730}' , container: "Text-based" },
    { name: "Lyrics", field:"@NCMS\:dc_type_m" , value: 'nlbt:Lyrics {18336017}' , container: "Text-based" },
    { name: "Album booklets", field:"@NCMS\:dc_type_m" , value: 'nlbt:Album {18336016}', container: "Text-based" },

    { name: "Articles", field:"@NCMS\:dc_type_m" , value: 'nlbt:Article {18335714}', container: "Web-based" },
    { name: "Websites (instances)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Website {18335747}', container: "Web-based" },

    { name: "Personal memories", field:"@NCMS\:dc_type_m" , value: 'nlbt:Recollection {18498455}|NLB Type List : Recollection {18498455}', container: "Multimedia-based" },
    { name: "Sound recordings (Music)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Sound Recording (Musical) {18335743}', container: "Multimedia-based" },
    { name: "Sound recordings (Non-Music)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Sound Recording (Non Musical) {18336012}', container: "Multimedia-based" },
    { name: "Sound recordings (Oral History)", field:"@NCMS\:dc_type_m" , value: 'nlbt:Oral History {18336086}', container: "Multimedia-based" },
    { name: "Moving images", field:"@NCMS\:dc_type_m" , value: 'nlbt:Video Recording {18335746}', container: "Multimedia-based" }
];

exports.getTypeContainer = function getTypeContainer(type) {
    var container="";
    for(var i=0;i<typeList.length;i++){
        if(type==typeList[i].name){
            container=typeList[i].container;
        }
    }
    return container;
};

exports.typeList = typeList;

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
exports.monthNames = monthNames;


exports.getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.removePrefix = function removePrefix(value) {
    value = value.replace('{en}', '');
    return value;
};

exports.getFacetValues = function getFacetValues(facetField) {
    
    var array = [];
    var status = "";
    var value = "";
    for (var i = 0; i < facetField.length; i++) {
        if (i % 2 == 0) {
            status = _this.removePrefix(facetField[i]);
        }
        else {
            value = facetField[i];
            var item = {
                "item": status,
                "value": value
            };
            //console.info(removePrefix(status) + ' ' + value);
            array.push(item)
        }
    }
    //console.info(array);
    return array;
};