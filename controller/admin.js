const Review = require("../models/reviews");

exports.deletePost = function (req, res) {
  const reviewId = req.params.id;
  Review.findByPk(reviewId)
    .then((review) => {
      return review.destroy();
    })
    .then((result) => {
      console.log(`deleted ${reviewId}`);
      res.redirect("/myReviews");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.editreviewPage = function (req, res) {
  const Id = req.params.id;
  Review.findByPk(Id).then((review) => {
    const result = review;
    res.render("admin/editReview", { pgTitle: "edit review", review: result, isAuthenticated: req.session.isLoggedIn });
  });

};

exports.updateReview = function (req, res) {
  const Id = req.params.id;
  const name = req.body.Name || null; // Use null if the value is undefined
  const movie = req.body.movieName || null;
  const rreview = req.body.review || null;
  const rating = req.body.Rating || null;
  const date = req.body.reviewDate || null;
  const image = req.file;
  console.log(image)

  console.log(Id);

  Review.findByPk(Id)
    .then((review) => {
      review.name = name;
      review.movie = movie;
      review.review = rreview;
      review.rating = rating;
      if(image){
        review.imageUrl = image.path;
      }
      review.date = date;
      
      return review.save();
    })
    .then((result) => {
      console.log(`updated${Id}`);
      res.redirect("/myReviews");
    })
    .catch((err) => {
      console.error(err);
    });
};
