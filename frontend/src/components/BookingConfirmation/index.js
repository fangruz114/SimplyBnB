import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { loadSpotBookings, removeBooking } from '../../store/bookings';
import { loadOneSpot } from '../../store/spots';
import EditBookingModal from '../EditBookingFormModal';
import MapPage from '../GoogleMap';
import './BookingConfirmation.css';

function BookingConfirmation() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId, id } = useParams();
    const [isLoaded, setIsloaded] = useState(false);
    const spot = useSelector(state => state.spots[spotId]);
    const booking = useSelector(state => state.bookings[id]);
    const user = useSelector(state => state.session.user);

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
        <div className='booking-confirmation-wrapper'>
            {(isLoaded && booking) &&
                (<div className='booking-confirmation'>
                    <div className='booking-conf-left-panel'>
                        <div className='left-panel-top'>
                            <div className='go-back-button'>
                                <Link to={`/users/${user.id}/bookings`}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </Link>
                            </div>
                            <img className='spot-image-background' src={spot.previewImage} alt='booking-conf-previewImg' onError={e => e.target.src = 'https://i.imgur.com/u5RM3H1.jpg'} />
                            <div className='spot-img-spot-info'>
                                <p>{`Your stay at ${spot.Owners.firstName}'s place`}</p>
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
                                <EditBookingModal spotId={spotId} id={id} />
                            ) : ''}
                            {new Date(booking.startDate) >= new Date() ? (
                                <button onClick={cancelBooking}>
                                    <i className="fa-solid fa-calendar-xmark"></i>
                                    <p>Cancel Booking</p>
                                </button>
                            ) : ''}
                        </div>
                    </div>
                    <div className='booking-conf-right-panel'>
                        {/* <iframe
                            src={`https://www.google.com/maps?q=${spot.lat},${spot.lng}&hl=es;&output=embed`}
                            title={spot.id}
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                        </iframe> */}
                        <MapPage currentPosition={{ lat: spot.lat, lng: spot.lng }} zoom={16} markers={[{ lat: spot.lat, lng: spot.lng }]} spots={[]} />
                    </div>
                </div>
                )}
        </div>
    );
}

export default BookingConfirmation;
