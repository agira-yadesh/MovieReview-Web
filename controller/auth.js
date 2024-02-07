const User = require("../models/users");

const bcrypt = require("bcryptjs");

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isAuthenticated: false,
    isAuthenticated2: req.query.logged
  });
};

exports.getSignupPost = (req, res, next) => {
  const email = req.body.mailid;
  const password = req.body.password;

  User.findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        return res.redirect("/login");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          return User.create({
            email,
            password: hashedPassword,
          });
        })
        .then((newUser) => {
          return newUser.save();
        })
        .then((result) => {
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isAuthenticated: false,
    isAuthenticated2: req.query.logged
  });
};

exports.getLoginPost = async (req, res, next) => {
  const email = req.body.mailid;
  const password = req.body.password;
  User.findOne({where:{email: email}  })
    .then((user) => {
      if (!user) {
        return res.redirect("/signup");
      }
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/" + "?logged=true");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getLogoutPost = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/?logoutSuccess=true");
  });
};
