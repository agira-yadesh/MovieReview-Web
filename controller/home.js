const Review = require("../models/reviews");
const nodemailer = require("nodemailer");

const itemPerPage = 9;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "moviesreviewhub00@gmail.com",
    pass: "negv pcxq bmcs xret",
  },
});

exports.reviewPage = function (req, res) {
  res.render("review", {
    pgTitle: "write a review",
    isAuthenticated: req.session.isLoggedIn,
    path: "",
  });
};

exports.allreviewPage = function (req, res) {
  const page = +req.query.page || 1;
  let totalItems;

  Review.count()
    .then((numReviews) => {
      totalItems = numReviews;
      console.log(totalItems);

      return Review.findAll({
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * itemPerPage,
        limit: itemPerPage,
      });
    })
    .then((r) => {
      
      res.render("allReviews", {
        totalReviews: totalItems,
        reviews: r,
        img:r.imageUrl,
        pgTitle: "Movies Review",
        isAuthenticated: req.session.isLoggedIn,
        path: "",
        currentPage: page,
        hasNextPage: itemPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / itemPerPage),
        pageBtn: itemPerPage > totalItems,
      });
    });
};

exports.myreviewPage = function (req, res) {
  const page = +req.query.page || 1;
  let totalItems;

  Review.count()
    .then((numReviews) => {
      totalItems = numReviews;
      console.log(totalItems);
      return req.user.getReviews({
        offset: (page - 1) * itemPerPage,
        limit: itemPerPage,
      });
    })
    .then((r) => {
      res.render("myReviews", {
        totalReviews: totalItems,
        reviews: r,
        pgTitle: "My Reviews",
        isAuthenticated: req.session.isLoggedIn,
        path: "",
        currentPage: page,
        hasNextPage: itemPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / itemPerPage),
        pageBtn: totalItems < itemPerPage,
      });
    });
};

exports.landingPage = function (req, res) {
  // console.log("IsAuthenticated:", req.session.isLoggedIn);
  // console.log("Session Object:", req.session);
  res.render("index", {
    pgTitle: "Quentin Tarantino's",
    isAuthenticated: req.session.isLoggedIn,
    isAuthenticated2: req.query.logged,
    path: "",
  });
};

exports.thanksPage = function (req, res) {
  res.render("thanks", {
    pgTitle: "Thank you",
    isAuthenticated: req.session.isLoggedIn,
    path: "",
  });
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
  const image = req.file;
  console.log(image);

  const date = formatDate(currentDate);

  const imageUrl = image ? image.path : null;

  req.user
    .createReview({
      name: name,
      movie: movie,
      review: review,
      rating: rating,
      imageUrl: imageUrl,
      date: date,
      
    })
    .then((result) => {
      res.redirect("/thanks");
      const userEmail = req.user.dataValues.email;
      transporter
        .sendMail({
          to: userEmail,
          from: "moviesreviewhub00@gmail.com",
          subject: "Review Submitted",
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
      res.status(500).send("Internal Server Error");
    });
};


