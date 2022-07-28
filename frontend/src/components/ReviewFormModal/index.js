import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import ReviewForm from './ReviewForm';
import LoginForm from '../LoginFormModal/LoginForm';
import './ReviewFormMl.css';

function ReviewFormModal({ user, spotId, change, reviewId }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='add-review-btn' onClick={() => setShowModal(true)}>{change} Your Review</button>
            {showModal && (
                <div className='review-form-modal'>
                    <Modal onClose={() => setShowModal(false)}>
                        {user ? <ReviewForm onClose={() => setShowModal(false)} spotId={spotId} change={change} reviewId={reviewId} />
                            : <LoginForm onClose={() => setShowModal(false)} />}
                    </Modal>
                </div>
            )}
        </>
    );
}

export default ReviewFormModal;
