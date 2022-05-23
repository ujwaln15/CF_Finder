const { stringify } = require('ini');
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const searchSchema = new Schema({
    id:{
        type: Number
    },
    similarity:{
        type: Number
    }
})