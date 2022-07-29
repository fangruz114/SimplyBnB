import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserReviews, removeReview } from '../../store/reviews';
import ReviewFormModal from '../ReviewFormModal';
import ImageFormModal from '../ImageFormModal';
import './ReviewListByYou.css';

function ReviewListByYou({ id }) {
    const dispatch = useDispatch();
    const [isloaded, setIsloaded] = useState(false);
    const reviews = useSelector(state => Object.values(state.reviews));
    const reviewsByYou = reviews.filter(review => review.userId === Number(id));

    useEffect(() => {
        dispatch(loadUserReviews(id))
            .then(() => setIsloaded(true));
    }, [dispatch, id])

    function convertDate(string) {
        const date = new Date(string);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateNeeded = date.toLocaleDateString(undefined, options);
        return dateNeeded;
    }
    return (
        <>
            {isloaded && reviewsByYou.map(review => (
                <div key={review.id} className="profile-review-ind">
                    <img src={review.Spot.previewImage} alt='spot-preview' />
                    <div className='review-content-by-you'>
                        <h3>Review for {review.Spot.name}</h3>
                        <p>{review.review}</p>
                        <p className='review-date'>{convertDate(review.createdAt)}</p>
                        <div className='review-images'>
                            {review.Images.length > 0 ? review.Images.map((image, index) => (<img key={index} src={image.url} alt='review-img-ind' />)) : ''}
                        </div>
                        <div className='review-change'>
                            <ImageFormModal id={review.id} />
                            <ReviewFormModal user={true} spotId={review.Spot.id} change='Edit' reviewId={review.id} />
                            <button onClick={() => dispatch(removeReview(review.id))}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ReviewListByYou;
