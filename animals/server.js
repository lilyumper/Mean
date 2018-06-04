// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/animals');
mongoose.Promise = global.Promise;
var animalSchema = new mongoose.Schema({
    name: { type:String, required: true, minlength: 2},
    animal_type: {type:String, required: true, minlength: 2},
    color: {type:String, required: true, minlength: 3}
    

})
mongoose.model('Animal',animalSchema);
var Animal = mongoose.model('Animal');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    Animal.find({}, function(err,animals){
        if(err){
            console.log('What you Talking About Willis');
        }
        else{
            res.render('index', {animals:animals});
        }
    })
})
app.get('/new', function(req, res){
    res.render('new');
})

app.get('/show/:id', function(req, res){
    Animal.findOne({_id: req.params.id},function(err,animals){
        if(err){
            console.log("Something went wrong");
        }
        else{
            res.render('show', {animals:animals});
        }

    });
})
app.post('/add', function(req, res){
    var animal= new Animal(req.body);
    animal.save(function(err){
        if (err){
            console.log(animal.errors);
            res.render('new', {errors: animal.errors});
            
        }
        else{
            res.redirect('/');
        }

    })
})
app.get('/edit/:id', function(req, res){
    Animal.findOne({_id: req.params.id},function(err,animals){
        if(err){
            console.log("Shut Down");
        }
        else{
            res.render('edit', {animals:animals});
        }
    })
})
app.post('/update/:id', function(req,res){
    Animal.findOne({_id: req.params.id}, function(err, animal){
        if(err){
            console.log("Can't Do it");
            res.redirect('/edit/:id');
        }
        else{
            animal.name = req.body.name,
            animal.animal_type = req.body.animal_type,
            animal.color = req.body.color
            animal.save(function(err){
                if(err){
                    console.log("DEAD WRONG");
                }
                else{

                    res.redirect('/');
                }
            })
            
        }
    })
})
app.get('/delete/:id', function(req,res){
    Animal.remove({_id: req.params.id}, function(err){
        if(err){
            console.log("No animals here");
        }
        else{
            res.redirect('/');
        }
    })
})
app.listen(8000, function() {
    console.log("listening on port 8000");
})


