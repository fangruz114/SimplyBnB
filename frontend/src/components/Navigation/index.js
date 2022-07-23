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
                    </Link>
                    <div className='site-name'>SimplyBnB</div>
                </div>
                <div className='bar'></div>
                <div className='nav-menu'>
                    <ul>
                        <li>
                            <NavLink exact to="/">Home</NavLink>
                            {sessionLinks}
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navigation;
