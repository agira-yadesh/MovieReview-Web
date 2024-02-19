

const deleteReview = btn =>{

    const confirmed = window.confirm('Are you sure you want to delete this review?');

    if (!confirmed) {
        return;
    }

    const reviewId =btn.parentNode.querySelector('[name=reviewId]').value;
    console.log(reviewId);
    const csrf = btn.parentNode.querySelector('[name= _csrf]').value;
    console.log(csrf);

    const reviewElement = btn.closest('article');
    console.log(reviewElement);

    fetch('/myReviews/' + reviewId,{
        method: 'DELETE',
        headers:{
            'csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();

    })
    .then(data =>{
        console.log(data);
        reviewElement.parentNode.removeChild(reviewElement);
        window.alert("review deleted")

        return fetch('totalReviews');
    })
    .then(result => result.json())
    .then(updatedCount=>{
        const totalReviews = document.getElementById('noOfReviews');
        if(totalReviews){
            totalReviews.textContent = updatedCount;
            console.log(updatedCount)
        }
    })
    .catch(err=>{
        console.log(`hi${err}`);
    });
};

// const updateReview = btn =>{
//    const reviewId =btn.parentNode.querySelector('[name=reviewId]').value;
//    console.log(reviewId);
//     const csrf = btn.parentNode.querySelector('[name= _csrf]').value;
//     console.log(csrf);

//     const reviewElement = btn.closest('article');
//     console.log(reviewElement);

//     fetch('/myReviews/' + reviewId,{
//         method: 'PUT',
//         headers:{
//             'csrf-token': csrf
//         }
//     })
//     .then(result=>{
//         return result.json();
//     })
//     .then(data=>{
//         console.log(data);
//         reviewElement.querySelector('.movie-card').textContent = data;

//     })
//     .catch(err=>{
//         console.log('error',err)
//     })
// }