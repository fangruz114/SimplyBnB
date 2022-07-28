import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import ReviewStarDisplay from '../ReviewStarDisplay';
import { addBooking } from '../../store/bookings';
import './BookingForm.css';

function BookingForm({ id }) {
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[id]);

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});

    const reserve = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(addBooking(id, { startDate, endDate }))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data) setErrors(data);
                }
            );
    };

    return (
        <div className='booking-form'>
            <div className='booking-form-top-info'>
                <div>
                    {`$${spot.price} night`}
                </div>
                <ReviewStarDisplay id={id} />
                <p> - </p>
                <div className='booking-review-count'>{`${spot.numReviews} reviews`}</div>
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
                    <div className="form-element">
                        <label>
                            CHECK-OUT
                            <input
                                type='date'
                                placeholder='Add date'
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-element">
                        <button type="submit">Reserve</button>
                    </div>
                    <div className='price-cal'>
                        <p>You won't be charged yet</p>
                        <div className='booking-price'>
                            <div>{`$${spot.price} x ${new Date(endDate).getDate() - new Date(startDate).getDate} nights`}</div>
                            <div>{`$${(Number(spot.price) * (new Date(endDate).getDate() - new Date(startDate).getDate)).toFixed(0)}`}</div>
                        </div>
                        <div className='cleaning-fee'>
                            <p>Cleaning fee</p>
                            <p>$200</p>
                        </div>
                        <div className='service-fee'>
                            <p>Service fee</p>
                            <p>{`$${(Number(spot.price) * (new Date(endDate).getDate() - new Date(startDate).getDate) * 0.147).toFixed(0)}`}</p>
                        </div>
                    </div>
                    <div className='total-price'>
                        <p>Total before taxes</p>
                        <p>{`$${(Number(spot.price) * (new Date(endDate).getDate() - new Date(startDate).getDate) * 1.147 + 200).toFixed(0)}`}</p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default BookingForm;
