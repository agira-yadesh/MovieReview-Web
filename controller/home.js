const Review = require("../models/reviews");



exports.reviewPage = function (req, res) {
  res.render("review", { pgTitle: "write a review" , isAuthenticated: req.session.isLoggedIn});
};

exports.allreviewPage = function (req, res) {
  Review.findAll().then((r) => {
    res.render("allReviews", {
      totalReviews: r.length,
      reviews: r,
      pgTitle: "Movies Review",
      isAuthenticated: req.session.isLoggedIn
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
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

exports.landingPage = function (req, res) {
  console.log('IsAuthenticated:', req.session.isLoggedIn);
  console.log('Session Object:', req.session);
   res.render("index", { pgTitle: "Quentin Tarantino's", isAuthenticated: req.session.isLoggedIn, isAuthenticated2: req.query.logged});
};

exports.thanksPage = function (req, res) {
  res.render("thanks", { pgTitle: "Thank you", isAuthenticated: req.session.isLoggedIn });
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

  req.user.createReview({
      name: name,
      movie: movie,
      review: review,
      rating: rating, 
      date: date,
    })
    .then((result) => {
      console.log("Created Product");
      res.redirect("/thanks");
    })
    .catch((err) => {
      console.log(err);
    });
};

