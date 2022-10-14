import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModel from '../SignupFormModal';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <>
                <LoginFormModal />
                <SignupFormModel />
            </>
        );
    }
    return (
        <div className='nav-wrapper'>
            <nav>
                <div className='nav-container'>
                    <div className='logo'>
                        <Link to='/'>
                            <img src='https://i.imgur.com/8wPO9DG.png' alt='logo' onError={e => e.target.src = 'https://i.imgur.com/u5RM3H1.jpg'} />
                            <div className='site-name'>Simplybnb</div>
                        </Link>
                    </div>
                    <ul className='nav-menu'>
                        <li className='nav-link'>
                            {sessionLinks}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navigation;
