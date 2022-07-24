import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';
import './SignupFormMl.css';

function SignupFormModal() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='nav-signup-btn' onClick={() => setShowModal(true)}>Sign Up</button>
            {showModal && (
                <div className='signup-form-modal'>
                    <Modal onClose={() => setShowModal(false)}>
                        <SignupForm onClose={() => setShowModal(false)} />
                    </Modal>
                </div>
            )}
        </>
    );
}

export default SignupFormModal;
