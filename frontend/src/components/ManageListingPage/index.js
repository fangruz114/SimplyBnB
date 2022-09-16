import { useParams } from 'react-router-dom';
import ListingListByYou from './ListingListByYou';
import ListingFormModal from '../ListingFormModal';
import './ManageListingPage.css';


function ManageListingPage() {
    const { id } = useParams();

    return (
        <div className='manage-listings-wrapper'>
            <div className="listings-by-you">
                <div className='title'>
                    <h1>Manage Listings</h1>
                    <ListingFormModal spotId='' change='Create new listing' />
                </div>
                <div className="listing-created">
                    <p>Below listings are successfully listed.</p>
                    <ListingListByYou id={id} />
                </div>
            </div>
        </div>
    )
}

export default ManageListingPage;
