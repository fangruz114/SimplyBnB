import { csrfFetch } from './csrf';

const GET_REVIEWS = 'reviews/getReviews';
const UPDATE_REVIEWS_DELETE = 'reviews/updateReviewsAfterDelete'
const CREATE_REVIEW = 'reviews/createReview';
const DELETE_REVIEW = 'reviews/deleteReview';

const getReviews = (payload) => {
    return {
        type: GET_REVIEWS,
        payload,
    };
};

const updateReviewsAfterDelete = (payload) => {
    return {
        type: UPDATE_REVIEWS_DELETE,
        payload,
    }
}

const createReview = (payload) => {
    return {
        type: CREATE_REVIEW,
        payload,
    };
};

const deleteReview = (id) => {
    return {
        type: DELETE_REVIEW,
        id,
    };
};

export const loadSpotReviews = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`);
    const data = await response.json();
    dispatch(getReviews(data.Reviews));
    return response;
};

export const loadUserReviews = (id) => async dispatch => {
    const response = await csrfFetch(`/api/users/${id}/reviews`);
    const data = await response.json();
    dispatch(getReviews(data.Reviews));
    return response;
};

export const updateUserReviews = (id) => async dispatch => {
    const response = await csrfFetch(`/api/users/${id}/reviews`);
    const data = await response.json();
    dispatch(updateReviewsAfterDelete(data.Reviews));
    return response;
};

export const addReview = (spotId, newReview) => async (dispatch) => {
    const { review, stars } = newReview;
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
            review,
            stars
        }),
    });
    const data = await response.json();
    dispatch(createReview(data));
    return response;
};

export const editReview = (reviewId, updatedReview) => async (dispatch) => {
    const { review, stars } = updatedReview;
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify({
            review,
            stars
        }),
    });
    const data = await response.json();
    dispatch(createReview(data));
    return response;
};

export const removeReview = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
    });
    dispatch(deleteReview(id));
    return response;
};

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS:
            newState = Object.assign({}, state);
            action.payload.map(review => newState[review.id] = review);
            return newState;
        case UPDATE_REVIEWS_DELETE:
            newState = Object.assign({});
            action.payload.map(review => newState[review.id] = review);
            return newState;
        case CREATE_REVIEW:
            newState = Object.assign({}, state);
            newState[action.payload.id] = action.payload;
            return newState;
        case DELETE_REVIEW:
            newState = Object.assign({}, state);
            delete newState[action.id];
            return newState;
        default:
            return state;
    }
};

export default reviewsReducer;
