const Review = require("../models/reviews");


exports.totalReviews = function (req,res){

  Review.count()
  .then(noofReviews=>{
    totalItems = noofReviews;
    res.json(totalItems);
  })

}

exports.deleteReview = function (req, res) {
  console.log("hii")
  const reviewId = req.params.id;
  Review.findByPk(reviewId)
    .then((review) => {
      return review.destroy();
    })
    .then(() => {
      console.log(`deleted ${reviewId}`);
      res.status(200).json({ message: 'Success' });
      // res.redirect("/myReviews");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({message: 'Deleting review failed.'})
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
