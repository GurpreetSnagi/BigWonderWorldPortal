const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//For Register Page
const registerView = (req, res) => {
  return res.render('register', {error: ''});
};

//Post Request for Register

const registerUser = (req, res) => {
  const { name, email, password, confirm, userType } = req.body;

  if (!name || !email || !password || !confirm) {
    return res.render('register', {error: 'Please enter all fields.'});
  }

  if(password.length < 8)
  {
    return res.render('register', {error: 'Password should contain atleast 8 characters'});
  }

  //Confirm Passwords

  if (password !== confirm) {
    return res.render('register', {error: 'Password must match'});
  } else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("email exists");
        return res.render('register', {error: 'Email exists!!, use different one'});
      } else {
        //Validation
        const newUser = new User({
          name,
          email,
          password,
          userType
        });
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(res.render("login", {error: ''}))
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
};

// For View
const loginView = (req, res) => {
  if(req.query.error)
  {
    return res.render('login', {error: 'Username or password is invalid'});
  }
  return res.render('login', {error: ''});
};

const logoutView = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.redirect('/');
};

// app.get('/logout', function(req, res){
//   if (req.isAuthenticated()) {
//     req.logout();
//   }
//   res.redirect('/');
// });

//Logging in Function

const loginUser = (req, res) => {
  const { email, password } = req.body;

  //Required
  if (!email || !password) {
    return res.render('login', {error: 'Please fill in all the fields'});    
  } else {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login?error=Invalid+username+or+password",
      failureFlash: true,
    })(req, res);
  }
};

module.exports = {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutView
};
