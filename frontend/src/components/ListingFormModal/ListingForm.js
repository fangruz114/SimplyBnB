import React, { useState } from "react";
import { addSpot, editSpot } from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import './ListingForm.css';

function ListingForm({ spotId, onClose, change }) {
    const dispatch = useDispatch();
    const listingToEdit = useSelector(state => state.spots[spotId]);
    const [address, setAddress] = useState(listingToEdit ? listingToEdit.address : '');
    const [city, setCity] = useState(listingToEdit ? listingToEdit.city : "");
    const [state, setState] = useState(listingToEdit ? listingToEdit.state : "");
    const [country, setCountry] = useState(listingToEdit ? listingToEdit.country : "");
    const [lat, setLat] = useState(listingToEdit && listingToEdit != 0 ? listingToEdit.lat : null);
    const [lng, setLng] = useState(listingToEdit ? listingToEdit.lng : null);
    const [name, setName] = useState(listingToEdit ? listingToEdit.name : "");
    const [description, setDescription] = useState(listingToEdit ? listingToEdit.description : "");
    const [price, setPrice] = useState(listingToEdit ? listingToEdit.price : null);
    const [previewImage, setPreviewImage] = useState(listingToEdit ? listingToEdit.previewImage : "");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            previewImage,
        }
        if (spotId) {
            dispatch(editSpot(spotId, newSpot))
                .then(() => onClose())
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data && data.errors) setErrors(data.errors);
                    }
                );
        } else {
            dispatch(addSpot(newSpot))
                .then(() => onClose())
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data && data.errors) setErrors(data.errors);
                    }
                );
        }
    };


    return (
        <div className='listing-form'>
            <div className='listingform-title'>
                <button className='listing-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="listing-text">{change}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <p className="listing-form-welcome">Welcome! Thank you for listing your property with us.</p>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="form-element">
                    <label>
                        Address
                        <input
                            type="text"
                            value={address}
                            maxLength='100'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        City
                        <input
                            type="text"
                            value={city}
                            minLength='2'
                            maxLength='20'
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        State
                        <input
                            type="text"
                            value={state}
                            minLength='2'
                            maxLength='15'
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Country
                        <input
                            type="text"
                            value={country}
                            maxLength='30'
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Latitude
                        <input
                            type="number"
                            value={lat}
                            max='90'
                            min='-90'
                            step='0.000001'
                            onChange={(e) => setLat(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Longitude
                        <input
                            type="number"
                            value={lng}
                            max='180'
                            min='-180'
                            step='0.000001'
                            onChange={(e) => setLng(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            maxLength='50'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element description">
                    <label>
                        Description
                        <textarea
                            rows='3'
                            cols='53'
                            value={description}
                            maxLength='250'
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Price
                        <input
                            type="number"
                            value={price}
                            min='0.01'
                            step='0.01'
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <label>
                        Image url
                        <input
                            type="text"
                            value={previewImage}
                            maxLength='250'
                            onChange={(e) => setPreviewImage(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <button type="submit">Submit</button>
                </div>
            </form >
        </div>
    );
}

export default ListingForm;
