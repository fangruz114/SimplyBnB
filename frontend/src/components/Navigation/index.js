import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
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
                <NavLink to="/signup">Sign Up</NavLink>
            </>
        );
    }
    return (
        <>
            <nav>
                <div className='logo'>
                    <Link to='/'>
                        <img src='https://cdn.usbrandcolors.com/images/logos/airbnb-logo.svg' alt='logo' />
                        <div className='site-name'>Simplybnb</div>
                    </Link>
                </div>
                <ul className='nav-menu'>
                    <li className='nav-link'>
                        <NavLink exact to="/">Home</NavLink>
                        {sessionLinks}
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navigation;
