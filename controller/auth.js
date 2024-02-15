const cryto = require("crypto");

const User = require("../models/users");
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require('express-validator');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "moviesreviewhub00@gmail.com",
    pass: "negv pcxq bmcs xret",
  },
});

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    isAuthenticated2: req.query.logged,
    errorMessage: message,
    path: "signup",
    input: {
      email:'',
      password:''
    },
    validationError:[]
  });
};

exports.getSignupPost = (req, res, next) => {
  const email = req.body.mailid;
  const password = req.body.password;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      isAuthenticated2: req.query.logged,
      errorMessage: errors.array()[0].msg,
      path: "signup",
      input: {
        email:email,
        password:password
      },
      validationError: errors.array()
    });
  }

  // User.findOne({ where: { email } })
  //   .then((existingUser) => {
  //     if (existingUser) {
  //       req.flash("error", "Email already exist do login");

  //       req.session.save(function () {
  //         return res.redirect("/signup");
  //       });
  //       return;
  //     }

       bcrypt
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
          return transporter.sendMail({
            to: email,
            from: "moviesreviewhub00@gmail.com",
            subject: "Signup Success",
            html: "<h1>You have successfully signed up!</h1><p>Login to write your movie reviews</p>",
          });
        })

        .then(() => {
          res.redirect("/login?signupSuccess=true");
        })
        .catch((emailError) => {
          console.error("Error sending email:", emailError);
          res.status(500).send("Error sending email");
        });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log(message);
  res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: message,
    path: "login",
    input: {
      email:''
    },
    validationError:[]
  });
};

exports.getLoginPost = (req, res, next) => {
  const email = req.body.mailid;
  const password = req.body.password;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      isAuthenticated2: req.query.logged,
      errorMessage: "Invalid email or password",
      path: "login",
      input: {
        email:email
      },
      validationError: []
    });
  }


  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        console.log(errors.array());
        return res.status(422).render("auth/login", {
          pageTitle: "login",
          isAuthenticated2: req.query.logged,
          errorMessage: errors.array()[0]?.msg || "Invalid email or password",
          path: "login",
          input: {
            email:email
          },
          validationError: errors.array()
        });
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
          return res.status(422).render("auth/login", {
            pageTitle: "login",
            isAuthenticated2: req.query.logged,
            errorMessage: "Invalid email or password",
            path: "login",
            input: {
              email:email
            },
            validationError: []
          });
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Change Password",
    errorMessage: message,
    path: ""
  });
};

exports.postReset = (req, res, next) => {
  cryto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ where: { email: req.body.mailid } })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1800000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.mailid,
          from: "moviesreviewhub00",
          subject: "Password reset request",
          html: `
        <h2> You requested a password reset</h2>
        <p>Click this <a href = "http://localhost:4000/reset/${token}">link</a> to change your password.</p>
        `,
        });
      })
      .catch((err) => {
        console.log(err);
        console.log(req.body.mailid);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({where:{ resetToken: token, resetTokenExpiration: {
    [Op.gt]: new Date(),
  }}})
    .then((user) => {
      if(!user){
        console.log('no user')
      }
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user.id.toString(),
        passwordToken: token,
        path: ""
      });
    })
    .catch((err) => {
      console.log(err);
    });
};



exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    where: {
      resetToken: passwordToken,
      resetTokenExpiration: {
        [Op.gt]: new Date(),
      },
      id: userId,
    },
  })
  .then(user => {
    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).send("User not found");
    }

    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    if (!hashedPassword) {
      throw new Error("Password hashing failed");
    }

    resetUser.password = hashedPassword;
    resetUser.resetToken = null;
    resetUser.resetTokenExpiration = null;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.error(err);
    res.status(500).send("Internal Server Error");
  });
};


// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;

//   User.findOne({
//     where: {
//       resetToken: passwordToken,
//       resetTokenExpiration: { $gt: Date.now() },
//       id: userId
//     },
//   })
//   .then(user => {
//     resetUser = user;
//     return bcrypt.hash(newPassword, 12);

//   })
//   .then(hashedPassword => {
//     resetUser.password = hashedPassword;
//     resetUser.resetToken = undefined;
//     resetUser.resetTokenExpiration = undefined;
//     return resetUser.save();
//   })
//   .then(result => {
//     res.redirect('/login');
//   })
//   .catch(err=>{
//     console.log(err);
//   });
// };

// negv pcxq bmcs xret
