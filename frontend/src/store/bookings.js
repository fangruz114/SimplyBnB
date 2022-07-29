import { csrfFetch } from './csrf';

const GET_BOOKINGS = 'bookings/getBookings';
const CREATE_BOOKING = 'bookings/createBooking';
const DELETE_BOOKING = 'bookings/deleteBooking'

const getBookings = (payload) => {
    return {
        type: GET_BOOKINGS,
        payload,
    };
};

const createBooking = (payload) => {
    return {
        type: CREATE_BOOKING,
        payload,
    };
};

const deleteBooking = (id) => {
    return {
        type: DELETE_BOOKING,
        id,
    };
};

export const loadUserBookings = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${userId}/bookings`);
    const data = await response.json();
    dispatch(getBookings(data.Bookings));
    return response;
};

export const loadSpotBookings = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    const data = await response.json();
    dispatch(getBookings(data.Bookings));
    return response;
};

export const addBooking = (spotId, newBooking) => async (dispatch) => {
    const { startDate, endDate } = newBooking;
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        body: JSON.stringify({
            startDate,
            endDate,
        }),
    });
    const data = await response.json();
    dispatch(createBooking(data));
    return data;
};

export const editBooking = (id, newBooking) => async (dispatch) => {
    const { startDate, endDate } = newBooking;
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            startDate,
            endDate,
        }),
    });
    const data = await response.json();
    dispatch(createBooking(data));
    return response;
};

export const removeBooking = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'DELETE',
    });
    dispatch(deleteBooking(id));
    return response;
};

const initialState = {};

const bookingReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_BOOKINGS:
            newState = Object.assign({}, state);
            action.payload.map(booking => newState[booking.id] = booking);
            return newState;
        case CREATE_BOOKING:
            newState = Object.assign({}, state);
            newState[action.payload.id] = action.payload;
            return newState;
        case DELETE_BOOKING:
            newState = Object.assign({}, state);
            delete newState[action.id];
            return newState;
        default:
            return state;
    }
};

export default bookingReducer;
