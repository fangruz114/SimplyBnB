import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { editBooking, loadSpotBookings } from '../../store/bookings';
import '../BookingForm/BookingForm.css';
import './EditBookingForm.css';

function EditBookingForm({ onClose, spotId, id }) {
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session.user);
    const booking = useSelector(state => state.bookings[id])

    const [startDate, setStartDate] = useState(booking.startDate.split(' ')[0])
    const [endDate, setEndDate] = useState(booking.endDate.split(' ')[0]);
    const [errors, setErrors] = useState({});

    const reserve = (e) => {
        e.preventDefault();
        if (sessionUser) {
            setErrors({});
            dispatch(editBooking(id, { startDate, endDate }))
                .then(() => onClose())
                .then(() => dispatch(loadSpotBookings(spotId)))
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data) setErrors(data);
                    }
                );
        } else return setErrors({ "message": "Sign in required" });
    };

    function calDays(start, end) {
        let date1 = new Date(start);
        let date2 = new Date(end);
        let difference = date2.getTime() - date1.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return totalDays;
    }

    return (
        <div className='edit-booking-form'>
            <div className='booking-form-title'>
                <button className='booking-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="booking-text">Edit Booking</p>
            </div>
            <form onSubmit={reserve}>
                <ul>
                    {errors.message}
                </ul>
                <div className="reserve-date-input">
                    <label>
                        CHECK-IN
                        <input
                            type='date'
                            placeholder='Add date'
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </label>
                    <label>
                        CHECK-OUT
                        <input
                            type='date'
                            placeholder='Add date'
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            min={startDate}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <button type="submit">Update</button>
                </div>
            </form>
            <div className='price-cal'>
                <p>You won't be charged yet</p>
                <div className='booking-price'>
                    <div>{(startDate && endDate && calDays(startDate, endDate) > 0) ? (`$${spot.price} x ${calDays(startDate, endDate)} nights`) : (`$${spot.price} x 0 night`)}</div>
                    <div>{(startDate && endDate && calDays(startDate, endDate) > 0) ? (`$${(Number(spot.price) * calDays(startDate, endDate)).toFixed(0)}`) : `$0`}</div>
                </div>
                <div className='cleaning-fee'>
                    <p>Cleaning fee</p>
                    <p>$200</p>
                </div>
                <div className='service-fee'>
                    <p>Service fee</p>
                    <p>{(startDate && endDate && calDays(startDate, endDate) > 0) ? (`$${(Number(spot.price) * (calDays(startDate, endDate)) * 0.147).toFixed(0)}`) : `$0`}</p>
                </div>
            </div>
            <div className='total-price'>
                <p>Total before taxes</p>
                <p>{(startDate && endDate && calDays(startDate, endDate) > 0) ? (`$${(Number(spot.price) * (calDays(startDate, endDate)) * 1.147 + 200).toFixed(0)}`) : `$0`}</p>
            </div>
        </div>
    );
}

export default EditBookingForm;
