import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadUserSpots, removeSpot } from '../../store/spots';
import { updateUserReviews } from '../../store/reviews';
import ListingFormModal from '../ListingFormModal';
import ImageFormModal from '../ImageFormModal';
import SpotImages from './SpotImages';
import './ListingListByYou.css';

function ListingListByYou({ id }) {
    const dispatch = useDispatch();
    const [isloaded, setIsloaded] = useState(false);
    const spots = useSelector(state => Object.values(state.spots));
    const spotsByYou = spots.filter(spot => spot.ownerId === Number(id));

    useEffect(() => {
        dispatch(loadUserSpots(id))
            .then(() => setIsloaded(true));
    }, [dispatch, id])

    function convertDate(string) {
        const date = new Date(string);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateNeeded = date.toLocaleDateString(undefined, options);
        return dateNeeded;
    }
    return (
        <div className='profile-spots-wrapper'>
            {isloaded && spotsByYou.map(spot => (
                <div key={spot.id} className="profile-spot-ind">
                    <div className='profile-spot-ind-left-panel'>
                        <Link to={`/spots/${spot.id}`}>
                            <img className='manage-listing-spot-main-img' src={spot.previewImage} alt='spot-preview' />
                        </Link>
                        <div className='listing-edit-info-bar'>
                            <div className='spot-listing-info'>
                                <SpotImages spotId={spot.id} />
                                <h3>{spot.name}</h3>
                                <p>{`${spot.city}, ${spot.state}`}</p>
                                <p className='listing-update-date'>Last Update: {convertDate(spot.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='listing-change'>
                        <ImageFormModal id={spot.id} type='spot' />
                        <ListingFormModal spotId={spot.id} change='Edit Listing' />
                        <button className='delete-spots' onClick={() =>
                            dispatch(removeSpot(spot.id))
                                .then(dispatch(updateUserReviews(id)))
                        }>Delete Listing</button>
                    </div>
                </div>
            ))
            }
        </div>
    );
}
export default ListingListByYou;
