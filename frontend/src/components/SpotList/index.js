import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadSpots } from '../../store/spots';
import './SpotList.css';
import ReviewStarDisplay from '../ReviewStarDisplay';

function SpotList() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots));

    useEffect(() => {
        dispatch(loadSpots());
    }, [dispatch]);

    return (
        <div className='spot-list-wrapper'>
            <div className='all-spots'>
                {spots && (
                    spots.map(spot => (
                        <Link key={spot.id} to={`/spots/${spot.id}`}>
                            <div className='spot-card'>
                                <div className='spot-image'>
                                    <img className='spot-img-display' src={spot.previewImage} alt='previewImage' onError={e => e.target.src = 'https://i.imgur.com/u5RM3H1.jpg'} />
                                </div>
                                <div className='spot-info'>
                                    <div className='spot-details'>
                                        <div className='spot-name'>{spot.name}</div>
                                        <div>{`${spot.city}, ${spot.state}`}</div>
                                        <div className='spot-price'><span>${spot.price}</span>night</div>
                                    </div>
                                    <div className='spot-review'>
                                        <ReviewStarDisplay id={spot.id} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            <Link className='spot-list-show-map' to='/spots/map'>
                <p>Show Map</p>
                <i className="fa-solid fa-map"></i>
            </Link>
        </div>

    )
};

export default SpotList;
