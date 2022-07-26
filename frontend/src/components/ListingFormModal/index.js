import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import ListingForm from './ListingForm';
import './ListingFormMl.css';

function ListingFormModal({ spotId, change }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='add-listing-btn' onClick={() => setShowModal(true)}>{change}</button>
            {showModal && (
                <div className='listing-form-modal'>
                    <Modal onClose={() => setShowModal(false)}>
                        <ListingForm onClose={() => setShowModal(false)} spotId={spotId} change={change} />
                    </Modal>
                </div>
            )}
        </>
    );
}

export default ListingFormModal;
