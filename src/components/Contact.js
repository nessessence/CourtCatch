import React from 'react';
import GoogleMapReact from 'google-map-react';
import { gmApiKey} from '../private/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

class Contact extends React.Component{
    constructor(props){
        super(props);
    }

    handleApiLoaded = (map, maps) => {
        let marker = new maps.Marker({
            position: {
                lat: 13.734423027818549,
                lng: 100.53736823678084
            },
            map,
          });
          this.setState({
              marker: marker,
          });
          console.log(marker);
    };

    render(){

        let mapSection  = (
                <div style={{width: "100%", height: "600px"}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: gmApiKey }}
                        defaultZoom={11}
                        center={{lat: 13.734423027818549, lng: 100.53736823678084}}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                        >
                            
                    </GoogleMapReact>
                </div>
            );
        
        return (
            <div>
                <div className="container text-white mt-4">
                    <p><FontAwesomeIcon className="mr-1" icon={faPhone}/>01-234-5678</p>
                    <p><FontAwesomeIcon className="mr-1" icon={faEnvelope}/>contact@courtcatch.com</p>
                    <p><FontAwesomeIcon className="mr-1" icon={faMapMarkedAlt}/>254 Phayathai Rd, Wang Mai, Pathum Wan District, Bangkok 10330</p>
                </div>
                {mapSection}
            </div>
        );
    }
}

export default Contact;