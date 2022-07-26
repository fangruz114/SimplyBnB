import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadSpotReviews } from '../../store/reviews';
import './ReviewStarDisplay.css';

function ReviewStarDisplay({ id }) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => Object.values(state.reviews));
    const spotReviews = reviews.filter(review => review.spotId === Number(id));

    let ratingSum = 0;
    for (let review of spotReviews) {
        ratingSum += review.stars;
    }
    const avgStarRating = (ratingSum / spotReviews.length).toFixed(1);

    useEffect(() => {
        dispatch(loadSpotReviews(id))
    }, [dispatch, id]);

    return (
        <>
            {
                reviews && (
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
