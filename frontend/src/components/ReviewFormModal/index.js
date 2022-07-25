import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import ReviewForm from './ReviewForm';
import './ReviewFormMl.css';

function ReviewFormModal({ spotId }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='add-review-btn' onClick={() => setShowModal(true)}>Add Your Review</button>
            {showModal && (
                <div className='review-form-modal'>
                    <Modal onClose={() => setShowModal(false)}>
                        <ReviewForm onClose={() => setShowModal(false)} spotId={spotId} />
                    </Modal>
                </div>
            )}
        </>
    );
}

export default ReviewFormModal;
