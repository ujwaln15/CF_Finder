const express = require('express');
const mongoose = require('mongoose');
const Problem = require('./models/problem');
const l2norm = require('compute-l2norm');

const fs = require('fs');

const { render } = require('ejs');
const { readFileSync } = require('graceful-fs');

const app = express();
key_to_idx = {};
const stopwords = fs.readFileSync('stopwords.txt').toString().split('\n');
const keywords = fs.readFileSync('keywords.txt').toString().split('\n');
let idf = fs.readFileSync('idf.txt').toString().split('\n');
idf = idf.map(Number);

let tfnorm = [];
let uptfidf = [];
for(let i = 0; i<keywords.length-1; i++){
    key_to_idx[keywords[i]]=i;
}
//Connecting to the Database
const dbURI = 'mongodb+srv://decryptr:KtkMg1YvGRTtgDv1@search-engine-problems.r1iwn.mongodb.net/problem-db?retryWrites=true&w=majority'
mongoose.connect(process.env.MONGODB_URI||dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=>{
        console.log('Connected to DB');
        Problem.find({},{norm:1, tfidf:1, _id:0})
            .then((result)=>{
                tfnorm = result.map(function(obj){
                    return obj.norm;
                });
                uptfidf = result.map(function(obj){
                    return obj.tfidf;
                });
                const PORT = process.env.PORT || 3000;
                app.listen(PORT);
            })
            .catch((err)=>{
                console.log(err);
            })
    })
    .catch((err)=>console.log(err))

//Setting the engine for processing views
app.set('view engine', 'ejs');

//Requests
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('index', {title: "Home"});
});

app.post('/',(req,res)=>{
    let query = req.body.query.toString().split(' ');
    let orig = req.body.query.toString().trim();
    query = query.map(el=>{
        return el.replace(/\W|_/g, '');
    })
    query = query.map(ele =>{
        return ele.toLowerCase();
    })
    query = query.filter((el)=>!stopwords.includes(el));
    query = query.filter((el)=>keywords.includes(el));
    if(query.length == 0){
        res.render('results',{title: 'Search Results', query:"", problems: {}});
    }else{
        const counts = {};
        for(const str of query){
            counts[str]=counts[str]?counts[str]+1:1;
        }
        const tfidf = [];
        for(let i=0; i<keywords.length; i++){
            if(query.includes(keywords[i])){
                tfidf.push(idf[i]*(counts[keywords[i]]/parseFloat(query.length)));
            }else{
                tfidf.push(parseFloat(0));
            }
        }
        tfidfnorm = l2norm(tfidf);
        similarity = [];
        for(let i=1; i<=7567; i++)
        {
            if(tfnorm[i-1]==0){
                continue;
            }
            let curr_sim = parseFloat(1)/(tfidfnorm*tfnorm[i-1]);
            let sum = 0;
            for(let j=0; j<query.length; j++){
                let word = query[j];
                let id = key_to_idx[word];
                if(word in uptfidf[i-1]){
                    sum += (tfidf[id]*parseFloat(uptfidf[i-1][word]));
                }
            }
            curr_sim = curr_sim*sum;
            similarity.push({
                sim: sum,
                id: i-1
            })
        }
        similarity.sort((a,b) => b.sim-a.sim);
        let res_ids=[];
        for(let i=0; i<Math.min(15,similarity.length); i++)
            res_ids.push(similarity[i].id);
        Problem.find({"id":{$in : res_ids}})
            .then((result)=>{
                res.render('results',{title: 'Search Results', query:orig, problems: result})
            })
            .catch((err)=>console.log(err))
    }
})

app.get('/results/:id', (req,res)=>{
    const id = req.params.id;
    Problem.findById(id)
        .then(result => {
            res.render('details', {title: 'Problem Details', prob: result})
        })
        .catch(err=>{
            console.log(err);
        })
});

app.use((req,res)=>{
    res.status(404).render('404',{title: "Oops!"})
})
