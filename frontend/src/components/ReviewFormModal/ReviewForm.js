import React, { useState } from "react";
import { addReview, editReview, loadSpotReviews } from '../../store/reviews';
import { useDispatch, useSelector } from "react-redux";
import './ReviewForm.css';
import { loadOneSpot } from "../../store/spots";

function ReviewForm({ spotId, onClose, change, reviewId }) {
    const dispatch = useDispatch();
    const reviewToEdit = useSelector(state => state.reviews[reviewId]);
    const [stars, setStars] = useState(reviewToEdit ? reviewToEdit.stars : 5);
    const [review, setReview] = useState(reviewToEdit ? reviewToEdit.review : "");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        if (reviewId) {
            dispatch(editReview(reviewId, { stars, review }))
                .then(() => onClose())
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data) setErrors(data);
                    }
                );
        } else {
            dispatch(addReview(spotId, { stars, review }))
                .then(() => onClose())
                .then(() => dispatch(loadOneSpot(spotId)))
                .then(() => dispatch(loadSpotReviews(spotId)))
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data) setErrors(data);
                    }
                );
        }
    };


    return (
        <div className='review-form'>
            <div className='reviewform-title'>
                <button className='review-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="review-text">{change} Your Review</p>
            </div>
            <form onSubmit={handleSubmit}>
                <p className="review-from-welcome">Thanks for sharing your thoughts.</p>
                <ul>
                    {errors.message}
                </ul>
                <div className="form-element">
                    <label className="stars">
                        stars
                        <input
                            type="number"
                            min='1'
                            max='5'
                            value={stars}
                            onChange={(e) => setStars(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Review Content
                        <textarea
                            value={review}
                            rows='6'
                            cols='53'
                            maxLength='250'
                            onChange={(e) => setReview(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <button type="submit">Submit</button>
                </div>
            </form >
        </div>
    );
}

export default ReviewForm;
