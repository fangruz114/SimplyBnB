import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import '../LoginFormPage/LoginForm.css';

function LoginForm({ onClose }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ email, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data) setErrors(data);
            }
        );
    };

    const loginDemoUser = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({
            email: 'demo@demo.io',
            password: 'password',
        }))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data) setErrors(data);
                }
            );

    }

    return (
        <div className='loginform'>
            <div className='loginform-title'>
                <button className='login-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="login-text">Log in</p>
            </div>
            <form onSubmit={handleSubmit}>
                <p className="login-from-welcome">Welcome to Simplybnb</p>
                <ul>
                    {errors.message}
                </ul>
                <div className="form-element">
                    <label >
                        Email
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label className='password'>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <button type="submit">Log In</button>
                </div>
                <div className="form-element">
                    <button onClick={loginDemoUser}>Demo User</button>
                </div>
            </form >
        </div>
    );
}

export default LoginForm;
