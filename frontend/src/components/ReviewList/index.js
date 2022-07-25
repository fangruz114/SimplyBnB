import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadSpotReviews } from '../../store/reviews';
import './ReviewList.css';

function ReviewList({ id }) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => Object.values(state.reviews));
    const spotReviews = reviews.filter(review => review.spotId === Number(id));

    useEffect(() => {
        dispatch(loadSpotReviews(id))
    }, [dispatch, id]);

    return (
        <>
            {
                spotReviews && (
                    <>
                        {spotReviews.map(review => (
                            <div className='ind-review'>
                                <div className='review-list-rating'>
                                    <i className="fa-solid fa-star"></i>
                                    <p>{review.stars}</p>
                                </div>
                                <div className='review-content'>{review.review}</div>
                            </div>
                        ))}
                    </>
                )
            }
        </>
    );
}

export default ReviewList;
