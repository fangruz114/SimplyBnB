import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadSpots } from '../../store/spots';
import SpotDetailPage from '../SpotDetailPage';
import './SpotList.css';

function SpotList() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots));

    useEffect(() => {
        dispatch(loadSpots());
    }, [dispatch]);

    return (
        <div className='all-spots'>
            {spots && (
                spots.map(spot => (
                    <div className='spot-card'>
                        <div className='spot-image'>
                            <img src={spot.previewImage} alt='previewImage' />

                        </div>
                        <div className='spot-info'>
                            <div className='spot-name'>
                                <span style={{ fontWeight: 'bold' }}>{spot.name}</span>{`${spot.city}, ${spot.state}`}
                                <div className='spot-price'><span style={{ fontWeight: 'bold' }}>${spot.price}</span>night</div>
                            </div>
                            <div className='spot-review'>
                                <i class="fa-solid fa-star"></i>
                                <span>{spot.avgStarRating}</span>
                            </div>
                        </div>
                        <Route path={`/spots/${spot.id}`}>
                            <SpotDetailPage />
                        </Route>
                    </div>
                ))
            )}

        </div>

    )
};

export default SpotList;
