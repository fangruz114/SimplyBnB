import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './LoginForm.css';

function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) return (
        <Redirect to="/" />
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ email, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data) setErrors(data);
            });
    }

    return (
        <div className='loginform'>
            <div className='loginform-title'>
                <button className='login-form-close-btn'>
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <p>Log in</p>
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
            </form >
        </div>
    );
}

export default LoginFormPage;
