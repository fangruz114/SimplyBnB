import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadOneSpot } from '../../store/spots';
import ReviewList from '../ReviewList';
import ReviewFormModal from '../ReviewFormModal';
import './SpotDetailPage.css';


function SpotDetailPage() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const spot = useSelector(state => state.spots[+id]);

    useEffect(() => {
        dispatch(loadOneSpot(id))
            .then(() => setIsLoaded(true))
    }, [dispatch, id]);


    return (
        <>
            {isLoaded && (
                <div className='spot-detail-page'>
                    <h2>{spot.name}</h2>
                    <div className='sub-info'>
                        <div className='star-rating-display'>
                            <i className="fa-solid fa-star"></i>
                            <p>{spot.avgStarRating ? spot.avgStarRating.toFixed(2) : 'New'}</p>
                        </div>
                        <p> - </p>
                        <div>{`${spot.numReviews} reviews`}</div>
                        <div className='spot-details-city'>{`${spot.city}, ${spot.state}, ${spot.country}`}</div>
                    </div>
                    <div className='image-layout'>
                        <img className='spot-detail-main-img' src={spot.previewImage} alt={spot.id} />
                        <div className='side-images'>
                            {spot.images && (spot.images.map(url => (
                                <img key={spot.id} className='spot-detail-side-img' src={url.url} alt={spot.id} />
                            )))}
                        </div>
                    </div>
                    <div className='spot-infomation'>
                        <p>{`Entire cabin hosted by ${spot.Owners.firstName}`}</p>
                        <div className='spot-description'>{spot.description}</div>
                    </div>
                    <div className='reviews'>
                        <div className='review-section-top-part'>
                            <div className='star-rating-display'>
                                <i className="fa-solid fa-star"></i>
                                <p>{spot.avgStarRating ? spot.avgStarRating.toFixed(2) : 'New'}</p>
                            </div>
                            <p> - </p>
                            <div>{`${spot.numReviews} reviews`}</div>
                            <ReviewFormModal spotId={spot.id} change='Add' reviewId='' />
                        </div>
                        <div className='review-list'>
                            <ReviewList id={spot.id} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SpotDetailPage;
