import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeReview, updateUserReviews } from '../../store/reviews';
import ReviewFormModal from '../ReviewFormModal';
import ImageFormModal from '../ImageFormModal';
import { removeImage } from '../../store/images';
import './ReviewListByYou.css';

function ReviewListByYou({ id }) {
    const dispatch = useDispatch();
    const [isloaded, setIsloaded] = useState(false);
    const reviews = useSelector(state => Object.values(state.reviews));
    const reviewsByYou = reviews.filter(review => review.userId === Number(id));

    useEffect(() => {
        dispatch(updateUserReviews(id))
            .then(() => setIsloaded(true));
    }, [dispatch, id])

    function convertDate(string) {
        const date = new Date(string);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateNeeded = date.toLocaleDateString(undefined, options);
        return dateNeeded;
    }
    return (
        <div className='review-by-you-wrapper'>
            {isloaded && reviewsByYou?.map(review => (
                <div key={review.id} className="profile-review-ind">
                    <Link to={`/spots/${review.Spot.id}`}>
                        <img src={review.Spot.previewImage} alt='spot-preview' onError={e => e.target.src = 'https://i.imgur.com/u5RM3H1.jpg'} />
                    </Link>
                    <div className='review-content-by-you'>
                        <h3>Review for {review.Spot.name}</h3>
                        <p>{review.review}</p>
                        <p className='review-date'>{convertDate(review.createdAt)}</p>
                        <div className='review-images'>
                            {review.Images.length > 0 ? review.Images.map((image) => (
                                <>
                                    <img key={image.id} src={image.url} alt='review-img-ind' onError={e => e.target.src = 'https://i.imgur.com/u5RM3H1.jpg'} />
                                    <button
                                        className='delete-review-addtl-img'
                                        onClick={(e) => {
                                            dispatch(removeImage(image.id))
                                                .then(() => dispatch(updateUserReviews(id)))
                                        }}
                                    >
                                        x
                                    </button>
                                </>
                            )) : ''}
                        </div>
                        <div className='review-change'>
                            <ImageFormModal id={review.id} type='review' />
                            <ReviewFormModal user={true} spotId={review.Spot.id} change='Edit' reviewId={review.id} />
                            <button onClick={() => dispatch(removeReview(review.id))}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewListByYou;
