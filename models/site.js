const mongoose = require('mongoose');

var SiteSchema = new mongoose.Schema({
    Url:{
        type: String,
        required: true
    },
    HtmlLang:{
        type: String,
        required: false
    },
    MetaLocale:{
        type: String,
        required: false
    },
    MatchCount:{
        type: Number,
        required: false
    },
    RegexRule:{
        type: String,
        required: true
    },
    Products:{
        type: [String],
        required: false
    },
    StatusCode:{
        type: Number,
        required: false
    },
    StatusMessage:{
        type: String,
        required: false
    },
    Online:{
        type: Boolean,
        required: false        
    },
    Error:{
        type: String,
        required: false
    }
});

var Site = mongoose.model('Site', SiteSchema);

module.exports = {Site, SiteSchema}

