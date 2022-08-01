import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadSpotReviews } from '../../store/reviews';
import './ReviewStarDisplay.css';

function ReviewStarDisplay({ id }) {
    console.log('id', id);
    const dispatch = useDispatch();
    const [isloaded, setIsloaded] = useState(false);
    const reviews = useSelector(state => Object.values(state.reviews));
    const spotReviews = reviews.filter(review => review.spotId === Number(id));
    console.log('spotreviews', spotReviews)
    let ratingSum = 0;
    for (let review of spotReviews) {
        ratingSum += review.stars;
    }
    const avgStarRating = (ratingSum / spotReviews.length).toFixed(1);
    // console.log(avgStarRating);

    useEffect(() => {
        dispatch(loadSpotReviews(id))
            .then(() => setIsloaded(true));
    }, [dispatch, id]);

    return (
        <>
            {
                (isloaded && reviews) && (
                    <>
                        <i className="fa-solid fa-star"></i>
                        <span className='avg-rating'>{avgStarRating === 'NaN' ? 'New' : avgStarRating}</span>
                    </>
                )
            }
        </>
    );
}

export default ReviewStarDisplay;
