var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var path = require('path');
mongoose.connect('mongodb://localhost/restful');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
var TaskSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 3},
    description: {type: String, required: true, minlength: 4},
    completed: {type:Boolean, default:false}

}, {timestamps: true});


var Task = mongoose.model('Task', TaskSchema);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/MyAngularApp/dist'));
app.set('view engine', 'ejs');

app.get('/tasks', function(req, res){
    console.log("hello");
    Task.find({}, function(err,tasks){
        if(err){
            console.log("No dice");
        }
        else{
            console.log("HELLO");
            console.log(tasks);
            res.json({message:"hello!!!!", 'data':tasks});
        
        }
    })
})
app.post('/create', function(req,res){
    var task = req.body.task;
    var newtask = new Task(req.body);
    newtask.save(function(err){
        if(err){
            console.log('ISSUE HERE',err);
        }
        else{
            console.log('success');
            res.json({data:newtask});
        }
    })
})

app.delete('/task/:id', function(req,res){
    var id = req.params.id;
    Task.findByIdAndRemove(id, function(err,task){
        if(err){
            console.log('problem', err);
        }
        else{
            res.json({data:task});
        }
    })

})
app.get('/task/:id', function(req,res){
    var id = req.params.id;
    Task.findById(id, function(err,task){
        if(err){
            console.log('problem', err);
        }
        else{
            res.json({message:"You did it", data:task});
        }
    });
})
app.put('/task/:id', function(req,res){
   var id = req.params.id;
    Task.findByIdAndUpdate(id, req.body, function(err,task){
        if(err){
            console.log("Issue", err);
        }
        else{
            res.json({data:task});
        }
    })
})
app.listen(8000, function() {
    console.log("listening on port 8000");
})
