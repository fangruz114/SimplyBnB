import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserSpots, removeSpot } from '../../store/spots';
import { loadUserReviews } from '../../store/reviews';
import ListingFormModal from '../ListingFormModal';
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
        <>
            {isloaded && spotsByYou.map(spot => (
                <div key={spot.id} className="profile-spot-ind">
                    <img src={spot.previewImage} alt='spot-preview' />
                    <div className='listing-edit-info-bar'>
                        <div className='spot-listing-info'>
                            <h3>{spot.name}</h3>
                            <p>{`${spot.city}, ${spot.state}`}</p>
                            <p className='listing-update-date'>Last Update: {convertDate(spot.updatedAt)}</p>
                        </div>
                        <div className='listing-change'>
                            <ListingFormModal spotId={spot.id} change='Edit Listing' />
                            <button className='delete-spots' onClick={() =>
                                dispatch(removeSpot(spot.id))
                                    .then(dispatch(loadUserReviews(id)))
                            }>Delete Listing</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
export default ListingListByYou;
