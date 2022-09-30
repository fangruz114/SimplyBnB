import MapPage from "../GoogleMap";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { loadSpots } from '../../store/spots';

function SpotListMap() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots));

    useEffect(() => {
        dispatch(loadSpots());
    }, [dispatch]);

    return (
        <div className='spot-lists-map'>
            <MapPage
                currentPosition={{ lat: 34.19988, lng: -116.36962 }}
                zoom={5}
                markers={[]}
                spots={spots}
            />
            <Link className='spot-list-show-map' to='/'>
                <p>Show list</p>
                <i className="fa-solid fa-list"></i>
            </Link>
        </div>
    );
};

export default SpotListMap;
