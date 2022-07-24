import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';
import './LoginFormModel.css';

function LoginFormModal() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='nav-login-btn' onClick={() => setShowModal(true)}>Log In</button>
            {showModal && (
                <div className='login-form-modal'>
                    <Modal onClose={() => setShowModal(false)}>
                        <LoginForm onClose={() => setShowModal(false)} />
                    </Modal>
                </div>
            )}
        </>
    );
}

export default LoginFormModal;
