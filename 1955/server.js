var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var path = require('path');
mongoose.connect('mongodb://localhost/people');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3}
}, {timestamps: true});

var User = mongoose.model('User', UserSchema);
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', function (req, res){
    User.find({}, function(err, users){
        if (err){
            console.log("NO STUFFFFFFFFFFFFFDFFFFFFFFF");
        }
        else {
            res.json({message: "Hello!!!", data:users});
        }
    })
})

app.get('/new/:name/', function(req, res){
    name = req.params.name;
    var newperson = new User({name:name})
    newperson.save(function(err){
        if(err){
            console.log(message.errors);
        }
        else{
            console.log('success');
            res.redirect('/');
        }
    })
})
app.get('/remove/:name', function(req,res){
    name = req.params.name;
    User.remove({name:name}, function(err){
        if(err){
            console.log('NOOOOOOO');
        }
        else{
            console.log('THEY GONE!!!!!');
            res.redirect('/');
        }

    })
})

app.get('/:name', function(req,res){
    name = req.params.name;
    User.findOne({name:name}, function(err, name){
        if(err){
            console.log('Nobody home');
        }
        else{
            res.json({message:"here they are", data:name})
        }
    })
})
app.listen(8000, function() {
    console.log("listening on port 8000");
})
