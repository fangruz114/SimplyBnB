import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserBookingList.css';
import { loadUserBookings } from '../../store/bookings';

function UserBookingList({ userId }) {
    const dispatch = useDispatch();
    const bookings = useSelector(state => Object.values(state.bookings));
    const userBookings = bookings.filter(booking => booking.userId === +userId)

    useEffect(() => {
        dispatch(loadUserBookings(userId))
    }, [dispatch, userId])

    function convertDate(string) {
        const date = new Date(string);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const dateNeeded = date.toLocaleDateString(undefined, options);
        return dateNeeded;
    }

    return (
        <>
            {userBookings && userBookings.map(booking => (
                <div className='user-booking-ind-container'>
                    <Link to={`/spots/${booking.Spot.id}/bookings/${booking.id}`}>
                        <div className='user-booking-ind'>
                            <img className='user-booking-list-preImg' src={booking.Spot.previewImage} alt='booking-spot-preview' />
                            <div className='user-booking-info'>
                                <h4>{booking.Spot.city}</h4>
                                <p>{`${convertDate(booking.startDate)}-${convertDate(booking.endDate)}`}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </>
    );
}

export default UserBookingList;
