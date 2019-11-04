var express = require("express");
var db = require("../models");
var bcrypt = require("bcrypt");
const saltRounds = 10;
var passport = require("passport");
var path = require("path");

module.exports = function (app) {
    // PAGE ROUTES

    // gets landing page //
    app.get('/landing', function (req, res, next) {
        console.log("on '/' user is " + (req.user));
        console.log("on '/' authentication is " + (req.isAuthenticated()));
        res.render('landing', { title: 'Welcome' });
    });

    // gets start page //
    app.get('/', function (req, res, next) {
        res.render('index', { title: 'Welcome to Chores.' });
    });

    app.get('/failure', function (req, res, next) {
        res.render('failure', { title: 'Login Failed' });
    });

    // gets success page //
    app.get('/success', function (req, res) {
        res.render('success', { title: 'Login Successful' });
    });

    // gets success page with leading 'api'//
    app.get('/api/success', function (req, res) {
        res.render('success', { title: 'Login Successful' });
    });
    // tests redirect page //
    // app.get('/redirect', authenticationMiddleware(), function (req, res) {
    //     res.render('success', { title: 'Login Successful' });
    // });

    // gets new chore page //
    app.get('/newChore', function (req, res, next) {
        res.render('newChore', { title: 'Please enter your new chore' });
    });

    // gets login page //
    app.get('/login', function (req, res, next) {
        res.render('login', { title: 'Please log in' });
    });

    // gets registration page //
    app.get('/register', function (req, res, next) {
        res.render('register', { title: 'Welcome' });
    });

    // logout user //
    app.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    // gets chores page//
    app.get('/chores', authenticationMiddleware(), function (req, res) {
        console.log("on 'chores' " + req.user);
        console.log("on 'chores' " + req.isAuthenticated());
        db.Chores.findAll({
            where: { user_id: req.user },
            order: [['due_date']]
        }).then(function (dbChores) {
            var hbsObject = {
                Chores: dbChores
            };
            return res.render('home', hbsObject);
        });
    })

    // gets chores page with "api" in URL
    app.get('/api/chores', function (req, res) {
        console.log("on 'api/chores' " + req.user);
        console.log("on 'api/chores' " + req.isAuthenticated());
        db.Chores.findAll({
            order: [['due_date']]
        }).then(function (dbChores) {
            var hbsObject = {
                Chores: dbChores
            };
            return res.render('home', hbsObject);
        });
    })

    // gets chore data for editing // 
    app.get("/api/getChore/:chore_id", function (req, res) {
        db.Chores.findAll(
            {
                where: { chore_id: req.params.chore_id }
            })
            .then(function (choreToEdit) {
                res.json(choreToEdit);
            });
    })

    // gets list of uncompleted chores for user //
    app.get("/api/choresTodoGet/:username", function (req, res) {
        db.Chores.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                username: req.params.username,
                chore_state: false
            }
        }).then(function (dbChores) {
            var hbsObject = {
                Chores: dbChores
            };
            res.render("home", hbsObject);
        });
    });

    // // gets list of completed chores for user //
    app.get("/api/choresDoneGet/:username", function (req, res) {
        db.Chores.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                username: req.params.username,
                chore_state: true
            }
        }).then(function (dbChores) {
            var hbsObject = {
                Chores: dbChores
            };
            res.render("home", hbsObject);
        });
    });


    ////////// POST ///////////

    // new user api post
    app.post("/api/newUser", function (req, res) {
        console.log("New User Registration triggered");
        // console.log(req);
        db.Users.count({ where: { username: req.body.username } })
            .then(result => {
                console.log(result)
                if (result > 0) {
                    console.log('Duplicate username. Please log in or try again.');
                    res.render("error", { title: 'Duplicate username. Please log in or try again.' });
                    return
                } else if (req.body.username === "") {
                    console.log('Username cannot be blank. Please try again.');
                    res.render('error', { title: 'Username is required.' });
                    return
                } else if (req.body.email === "") {
                    console.log('Email cannot be blank. Please try again.');
                    res.render('error', { title: 'Email is required.' });
                    return
                } else if (req.body.password.length < 8) {
                    console.log('Password too short. Please try again with a password of at least eight characters.');
                    res.render('error', { title: 'Password too short. Please try again.' });
                    return
                } else if (req.body.password != req.body.passwordMatch) {
                    console.log('Passwords do not match. Please try again.');
                    res.render('error', { title: 'Passwords do not match. Please try again.' });
                    return
                } else {
                    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                        db.Users.create({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                        }).then(function (results) {
                            console.log("is user logged before starting? " + req.isAuthenticated());
                            const user_id = results.dataValues.user_id;
                            req.login(user_id, function (err) {
                                console.log("is user logged in after login fired? " + req.isAuthenticated());
                                // if (err) throw err

                                res.sendFile(path.join(__dirname, "../views/success.handlebars"));
                                // res.redirect('/success');
                            })
                        });
                        console.log("is user logged in for use elsewhere? " + req.isAuthenticated());
                    })
                };
            });
    });

    // app.post("/login", passport.authenticate('local', {
    //     successRedirect: '/chores',
    //     failureRedirect: '/failure',
    // }));

    // login user // 
    app.post('/login',
        passport.authenticate('local', {
            // successRedirect: '/chores',
            failureRedirect: '/failure'
        }),
        function (req, res) {
            console.log(req.username),
                res.redirect('/chores');
        });

    // new chore api post
    app.post("/api/newChore", function (req, res) {
        db.Chores.create({
            username: req.body.username,
            chore: req.body.chore,
            overview: req.body.overview,
            due_date: req.body.due_date
        }).then(function (dbNewChore) {
            res.json(dbNewChore);
        });
    });

    ////////// PUT ///////////

    // Change status of chore to "done" //
    app.put("/api/choreStatus/:chore_id", function (req, res) {
        db.Chores.update(
            {
                chore_state: req.body.chore_state
            },
            {
                where: { chore_id: req.params.chore_id }
            })
            .then(function (newStatus) {
                res.json(newStatus);
            });
    })

    // Edit chore //
    app.put("/api/choreEdits/:chore_id", function (req, res) {
        console.log(req.params.chore_id)
        console.log(req.body.username)
        console.log(req.body.chore)
        console.log(req.body.overview)
        console.log(req.body.due_date)
        db.Chores.update(
            {
                username: req.body.username,
                chore: req.body.chore,
                overview: req.body.overview,
                due_date: req.body.due_date
            },
            {
                where: { chore_id: req.params.chore_id }
            })
            .then(function (newStatus) {
                res.json(newStatus);
            });
    })

    ////////// DELETE ///////////

    // delete chore //
    app.delete("/api/choreDelete/:chore_id", function (req, res) {
        db.Chores.destroy(
            {
                where: { chore_id: req.params.chore_id }
            })
            .then(function (result) {
                if (result === 1) {
                    console.log("Chore deleted");
                }
                res.json(result);
            })
    });

}

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next(
        );
        res.redirect('/')
    }
}
