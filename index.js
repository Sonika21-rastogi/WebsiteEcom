const db = require('./connection')
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
const session = require("express-session");
const path = require('path');
const port = 2010;

//middle ware
var bodyparser =require('body-parser');
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname, "views"));
app.use(cookieParser());

// static file ko use karne ke liye
app.use(express.static(__dirname + '/public'));

// session configuration
app.use(session({
    secret:"secret-key",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:60000}
}));
 
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

 
// Register Route
app.post('/register', async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;   
     const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO loginuser(name,username,email,password,phone) VALUES (?,?,?,?,?)', [name,username,email,hashedPassword,phone ], (err, results) => {
        if (err) {
            res.send('Error during registration');
            console.error(err);
        } else {
            res.redirect('/login');
        }
    });
});

app.post('/login', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    if (name && password) {
        db.query('SELECT * FROM  loginuser WHERE name = ?', [name], async (err, results) => {
            if (err) {
                res.send('An error occurred');
                console.error(err);
                return;
            }
            if (results.length > 0) {
                const comparison = await bcrypt.compare(password, results[0].password);
                if (comparison) {
                    req.session.loggedin = true;
                    req.session.name = name; // Ensure this is a string
                    res.redirect('/dashboard');
                } else {
                    res.send('Incorrect name and/or Password!');
                }
            } else {
                res.send('Incorrect name and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

function auth(req, res, next) {
    if (req.session.name) { // Checking if user information is in the session
        return next();
    } else {
        res.redirect('/login');
    }
}

// Protected route 
app.get('/dashboard', auth, (req, res) => {
    if(req.session.loggedin){
     res.render('dashboard',{name:req.session.name});
    }else{
res.send('please login to view page');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});

app.listen(2010,function(){
console.log(`server is listening on localhost://http:${port}`)
});