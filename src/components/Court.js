import React from 'react';
import {connect} from 'react-redux';
import {court as courtActions, auth as authActions} from '../actions';
import { Form, CarouselItem, Carousel, Row } from 'react-bootstrap';
import {upload as uploadFileToS3} from '../s3';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import './court.css';
import GoogleMapReact from 'google-map-react';
import { gmApiKey} from '../private/keys';
import StarRatings from 'react-star-ratings';
import { Redirect } from 'react-router-dom';

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
                score: "",
                review: ""
            },
            file: "",
            imagePreviewUrl: "",
            imageUploadError: "",
            uploading: false,
            day_of_the_week: "6",
            start_time: "",
            end_time: "",
            marker: null,

            racket_name: "",
            racket_price: "",
            shuttlecock_name: "",
            shuttlecock_count: "",
            shuttlecock_count_per_unit: "",
            shuttlecock_price: "",

            shouldRedirect: false,
            booking_id: null,

            galleryImages: null
        
        }
    }

    async componentDidMount(){
        let queryParams = this.props.location.search;
        let arr = queryParams.split("&");
        let start_time, end_time, day_of_the_week_query = -1;

        for(let i=0; i<arr.length; ++i){
            if ( arr[i].includes("start_time") ){
                start_time = arr[i].split("=")[1];
            }
            else if ( arr[i].includes("end_time") ){
                end_time = arr[i].split("=")[1];
            }
            else if ( arr[i].includes("day_of_the_week") ){
                day_of_the_week_query = arr[i].split("=")[1];
            }
        }

        this.setState({
            start_time,
            end_time,
            day_of_the_week_query,
            day_of_the_week: day_of_the_week_query == -1 ? this.state.day_of_the_week : day_of_the_week_query
        });

        try {
            let court = await this.props.loadCourt(this.state.courtName);

            let galleryImages = [];
            for(let image of court.images){
                galleryImages.push({
                    original: image.url,
                    thumbnail: image.url
                });
            }
 
            this.setState({
                loadFinish: true,
                court: court,
                galleryImages: galleryImages
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
                window.location.reload();
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

        let review = this.state.review;
        if ( review.length > 200 ){
            formErrors.review = "review length should be equal to or less than 200 characters";
        }
        else{
            formErrors.review = "";
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
          this.setState({
              uploading: true
          })

          console.log("submit reserve");
          if ( this.state.start_time === "" || this.state.end_time === "" || this.state.day_of_the_week === "" 
                || parseInt(this.state.start_time) >= parseInt(this.state.end_time) ){
            alert("invalid reserve input");
            return;
          }

          try {
              let res = await this.props.bookCourt(this.state.courtName,this.state.start_time,this.state.end_time,this.state.day_of_the_week);
            console.log(res.booking_id);
            alert("reserve success");

            this.setState({
                shouldRedirect: true,
                booking_id: res.booking_id
            });
          }catch(err){
              alert(err.response.data.message);
              console.error(err.response);
          }
          
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

    handleAddRacket = async e => {
        e.preventDefault();
        this.setState({
            uploading: true
        });

        if ( this.state.racket_name === "" || this.state.racket_price === "" ){
            alert("racket inputs are invalid.");
            return ;
        }

        try{
            await this.props.addRacket(this.state.courtName, this.state.racket_name, this.state.racket_price);
            alert("add racket success");
            window.location.reload();
        }
        catch(e){
            alert("something went wrong, please try again later");
            console.error(e);
            this.setState({
                uploading: false
            });
        }
    }

    handleAddShuttlecock = async e => {
        e.preventDefault();
        this.setState({
            uploading: true
        });

        if ( this.state.shuttlecock_name === "" || this.state.shuttlecock_count === "" || 
                this.state.shuttlecock_count_per_unit === "" || this.state.shuttlecock_price === ""  ){
            alert("shuttlecocks inputs are invalid.");
            return ;
        }

        try{
            await this.props.addShuttlecock(this.state.courtName, this.state.shuttlecock_name, this.state.shuttlecock_count,
                        this.state.shuttlecock_count_per_unit, this.state.shuttlecock_price);
            alert("add shuttlecocks success");
            window.location.reload();
        }
        catch(e){
            alert("something went wrong, please try again later");
            console.error(e);
            this.setState({
                uploading: false
            });
        }
    }

    pad = (n, width) => {
        let z ='0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }

    mapTime =(timeNum) => {
        timeNum = parseInt(timeNum);
        if ( timeNum % 2 === 0 ){
            return this.pad(timeNum/2,2) + ":00";
        }
        else {
            return this.pad(timeNum/2,2) + ":30";
        }
    }

    render(){

        if ( this.state.shouldRedirect ){
            return <Redirect to={"/my_booking/" + this.state.booking_id} />
        }

        if ( this.state.court == null ){
            return <h1>Loading...</h1>
        }

        let reviews = [];
        if ( this.state.loadFinish ){
            for(let i=0; i<this.state.court.reviews.length; ++i){
                let review = this.state.court.reviews[i];
                reviews.push(
                    <div key={"review-holder"+i} className="section-border d-flex flex-column my-1">
                        <StarRatings rating={review.score} starDimension="15px" numberOfStars={5} starRatedColor="orange" />
                        <span className="review-text">{review.review}</span>
                    </div>
                );
            }
        }
        if ( reviews.length === 0 ){
            reviews = <p>this court has no review.</p>
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
                            <textarea maxLength="200" placeholder="write your review here..." name='review' className="form-control" col="2" onChange={this.handleChange}></textarea>
                            <div className="text-right">
                                <span className="text-secondary">{this.state.review.length + "/200"}</span>
                            </div>
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
                            <button type="submit" className="btn btn-primary my-3" disabled={this.state.uploading}>Upload</button>
                        </div>
                    </Form>
                </div>
            );
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
                            <Form.Control value={this.mapTime(this.state.start_time)} disabled className="col-md-5" name="start_time" type="time" onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">end time</Form.Label>
                            <Form.Control value={this.mapTime(this.state.end_time)} disabled className="col-md-5" name="end_time" type="time" onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">day of the week</Form.Label>
                            <Form.Control value={this.state.day_of_the_week} disabled={this.state.day_of_the_week_query > -1} name="day_of_the_week" className="col-md-5" as="select" onChange={this.handleChange}>
                                <option value="0">monday</option>
                                <option value="1">tuesday</option>
                                <option value="2">wednesday</option>
                                <option value="3">thrusday</option>
                                <option value="4">friday</option>
                                <option value="5">saturday</option>
                                <option value="6">sunday</option>
                            </Form.Control>
                        </Form.Group>
                        <hr className="my-4" />
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

        let mapSection;
        if ( this.state.loadFinish ){
            mapSection = (
                <div style={{width: "100%", height: "600px"}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: gmApiKey }}
                        defaultZoom={11}
                        center={{lat: this.state.court.lat, lng: this.state.court.long}}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                        >
                            
                    </GoogleMapReact>
                </div>
            );
        }

        let rating = (
            <StarRatings
                rating={this.state.court.avg_score}
                starDimension="30px"
                starRatedColor="orange"
                numberOfStars={5}
                name='rating'
            />
        );

        let addRacketSection;
        if ( this.state.loadFinish &&  this.isUserOwner() ){
            addRacketSection = (
                <div className="my-4 section-border">
                    <h3>Add Racket to your Court</h3>
                    <Form onSubmit={this.handleAddRacket}>
                        <Form.Group>
                            <Form.Label>racket name</Form.Label>
                            <Form.Control type="text" name="racket_name" onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>price</Form.Label>
                            <Form.Control type="number" min="0" max="999999" name="racket_price" onChange={this.handleChange} />
                        </Form.Group>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" disabled={this.state.uploading}>Add Rackets</button>
                        </div>
                    </Form>
                </div>
            );
        }

        let addShuttlecocksSection;
        if ( this.state.loadFinish &&  this.isUserOwner() ){
            addShuttlecocksSection = (
                <div className="my-4 section-border">
                    <h3>Add Shuttlecocks to your Court</h3>
                    <Form onSubmit={this.handleAddShuttlecock}>
                        <Form.Group>
                            <Form.Label>shuttlecocks name</Form.Label>
                            <Form.Control type="text" name="shuttlecock_name" onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>count</Form.Label>
                            <Form.Control type="number" min="0" max="9999" name="shuttlecock_count" onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>count per unit</Form.Label>
                            <Form.Control type="number" min="0" max="999999" name="shuttlecock_count_per_unit" onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>price</Form.Label>
                            <Form.Control type="number" min="0" max="999999" name="shuttlecock_price" onChange={this.handleChange} />
                        </Form.Group>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" disabled={this.state.uploading}>Add Shuttlecocks</button>
                        </div>
                    </Form>
                </div>
            );
        }

        let ownerDivideLine = this.isUserOwner() ? <hr style={{marginTop: "5rem", marginBottom: "5rem",
                     borderWidth: "5px", borderStyle: "dotted", borderTop: "none"}} /> : null;

        return (
            <div className="app-content-inner"  id="court-content-inner">
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
                    {mapSection}
                    {reserveSection}
                    <div className="header-text-group my-1">
                        <h5>Reviews</h5>
                    </div>
                    {reviews}
                    {addReviewSection}
                    {ownerDivideLine}
                    {this.isUserOwner() ? <h3 className="text-center">Court Management for Owner</h3> : null}
                    {addRacketSection}
                    {addShuttlecocksSection}
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
        addRacket: (courtName, name, price) => {
            return dispatch(courtActions.addRacket(courtName,name,price));
        },
        addShuttlecock: (courtName,name,count,count_per_unit,price) => {
            return dispatch(courtActions.addShuttlecock(courtName,name,count,count_per_unit,price));
        },
        loadUser: (username) => {
            return dispatch(authActions.loadUser(username));
        },
        getUserInfo: (username) => {
            return dispatch(authActions.getUserInfo(username));
        },
      };
}

export default connect(mapStateToProps, mapDispatchToProps)(Court);