import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import '../SignupFormPage/SignupForm.css';

function SignupForm({ onClose }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email, firstName, lastName, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(Object.values(data.errors));
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <div className='signup-form'>
            <div className='signupform-title'>
                <button className='signup-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="signup-text">Sign Up</p>
            </div>
            <form onSubmit={handleSubmit}>
                <p className="signup-from-welcome">Welcome to Simplybnb</p>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="form-element">
                    <label>
                        First Name
                        <input
                            type="text"
                            value={firstName}
                            maxLength='30'
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Last Name
                        <input
                            type="text"
                            value={lastName}
                            maxLength='30'
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Email
                        <input
                            type="text"
                            value={email}
                            maxLength='50'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            maxLength='50'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            value={confirmPassword}
                            maxLength='50'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default SignupForm;
