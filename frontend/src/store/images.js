import { csrfFetch } from './csrf';

const CREATE_IMAGES = 'images/createImages';
const DELETE_IMAGE = 'images/deleteImages';

const createImages = (payload) => {
    return {
        type: CREATE_IMAGES,
        payload,
    };
};

const deleteImage = (id) => {
    return {
        type: DELETE_IMAGE,
        id,
    };
};

export const addSpotImage = (spotId, newImage) => async (dispatch) => {
    const { url } = newImage;
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify({
            url
        }),
    });
    const data = await response.json();
    dispatch(createImages(data));
    return response;
};

export const addReviewImage = (reviewId, newImage) => async (dispatch) => {
    const { url } = newImage;
    const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
        method: "POST",
        body: JSON.stringify({
            url
        }),
    });
    const data = await response.json();
    dispatch(createImages(data));
    return response;
};

export const removeImage = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/images/${id}`, {
        method: 'DELETE',
    });
    dispatch(deleteImage(id));
    return response;
};

const initialState = {};

const imageReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_IMAGES:
            newState = Object.assign({}, state);
            newState[action.payload.id] = action.payload;
            return newState;
        case DELETE_IMAGE:
            newState = Object.assign({}, state);
            delete newState[action.id];
            return newState;
        default:
            return state;
    }
};

export default imageReducer;
