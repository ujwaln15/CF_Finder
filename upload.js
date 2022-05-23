const express = require('express');
const mongoose = require('mongoose');
const Problem = require('./models/problem');
const fs = require('fs');
const lineReader = require('line-reader');
const l2norm = require('compute-l2norm');

const { render } = require('ejs');

const app = express();

const titles = fs.readFileSync('../CF/cf_probs.txt').toString().split('\r\n');
const urls = fs.readFileSync('../CF/cf_probs_links.txt').toString().split('\r\n');
const tags = fs.readFileSync('../CF/cf_probs_tags.txt').toString().split('\r\n');
const difficulties = fs.readFileSync('../CF/cf_probs_difficulty.txt').toString().split('\r\n');
const keywords = fs.readFileSync('../CF/tf-idf/keywords.txt').toString().split('\r\n');
idx_to_key={}
for(let i = 0; i<keywords.length-1; i++){
    idx_to_key[i]=keywords[i];
}
// Connecting to the Database
const dbURI = 'mongodb+srv://decryptr:KtkMg1YvGRTtgDv1@search-engine-problems.r1iwn.mongodb.net/problem-db?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=>{
        console.log('Connected to DB');
        async function multiSave(){
            for(let cnt = 0; cnt<titles.length; cnt++)
            {
                let statementpath = '../CF/stats/prob';
                statementpath = statementpath.concat('',String(cnt+1));
                statementpath = statementpath.concat('.','txt');
                let tfidfpath = '../CF/tf-idf/tfidf-file-wise/prob';
                tfidfpath = tfidfpath.concat('',String(cnt+1));
                tfidfpath = tfidfpath.concat('.', 'txt');
                console.log(statementpath);
                console.log(tfidfpath);
                let statement = fs.readFileSync(statementpath).toString();
                let tfidf = fs.readFileSync(tfidfpath).toString();
                let tfidf_norm = tfidf.split(' ').map(Number)
                let norm = l2norm(tfidf_norm);
                let tfidf_dict={};
                for(let j=0; j<tfidf_norm.length; j++)
                {
                    if(tfidf_norm[j] != 0){
                        tfidf_dict[idx_to_key[j]]=tfidf_norm[j];
                    }
                }
                const prob = new Problem({
                    id: cnt,
                    title: titles[cnt],
                    url: urls[cnt],
                    difficulty: difficulties[cnt],
                    tags: tags[cnt],
                    tfidf: tfidf_dict,
                    snippet: statement.substring(0,150),
                    statement: statement,
                    norm: norm
                });
                await prob.save()
                    .then((result)=>{
                        console.log('Uploaded');
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            }
        }
        multiSave();
    })
    .catch((err)=>console.log(err))