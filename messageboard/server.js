var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/messageboard');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var MessageSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 4 },
    post: { type: String, required: true, minlength: 4 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
},
    { timestamps: true });
var CommentSchema = new mongoose.Schema({
    _message: { type: Schema.Types.ObjectId, ref: "Message" },
    name: { type: String, required: true, minlength: 4 },
    post: { type: String, required: true, minlength: 4 }

}, { timestamps: true });
mongoose.model('Message', MessageSchema);
mongoose.model("Comment", CommentSchema);
var Message = mongoose.model("Message");
var Comment = mongoose.model("Comment");
app.use(express.static(path.join(__dirname, './static')));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    Message.find({}, function (err, messages) {
        Comment.find({}).populate('comments').exec(function (err, comments) {
            console.log(messages);

            if (err) {
                console.log("What you doing?????");
            }
            else {

                res.render('index', {messages:messages, comments:comments })
            };
        });
    });
})

app.post('/create', function (req, res) {
    var message = new Message(req.body);
    message.save(function (err) {
        if (err) {
            console.log(message.errors);
            res.render('index', { errors: message.errors });
        }
        else {
            console.log('success');
            res.redirect('/');
        }
    })
})
app.post('/posts/:id', function (req, res) {
    Message.findOne({ _id: req.params.id }, function (err, message) {
        var comment = new Comment(req.body);
        comment._message = message._id;
        comment.save(function (err) {
            message.comments.push(comment);
            message.save(function (err) {
                if (err) {
                    console.log("OHHH NOOOO");
                    res.render('index', {errors: comment.errors});
                }
                else {
                    res.redirect('/');
                }
            });

        });
    });
});
app.listen(8000, function () {
    console.log("listening on port 8000");
})