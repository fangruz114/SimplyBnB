import { useParams } from 'react-router-dom';
import UserBookingList from "./UserBookingList";
import './ManageBookingList.css';

function ManageBookingList() {
    const { id } = useParams();

    return (
        <div className='user-trip-list'>
            <h1>Trips</h1>
            <div className='user-booking-list-container'>
                <UserBookingList userId={id} />
            </div>
        </div>
    );
}

export default ManageBookingList;
