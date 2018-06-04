var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
var bcrypt = require('bcrypt-as-promised');
app.use(session({ secret: "Yumper" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs")

mongoose.connect('mongodb://localhost/login');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Name must be at least 3 characters"],
        minlength: 3,
        trim: true
    },
    last_name: {
        type: String,
        required: [true, "Last Name must be a least 2 characters"],
        minlength: 2,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Must include a valid email"],
        unique: [true, "Email already exists"],
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
            },
            message: "{email} is not a valid email"
        }


    },
    password: {
        type: String,
        required: [true, "Password cannot be blank!"],
        minlength: [8, "Password has to be longer than 8 characters"],
        maxlength: [32, "Password cannot be longer than 32 charecters"],
        validate: {
            validator: function (password) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test(password);
            },
            message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        }

    },
    birthday: {
        type: Date,
        required: [true, "You must include a valid date"],
        validate: {
            validator: function (birthday) {
                return birthday.getTime() < new Date().getTime();
            },
            message: "Invalid Birthday! You aren't a time travler are you?"
        }
    }

}, { timestamp: true });

var User = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10).then(hash => {
        this.password = hash;
        console.log("this", next());
        next();
    })
})
app.get('/', function (req, res) {
    res.render('index');
})

app.post('/create', function (req, res) {
    console.log('heres the email', req.body.email)
    User.find({ email: req.body.email }, function (err, user) {
        if (user == 0) {
            console.log(req.body);
            if (req.body.password == req.body.cpass) {
                var newuser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    birthday: req.body.birthday,

                });
                
                newuser.save(function (err) {
                    console.log("saved");
                    if (err) {
                        User.find({}).exec(function (err) {
                            if (err) throw err;
                            console.log("You messed up!", err)
                            res.redirect('/');
                        })
                    }
                    else {
                        req.session.userID = newuser._id;
                        console.log("LUCKY")
                        res.render('success', { newuser: newuser });
                    }
                })




            }
            else{
                message:"Passwords do not match"
                res.redirect('/');
            }
        }
        else{
            let errors =[{'message': ''}];
            errors[0]['message'] = 'Email Address already exist!';
            res.render('index', {errors:errors});
        }

    })
})

app.post('/login', function(req, res){
    User.findOne({email:req.body.email}).exec(function(err, user){
        if(err){
            console.log("bad email");
            res.redirect('/');
        }
        if(user == null){
            console.log("user not found");
            res.redirect('/');
        }
        else{
            bcrypt.compare(req.body.password, user.password). then(results => {
                if(results == true){
                    req.session.userID = user._id;
                    res.render('success', {user:user});
                }
                else{
                    res.redirect('/');
                }
            })
            .catch(err => {
                console.log('incorrect password')
                res.redirect('/')
            })
        }
    })
})

app.post('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/');
})

var server = app.listen(8000, function() {
    console.log('Listening on port 8000!');
});