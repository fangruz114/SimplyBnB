import { useParams } from 'react-router-dom';
import ReviewListByYou from './ReviewListByYou';
import './ManageReviewPage.css';


function ManageReviewPage() {
    const { id } = useParams();

    return (
        <div className="review-by-you">
            <h1>Reviews by you</h1>
            <div className="past-reviews-you-wrote">
                <p>Past reviews you've written</p>
                <ReviewListByYou id={id} />
            </div>
        </div>
    )
}

export default ManageReviewPage;
