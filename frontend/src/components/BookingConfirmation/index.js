import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { loadSpotBookings, removeBooking } from '../../store/bookings';
import { loadOneSpot } from '../../store/spots';
import './BookingConfirmation.css';

function BookingConfirmation() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId, id } = useParams();
    const [isLoaded, setIsloaded] = useState(false);
    const spot = useSelector(state => state.spots[spotId]);
    const booking = useSelector(state => state.bookings[id]);
    const user = useSelector(state => state.session.user);
    console.log('spot', spot);
    console.log('booking', booking);
    console.log('user', user);

    useEffect(() => {
        dispatch(loadSpotBookings(spotId));
        dispatch(loadOneSpot(spotId))
            .then(() => setIsloaded(true))
    }, [dispatch, spotId]);

    const cancelBooking = (e) => {
        e.preventDefault();
        return dispatch(removeBooking(id))
            .then(() => history.push(`/users/${user.id}/bookings`));
    }

    function convertDate(string) {
        const date = new Date(string);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const dateNeeded = date.toLocaleDateString(undefined, options);
        return dateNeeded;
    }

    return (
        <>
            {(isLoaded && booking) &&
                (<div className='booking-confirmation'>
                    <div className='booking-conf-left-panel'>
                        <div className='left-panel-top'>
                            <img className='spot-image-background' src={spot.previewImage} alt='booking-conf-previewImg' />
                            <div className='go-back-button'>
                                <Link to={`/users/${user.id}/bookings`}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </Link>
                            </div>
                            <div className='spot-img-spot-info'>
                                <div>{`Your stay at ${spot.Owners.firstName}'s place`}</div>
                            </div>
                        </div>
                        <div className='booking-conf-detail-info'>
                            <div className='checkin-checkout'>
                                <div className='checkin'>
                                    <p>Check-in</p>
                                    <div>{convertDate(booking.startDate)}</div>
                                </div>
                                <div className='checkout'>
                                    <p>Check-out</p>
                                    <div>{convertDate(booking.endDate)}</div>
                                </div>
                            </div>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${spot.lat}%2C${spot.lng}`}>
                                <i className="fa-solid fa-location-dot"></i>
                                <p>Get directions</p>
                            </a>
                            <Link to={`/spots/${spotId}`}>
                                <i className="fa-solid fa-desktop"></i>
                                <p>Show listing</p>
                            </Link>
                            {new Date(booking.endDate) >= new Date() ? (
                                <button>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    <p>Edit Booking</p>
                                </button>
                            ) : ''}
                            {new Date(booking.startDate) >= new Date() ? (
                                <button onClick={cancelBooking}>
                                    <i class="fa-solid fa-calendar-xmark"></i>
                                    <p>Cancel Booking</p>
                                </button>
                            ) : ''}
                        </div>
                    </div>
                    <div className='booking-conf-right-panel'>

                    </div>
                </div>
                )}
        </>
    );
}

export default BookingConfirmation;
