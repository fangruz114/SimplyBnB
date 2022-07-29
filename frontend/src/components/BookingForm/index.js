import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import ReviewStarDisplay from '../ReviewStarDisplay';
import { addBooking } from '../../store/bookings';
import './BookingForm.css';
import { useHistory } from 'react-router-dom';

function BookingForm({ id }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = useSelector(state => state.spots[id]);
    const sessionUser = useSelector(state => state.session.user);

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});

    const reserve = (e) => {
        e.preventDefault();
        if (sessionUser) {
            setErrors({});
            dispatch(addBooking(id, { startDate, endDate }))
                .then(data => history.push(`/spots/${id}/bookings/${data.id}`))
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data) setErrors(data);
                    }
                );
        } else return setErrors({ "message": "Sign in required" });
    };

    return (
        <div className='booking-form'>
            <div className='booking-form-top-info'>
                <div>
                    <h3>
                        {`$${spot.price}`}
                    </h3>
                    <p>night</p>
                </div>
                <div>
                    <ReviewStarDisplay id={id} />
                    <p>-</p>
                    <div className='booking-review-count'>{`${spot.numReviews} reviews`}</div>
                </div>
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
                    <button type="submit">Reserve</button>
                </div>
            </form>
            <div className='price-cal'>
                <p>You won't be charged yet</p>
                <div className='booking-price'>
                    <div>{(startDate && endDate) ? (`$${spot.price} x ${new Date(endDate).getDate() - new Date(startDate).getDate()} nights`) : (`$${spot.price} x 0 night`)}</div>
                    <div>{(startDate && endDate) ? (`$${(Number(spot.price) * (new Date(endDate).getDate() - new Date(startDate).getDate())).toFixed(0)}`) : `$0`}</div>
                </div>
                <div className='cleaning-fee'>
                    <p>Cleaning fee</p>
                    <p>$200</p>
                </div>
                <div className='service-fee'>
                    <p>Service fee</p>
                    <p>{(startDate && endDate) ? (`$${(Number(spot.price) * (new Date(endDate).getDate() - new Date(startDate).getDate()) * 0.147).toFixed(0)}`) : `$0`}</p>
                </div>
            </div>
            <div className='total-price'>
                <p>Total before taxes</p>
                <p>{(startDate && endDate) ? (`$${(Number(spot.price) * (new Date(endDate).getDate() - new Date(startDate).getDate()) * 1.147 + 200).toFixed(0)}`) : `$0`}</p>
            </div>
        </div>
    );
}

export default BookingForm;
