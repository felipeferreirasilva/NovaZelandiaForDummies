const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require('request');
const methodOverride = require('method-override');

mongoose.connect('mongodb://nzfd:nzfd6079@mongo_nzfd:27017/nzfd');
// mongoose.connect('mongodb://localhost/nzfd');

const Questions = mongoose.model('Question', {
    title: String,
    answer: String,
    category: String,
    approved: Boolean
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/questions', function(req, res){
    var query = req.query.search;
    if(query){
        Questions.find({answer: { $regex: query, $options: 'i'}}, function(err, data){
            if(err){
                console.log('Erro ao carregar perguntas ' + err);
            }else{
                res.render('questions', {questions: data});
            }
        });
    }else{
        Questions.find({}, function(err, data){
            if(err){
                console.log('Erro ao carregar perguntas ' + err);
            }else{
                res.render('questions', {questions: data});
            }
        });
    }
});

app.post('/questions', function(req, res){
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category}
    Questions.create(question);
    res.redirect('/questions/new');
});

app.get('/questions/new', function(req, res){
    res.render('newquestion');
})

app.put('/questions/:id', function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var answer = req.body.answer;
    var category = req.body.category;
    var question = {title: title, answer: answer, category: category}
    
    Questions.findByIdAndUpdate(id, question, function(err, data){
        if(err){
            console.log('Não foi possivel atualizar ' + err);
        }else{
            res.redirect('/questions');
        }
    });
});

app.get('/questions/:id/edit', function(req, res){
    var id = req.params.id;
    Questions.findById(id, function(err, data){
        if(err){
            console.log('Erro ao buscar pergunta ' + err);
        }else{
            res.render('updatequestion', {question: data});
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port %s', port);
});