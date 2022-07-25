import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadOneSpot } from '../../store/spots';
import ReviewList from '../ReviewList';
import './SpotDetailPage.css';


function SpotDetailPage() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const spot = useSelector(state => state.spots[id]);
    console.log('spot', spot);

    useEffect(() => {
        dispatch(loadOneSpot(id));
    }, [dispatch, id]);


    return (
        <>
            {spot.images && (
                <div className='spot-detail-page'>
                    <h2>{spot.name}</h2>
                    <div className='sub-info'>
                        <div className='star-rating-display'>
                            <i className="fa-solid fa-star"></i>
                            <p>{spot.avgStarRating}</p>
                        </div>
                        <p> - </p>
                        <div>{`${spot.numReviews} reviews`}</div>
                        <div className='spot-details-city'>{`${spot.city}, ${spot.state}, ${spot.country}`}</div>
                    </div>
                    <div className='image-layout'>
                        <img src={spot.previewImage} alt={spot.id} />
                        <div className='side-images'>
                            {spot.images && (spot.images.map(url => (
                                <img key={spot.id} src={url.url} alt={spot.id} />
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
                                <p>{spot.avgStarRating}</p>
                            </div>
                            <p> - </p>
                            <div>{`${spot.numReviews} reviews`}</div>
                            <div className='add-review-btn'>
                                <button>Add Your Review</button>
                            </div>
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
