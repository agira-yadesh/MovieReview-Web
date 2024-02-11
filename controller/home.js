const Review = require("../models/reviews");
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'moviesreviewhub00@gmail.com',
    pass: 'negv pcxq bmcs xret'
  },
});

exports.reviewPage = function (req, res) {
  res.render("review", { pgTitle: "write a review" , isAuthenticated: req.session.isLoggedIn, path: ""});
};

exports.allreviewPage = function (req, res) {
  Review.findAll().then((r) => {
    res.render("allReviews", {
      totalReviews: r.length,
      reviews: r,
      pgTitle: "Movies Review",
      isAuthenticated: req.session.isLoggedIn,
      path: ""
    });
  });
};

exports.myreviewPage = function (req, res) {

  req.user.getReviews()
  .then((r) => {
    res.render("myReviews", {
      totalReviews: r.length,
      reviews: r,
      pgTitle: "My Reviews",
      isAuthenticated: req.session.isLoggedIn,
      path: ""
    });
  });
};

exports.landingPage = function (req, res) {
  console.log('IsAuthenticated:', req.session.isLoggedIn);
  console.log('Session Object:', req.session);
   res.render("index", { pgTitle: "Quentin Tarantino's", isAuthenticated: req.session.isLoggedIn, isAuthenticated2: req.query.logged, path: ""});
};

exports.thanksPage = function (req, res) {
  res.render("thanks", { pgTitle: "Thank you", isAuthenticated: req.session.isLoggedIn, path: "" });
};

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}



exports.Post = function (req, res, next) {
  currentDate = new Date();
  const name = req.body.Name;
  const movie = req.body.movieName;
  const review = req.body.review;
  const rating = req.body.Rating;
  const date = formatDate(currentDate);

  // Create a review and associate it with the current user
  req.user.createReview({
    name: name,
    movie: movie,
    review: review,
    rating: rating,
    date: date,
  })
    .then((result) => {
      res.redirect("/thanks");
      const userEmail = req.user.dataValues.email;
      transporter.sendMail({
        to: userEmail,
        from: 'moviesreviewhub00@gmail.com',
        subject: 'Review Submitted',
        html: `<h1>Thank you for submitting your review!</h1><p>Your review for ${movie} has been received.</p>`,
      })
        .then((info) => {
          console.log("Email sent successfully:");
        })
        .catch((emailError) => {
          console.error("Error sending email:");
        });
    })
    .catch((err) => {
      console.log(err);
      // Handle the error, e.g., send an error response
      res.status(500).send("Internal Server Error");
    });
};



// exports.Post = function (req, res, next) {
//   currentDate = new Date();
//   const name = req.body.Name;
//   const movie = req.body.movieName;
//   const review = req.body.review;
//   const rating = req.body.Rating;
//   const date = formatDate(currentDate);

//   req.user.createReview({
//       name: name,
//       movie: movie,
//       review: review,
//       rating: rating, 
//       date: date,
//     })
//     .then((result) => {
//       res.redirect("/thanks");

      
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

