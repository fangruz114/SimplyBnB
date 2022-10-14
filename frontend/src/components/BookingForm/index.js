import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import ReviewStarDisplay from '../ReviewStarDisplay';
import { addBooking } from '../../store/bookings';
import './BookingForm.css';
import { useHistory } from 'react-router-dom';
import { Modal } from '../../context/Modal';
import LoginForm from '../LoginFormModal/LoginForm';

function BookingForm({ id }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = useSelector(state => state.spots[id]);
    const sessionUser = useSelector(state => state.session.user);

    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        if (sessionUser) setShowLoginModal(false);
    }, [sessionUser]);

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
        } else {
            setShowLoginModal(true);
        };
    };

    function calDays(start, end) {
        let date1 = new Date(start);
        let date2 = new Date(end);
        let difference = date2.getTime() - date1.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return totalDays;
    }

    function maxDate(start, days) {
        const maxDate = new Date(start);
        const allowedDays = days * 1000 * 3600 * 24;
        maxDate.setTime(maxDate.getTime() + allowedDays);
        return maxDate.toISOString().split('T')[0]
    }

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
                            value={startDate ? startDate : new Date().toISOString().split('T')[0]}
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
                            value={endDate ? endDate : maxDate(startDate, 2)}
                            onChange={e => setEndDate(e.target.value)}
                            min={startDate}
                            max={startDate ? maxDate(startDate, 180) : ''}
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
            {showLoginModal && (
                <Modal onClose={() => setShowLoginModal(false)}>
                    <LoginForm onClose={() => setShowLoginModal(false)} />
                </Modal>
            )}
        </div>
    );
}

export default BookingForm;
