const { stringify } = require('ini');
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const problemSchema = new Schema({
    id:{
        type: Number
    },
    title:{
        type: String
    },
    url:{
        type: String
    },
    difficulty:{
        type: String
    },
    tags:{
        type: String
    },   
    tfidf:{
        type: Object
    },
    snippet:{
        type: String
    },
    statement:{
        type: String
    },
    norm:{
        type: Number
    }
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;

