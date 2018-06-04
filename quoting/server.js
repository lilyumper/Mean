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
mongoose.connect('mongodb://localhost/quoting');
mongoose.Promise = global.Promise;
var userSchema = new mongoose.Schema({
    name: String,
    message: String

})
mongoose.model('User',userSchema);
var User = mongoose.model('User');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    res.render('index');
})
// Add User Request 
app.post('/success', function(req, res) {
    console.log("POST DATA", req.body);
    var user = new User(req.body.body);
    user.save(function(err){
        if(err){
            console.log('something went wrong');
        }
        else{
            console.log('successfully added a quote!');
            res.redirect('/dojo');
        }
    })
})
app.get('/dojo', function(req, res){
    User.find({}, function(err,users){
        if(err){
            console.log('What you Takling about Willis')
        }
        else{
            res.render('dojo', {users:users});
        }
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
