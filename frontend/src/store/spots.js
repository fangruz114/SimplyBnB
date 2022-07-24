import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getAllSpots';
const GET_ONE_SPOT = 'spots/getOneSpot';
const CREATE_SPOT = 'spots/createSpot';
const DELETE_SPOT = 'spots/deleteSpot'

const getAllSpots = (payload) => {
    return {
        type: GET_SPOTS,
        payload,
    };
};

const getOneSpot = (payload) => {
    return {
        type: GET_ONE_SPOT,
        payload,
    };
};

const createSpot = (payload) => {
    return {
        type: CREATE_SPOT,
        payload,
    };
};

const deleteSpot = (id) => {
    return {
        type: DELETE_SPOT,
        id,
    };
};

export const loadSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(getAllSpots(data.Spots));
    return response;
};

export const loadOneSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);
    const data = await response.json();
    dispatch(getOneSpot(data));
    return response;
};

export const addSpot = (newSpot) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price } = newSpot;
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        }),
    });
    const data = await response.json();
    dispatch(createSpot(data));
    return response;
};

export const editSpot = (spot) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price } = spot;
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "PUT",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        }),
    });
    const data = await response.json();
    dispatch(createSpot(data));
    return response;
};

export const RemoveSpot = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
    });
    dispatch(deleteSpot(id));
    return response;
};

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_SPOTS:
            newState = Object.assign({}, state);
            action.payload.map(spot => newState[spot.id] = spot);
            return newState;
        case GET_ONE_SPOT:
            newState = Object.assign({}, state);
            newState[action.payload.id] = action.payload;
            return newState;
        case CREATE_SPOT:
            newState = Object.assign({}, state);
            newState[action.payload.id] = action.payload;
            return newState;
        case DELETE_SPOT:
            newState = Object.assign({}, state);
            delete newState[action.id];
            return newState;
        default:
            return state;
    }
};

export default spotsReducer;
