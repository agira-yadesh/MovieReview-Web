exports.error404 =(req,res,next)=>{
    res.status(404).render('pageNotfound',{pgTitle:'Page not found', isAuthenticated: req.session.isLoggedIn,})
};