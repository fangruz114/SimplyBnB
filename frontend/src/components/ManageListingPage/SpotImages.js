import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOneSpot } from '../../store/spots';
import { removeImage } from '../../store/images';
import './SpotImages.css';

function SpotImages({ spotId }) {
    const dispatch = useDispatch();
    const [isloaded, setIsloaded] = useState(false);
    const images = useSelector(state => state.spots[+spotId].images);

    useEffect(() => {
        dispatch(loadOneSpot(spotId))
            .then(() => setIsloaded(true));
    }, [dispatch, spotId])

    return (
        <>
            <div className='manage-listing-spot-images'>
                {isloaded && images && images.length > 0 ?
                    images.map((image) => (
                        <div className='listing-addtl-image-ind' key={image.id}>
                            <img key={image.id} src={image.url} alt='spot-img-ind' onError={e => e.target.src = 'https://i.imgur.com/u5RM3H1.jpg'} />
                            <button
                                className='delete-spot-addtl-img'
                                onClick={(e) => {
                                    dispatch(removeImage(image.id)).then(() => dispatch(loadOneSpot(spotId)))
                                }}
                            >
                                x
                            </button>
                        </div>
                    ))
                    : ''}
            </div>
        </>
    )
}

export default SpotImages;
