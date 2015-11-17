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
    { name: "PHOTO", field:"@NCMS\:dc_type_m" , value: 'nlbt:Photograph {18335736}', container: "Image-based" },
    { name: "POSTER", field:"@NCMS\:dc_type_m" , value: 'nlbt:Poster {18335739}', container: "Image-based" },
    { name: "POSTCARD", field:"@NCMS\:dc_type_m" , value: 'nlbt:Postcard {18335738}', container: "Image-based" },
    { name: "MONO", field:"@NCMS\:Relation_isPartOf" , value: 'Collection:NLB Collections>>Singapore Collection>>Singapore Heritage Collection>>Illustrations {18502046}|_Collections:Illustrations {18502045}', container: "Image-based" },
    { name: "MAP", field:"@NCMS\:dc_type_m" , value: 'nlbt:Map {18335728}', container: "Text- based" },
    { name: "BOOK", field:"@NCMS\:dc_type_m" , value: 'nlbt:Book {18335717}|nlbt:Digitised Book {18335805}|nlbt:Electronic Book {18335721}', container: "Text-based" },
    { name: "BIBLIO", field:"@NCMS\:dc_type_m" , value: 'nlbt:Bibliography {18335715}', container: "Text-based" },
    { name: "CONF-PROCEED", field:"@NCMS\:dc_type_m" , value: 'nlbt:Conference Proceedings {18336006}', container: "Text-based" },
    { name: "RESEARCH_RPT", field:"@NCMS\:dc_type_m" , value: 'nlbt:Research Report {18335740}', container: "Text-based" },
    { name: "MAGZ", field:"@NCMS\:dc_type_m" , value: 'nlbt:Periodical {18335735}|nlbt:Digitised Periodical {18335985}|nlbt:Electronic Periodical{18335722}', container: "Text-based" },
    { name: "DIRECTORY", field:"@NCMS\:dc_type_m" , value: 'nlbt:Directory {18540421}', container: "Text-based" },
    { name: "POSTCARD", field:"@NCMS\:dc_type_m" , value: 'nlbt:Postcard {18335738}' , container: "Text-based" },
    { name: "ANNUAL", field:"@NCMS\:dc_type_m" , value: 'nlbt:Annual Report {18336015}', container: "Text-based" },
    { name: "LETTER", field:"@NCMS\:dc_type_m" , value: 'nlbt:Manuscript {18335727}' , container: "Text-based" },
    { name: "EMAIL", field:"@NCMS\:dc_type_m" , value: 'nlbt:E-mail {18540420}' , container: "Text-based" },
    { name: "PAMPHLET", field:"@NCMS\:dc_type_m" , value: 'nlbt:Pamphlet {18335734}', container: "Text-based" },
    { name: "INVOICE", field:"@NCMS\:dc_type_m" , value: 'nlbt:Document {18335981}' , container: "Text-based" },
    { name: "PROGRAMME", field:"@NCMS\:dc_type_m" , value: 'nlbt:Programme {18498410}' , container: "Text-based" },
    { name: "RECEIPT", field:"@NCMS\:dc_type_m" , value: 'nlbt:Ephemera {18491069}' , container: "Text-based" },
    { name: "NEWS-CLIP", field:"@NCMS\:dc_type_m" , value: 'nlbt:Newspaper Article {18335895}' , container: "Text-based" },
    { name: "MAGZ-CLIP", field:"@NCMS\:dc_type_m" , value: 'nlbt:Magazine Article {18335989}' , container: "Text-based" },
    { name: "MUSIC-SCORE", field:"@NCMS\:dc_type_m" , value: 'nlbt:Music Score {18335730}' , container: "Text-based" },
    { name: "LYRIC", field:"@NCMS\:dc_type_m" , value: 'nlbt:Lyrics {18336017}' , container: "Text-based" },
    { name: "ALBUM", field:"@NCMS\:dc_type_m" , value: 'nlbt:Album {18336016}', container: "Text-based" },
    { name: "ARTICLE", field:"@NCMS\:dc_type_m" , value: 'nlbt:Article {18335714}', container: "Web-based" },
    { name: "WEBSITE", field:"@NCMS\:dc_type_m" , value: 'nlbt:Website {18335747}', container: "Web-based" },
    { name: "MEMORY", field:"@NCMS\:dc_type_m" , value: 'nlbt:Recollection {18498455}|NLB Type List : Recollection {18498455}', container: "Multimedia-based" },
    { name: "MUSIC", field:"@NCMS\:dc_type_m" , value: 'nlbt:Sound Recording (Musical) {18335743}', container: "Multimedia-based" },
    { name: "NONMUSIC", field:"@NCMS\:dc_type_m" , value: 'nlbt:Sound Recording (Non Musical) {18336012}', container: "Multimedia-based" },
    { name: "ORAL-HIST", field:"@NCMS\:dc_type_m" , value: 'nlbt:Oral History {18336086}', container: "Multimedia-based" },
    { name: "MOV-IMG", field:"@NCMS\:dc_type_m" , value: 'nlbt:Video Recording {18335746}', container: "Multimedia-based" }
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