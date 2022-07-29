import { GoogleMap } from 'react-google-maps';

function Map({ lat, lng }) {
    return <GoogleMap defaultZoom={10} defaultCenter={{ lat, lng }} />
}

export default Map;
