import React, { useState } from "react";
import { addReview } from '../../store/reviews';
import { useDispatch } from "react-redux";
import './ReviewForm.css';
import { Redirect } from 'react-router-dom';

function ReviewForm({ spotId, onClose }) {
    const dispatch = useDispatch();
    const [stars, setStars] = useState(5);
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const addedReview = await dispatch(addReview(spotId, { stars, review })).catch(
            async (res) => {
                const data = await res.json();
                if (data) setErrors(data);
            }
        );
        console.log(addedReview);
        if (addedReview) return <Redirect to="/" />;
    };


    return (
        <div className='review-form'>
            <div className='reviewform-title'>
                <button className='review-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="review-text">Add Your Review</p>
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
