import React from 'react';
import {connect} from 'react-redux';
import {court as courtActions} from '../actions';
import { Form, Col, CarouselItem, Carousel, Row } from 'react-bootstrap';
import {upload as uploadFileToS3} from '../s3';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import './court.css';
import GoogleMapReact from 'google-map-react';
import { gmApiKey} from '../private/keys';
import StarRatings from 'react-star-ratings';

class Court extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            courtName: this.props.match.params.courtName,
            court: null,
            loadFinish: false,
            score: "5",
            review: "",
            formErrors: {
                score: ""
            },
            file: "",
            imagePreviewUrl: "",
            imageUploadError: "",
            uploading: false,
            day_of_the_week: "1",
            start_time: "",
            end_time: "",
            marker: null,
            reserveRacket: false,
            reserveShuttlecock: false,
            rackets: null,
            shuttlecocks: null
        }
    }

    async componentDidMount(){
        try {
            let court = await this.props.loadCourt(this.state.courtName);
            let rackets = await this.props.loadRackets();
            let shuttlecocks = await this.props.loadShuttlecock();
            this.setState({
                loadFinish: true,
                court: court,
                rackets: rackets,
                shuttlecocks: shuttlecocks
            })
        }   
        catch(err){
            alert(err);
        }
    }

    handleReview = async e => {
        e.preventDefault();
        this.validateReview()

        if ( this.isReviewFormValid() ){
            try{
                let res = await this.props.reviewCourt(this.state.courtName, this.state.score, this.state.review);
                alert("court reviewed");
                this.setState({

                });
            }
            catch(err){
                alert(err);
            }
        }
    }

    isReviewFormValid = () => {
        let valid = true;
        for(let field in this.state.formErrors ){
            if ( this.state.formErrors[field] !== "" ){
                valid = false;
            }
        }

        return valid;
    }

    validateReview = () => {
        let formErrors = this.state.formErrors;

        let score = this.state.score;
        if ( score === "" ){
            formErrors.score = "this field is required";
        }
        else if ( parseFloat(score) < 0 || parseFloat(score) > 5 ){
            formErrors.score = "score must be less than or equal 5";
        }
        else {
            formErrors.score = "";
        }

        this.setState({
            formErrors: formErrors
        })
    }

    handleChange = e => {
        const { name,value } = e.target
        this.setState({
            // [name]: (name === "start_time" || name === "end_time" ) ? value.replace(":",".") : value
            [name] : (name === "start_time" || name === "end_time" ) ? value.substring(0,value.indexOf(":")) : value
        })
    }

    isUserOwner = () => {
        return this.state.court.owner.username === this.props.user.username;
    }

    handleAddImage = async e => {
        e.preventDefault();
        this.validateAddImage();

        if ( this.isAddImageFormValid() ){
            try{
                this.setState({
                    uploading: true
                });
                let data = await uploadFileToS3(this.state.file, this.state.court.name + (new Date()).getTime(), "court_images");
                console.log(data);
                console.log(data.location);
                await this.props.addImageToCourt(this.state.courtName, data.location);
                window.location.reload();
            }
            catch(err){
                this.setState({
                    uploading: false
                })
                alert(err);
                console.error(err);
            }
        }
    }

    isAddImageFormValid = () => {
        return this.state.imageUploadError === "";
    }

    validateAddImage = () => {
        let imageUploadError = this.state.imageUploadError;

        if ( this.state.file === "" ){
            imageUploadError = "Please select your image to upload";
        }
        else {
            imageUploadError = "";
        }

        this.setState({
            imageUploadError: imageUploadError
        })
    }

    handleImageChange = (e) => {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
          });
        }
    
        reader.readAsDataURL(file)
      }

      handleReserve = async (e) => {
          e.preventDefault();

          console.log("submit reserve");
          if ( this.state.start_time === "" || this.state.end_time === "" || this.state.day_of_the_week === "" ){
            alert("invalide reserve input");
            return;
          }

          let res = await this.props.bookCourt(this.state.courtName,this.state.start_time,this.state.end_time,this.state.day_of_the_week);
          console.log(res);
      }

      handleApiLoaded = (map, maps) => {
        let marker = new maps.Marker({
            position: {
                lat: this.state.court.lat,
                lng: this.state.court.long
            },
            map,
          });
          this.setState({
              marker: marker,
          });
          console.log(marker);
    };

    handleCheckbox = (e) => {
        let name = e.target.name
        this.setState({ [name]: e.target.checked });
    }

    changeRating = e => {
        this.setState({
            score: e
        });
    }

    render(){

        if ( this.state.court == null ){
            return <h1>Loading...</h1>
        }

        let addReviewSection;
        if ( this.state.loadFinish && !this.isUserOwner() ){
            addReviewSection = (
                <div className="my-4 section-border">
                    <h3>Add Review</h3>
                    <Form onSubmit={this.handleReview}>
                        <Form.Group className="text-left">
                            <Form.Label className="mr-4">score</Form.Label>
                            <StarRatings
                                rating={parseFloat(this.state.score)}
                                starRatedColor="orange"
                                starDimension="20px"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                            />
                        </Form.Group>
                        <Form.Group className="text-left">
                            <Form.Label>review</Form.Label>
                            <textarea placeholder="write your review here..." name='review' className="form-control" col="2" onChange={this.handleChange}></textarea>
                        </Form.Group>
                        <div className="text-right">
                            <button className="btn btn-primary" type="submit">add review</button>
                        </div>
                    </Form>
                </div>
            );
        }

        let addImageSection;
        if ( this.state.loadFinish &&  this.isUserOwner() ){
            addImageSection = (
                <div className="my-4">
                    <h3>Add Image To Your Court</h3>
                    <Form onSubmit={this.handleAddImage}>
                        <Form.Group>
                            <Form.Control onChange={this.handleImageChange} name="image" type="file"></Form.Control>
                            <p className="error-form-field">{this.state.imageUploadError}</p>
                        </Form.Group>
                        {this.state.imagePreviewUrl === "" ? null : <img src={this.state.imagePreviewUrl}/>}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary" disabled={this.state.uploading}>Upload</button>
                        </div>
                    </Form>
                </div>
            );
        }

        let reserveRacketSection = [];
        if ( this.state.loadFinish && this.state.reserveRacket ){
            for( let index in this.state.rackets ){
                let racket = this.state.rackets[index];
                reserveRacketSection.push(
                    <Row key={"row"+racket.name}>
                        <Col md="3">{"name: "+racket.name}</Col>
                        <Col md="2">{"price: " + racket.price+" bath"}</Col>
                        <Col md="2">{"in stock: " +racket.count}</Col>
                        <Col md="2">reserve amount:</Col>
                        <Col md="3">
                            <Form.Control type="number" name={"racket_"+racket.name} min="0" max={racket.count} />
                        </Col>
                    </Row>
                );
            }
        }

        let reserveShuttlecockSection = [];
        if ( this.state.loadFinish && this.state.reserveShuttlecock){
            for( let index in this.state.shuttlecocks ){
                let shuttlecock = this.state.shuttlecocks[index];
                reserveShuttlecockSection.push(
                    <Row key={"row"+shuttlecock.name}>
                        <Col md="3">{"name: "+shuttlecock.name}</Col>
                        <Col md="2">{"price: " + shuttlecock.count_per_unit+" bath"}</Col>
                        <Col md="2">{"in stock: " +shuttlecock.count}</Col>
                        <Col md="2">reserve amount:</Col>
                        <Col md="3">
                            <Form.Control type="number" name={"racket_"+shuttlecock.name} min="0" max={shuttlecock.count} />
                        </Col>
                    </Row>
                );
            }
        }

        let reserveSection;
        if ( this.state.loadFinish && this.state.court.is_verified ){
            reserveSection = (
                <div className="my-4 section-border">
                    <h3>reserve this court</h3>
                    <hr />
                    <Form onSubmit={this.handleReserve} className="mt-4">
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">start time</Form.Label>
                            <Form.Control className="col-md-5" name="start_time" type="time" onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">end time</Form.Label>
                            <Form.Control className="col-md-5" name="end_time" type="time" onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">day of the week</Form.Label>
                            <Form.Control name="day_of_the_week" className="col-md-5" as="select" onChange={this.handleChange}>
                                <option value="1">monday</option>
                                <option value="2">tuesday</option>
                                <option value="3">wednesday</option>
                                <option value="4">thrusday</option>
                                <option value="5">friday</option>
                                <option value="6">saturday</option>
                                <option value="0">sunday</option>
                            </Form.Control>
                        </Form.Group>
                        <hr className="my-4" />
                        <h5 className="mb-4">Do you want to reserve rattles and buy shuttlecocks?</h5>
                        <Form.Group> 
                            <Form.Check type="checkbox" label="I want to reserve rackets." name="reserveRacket" onChange={this.handleCheckbox}/>
                            {reserveRacketSection}
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type="checkbox" label="I want to buy shuttlecocks." name="reserveShuttlecock" onChange={this.handleCheckbox}/>
                            {reserveShuttlecockSection}
                        </Form.Group>
                        <div className="text-right mt-3">
                            <button type="submit" className="btn btn-primary">reserve</button>
                        </div>
                        
                    </Form>
                </div>
            );
        }

        let courtCarousel;
        if ( this.state.court.images.length === 0 ){
            courtCarousel = <img className="court-carousel" src={ImagePlaceholder} alt="court image" />
        }
        else {
            let carouselItems = [];
            for(let index in this.state.court.images ){
                let imageUrl = this.state.court.images[index].url;
                carouselItems.push(
                    <CarouselItem key={"carousel-"+index}>
                        <img src={imageUrl} className="court-carousel"/>
                    </CarouselItem>
                );
            }
            courtCarousel = (
                <Carousel>
                    {carouselItems}
                </Carousel>
            );
        }

        // let mapSection;
        // if ( this.state.loadFinish ){
        //     mapSection = (
        //         <div style={{width: "100%", height: "600px"}}>
        //             <GoogleMapReact
        //                 bootstrapURLKeys={{ key: gmApiKey }}
        //                 defaultZoom={11}
        //                 center={{lat: this.state.court.lat, lng: this.state.court.long}}
        //                 yesIWantToUseGoogleMapApiInternals
        //                 onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        //                 >
                            
        //             </GoogleMapReact>
        //         </div>
        //     );
        // }

        let rating = (
            <StarRatings
                rating={this.state.court.avg_score}
                starDimension="30px"
                starRatedColor="orange"
                numberOfStars={5}
                name='rating'
            />
        );

        return (
            <div className="app-content-inner">
                <div className="container text-left">
                    <div className="header-text-group">
                        <h1>{this.state.court.name}</h1>
                        <p>{this.state.court.desc}</p>
                    </div>
                    <div className="text-center court-corousel-holder">
                        {courtCarousel}
                    </div>
                    {/* <p>rating: <span style={{color: "orange"}}>{this.state.court.avg_score.toFixed(1)}</span></p> */}
                    <div className="my-3 d-flex flex-row justify-content-between">
                        <div>
                            rating: {rating}
                        </div>
                        <div>
                            <span className="text-secondary">owner: </span>
                            <span>{this.state.court.owner.first_name + " " + this.state.court.owner.last_name}</span>
                        </div>
                    </div>
                    {/* {mapSection} */}
                    {reserveSection}
                    {addReviewSection}
                    {addImageSection}
                </div>  
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        loadCourt: (courtName) => {
          return dispatch(courtActions.loadCourt(courtName));
        },
        reviewCourt: (courtName, score, review) => {
            return dispatch(courtActions.reviewCourt(courtName, score, review));
        },
        addImageToCourt: (courtName, url) => {
            return dispatch(courtActions.addImageToCourt(courtName, url));
        },
        bookCourt: (courtName, start, end, day_of_the_week) => {
            return dispatch(courtActions.bookCourt(courtName,start,end,day_of_the_week));
        },
        loadRackets: () => {
            return dispatch(courtActions.loadRackets());
        },
        loadShuttlecock: () => {
            return dispatch(courtActions.loadShuttlecock());
        }
      };
}

export default connect(mapStateToProps, mapDispatchToProps)(Court);