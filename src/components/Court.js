import React from 'react';
import {connect} from 'react-redux';
import {court as courtActions} from '../actions';
import { Form, Col, CarouselItem, Carousel } from 'react-bootstrap';
import {upload as uploadFileToS3} from '../s3';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import './court.css';

class Court extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            courtName: this.props.match.params.courtName,
            court: null,
            loadFinish: false,
            score: "",
            review: "",
            formErrors: {
                score: ""
            },
            file: "",
            imagePreviewUrl: "",
            imageUploadError: "",
            uploading: false,
            day_of_the_week: "monday",
            start_time: "",
            end_time: ""
        }
    }

    async componentDidMount(){
        try {
            let court = await this.props.loadCourt(this.state.courtName);
            this.setState({
                loadFinish: true,
                court: court,
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
            [name]: (name === "start_time" || name === "end_time" ) ? value.replace(":",".") : value
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

    render(){

        if ( this.state.court == null ){
            return <h1>Loading...</h1>
        }

        let addReviewSection;
        if ( this.state.loadFinish && !this.isUserOwner() ){
            addReviewSection = (
                <div className="my-4">
                    <h3>Add Review</h3>
                    <Form onSubmit={this.handleReview}>
                        <Form.Group className="text-left">
                            <Form.Label>score</Form.Label>
                            <Form.Control name="score" type="number" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.score}</p>
                        </Form.Group>
                        <Form.Group className="text-left">
                            <Form.Label>review</Form.Label>
                            <textarea name='review' className="form-control" col="2" onChange={this.handleChange}></textarea>
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

        let reserveSection;
        if ( this.state.loadFinish ){
            reserveSection = (
                <div className="my-4">
                    <h3>reserve this court</h3>
                    <Form onSubmit={this.handleReserve}>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">start time</Form.Label>
                            <Form.Control className="col-md-9" name="start_time" type="time" onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">end time</Form.Label>
                            <Form.Control className="col-md-9" name="end_time" type="time" onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">day of the week</Form.Label>
                            <Form.Control name="day_of_the_week" className="col-md-9" as="select" onChange={this.handleChange}>
                                <option>monday</option>
                                <option>tuesday</option>
                                <option>wednesday</option>
                                <option>thrusday</option>
                                <option>friday</option>
                                <option>saturday</option>
                                <option>sunday</option>
                            </Form.Control>
                        </Form.Group>
                        <div className="text-right">
                            <button type="submti" className="btn btn-primary">reserve</button>
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

        return (
            <div className="app-content-inner">
                <div className="container text-left">
                    <h1>{this.state.court.name}</h1>
                    <p>{this.state.court.desc}</p>
                    <div className="text-center court-corousel-holder">
                        {courtCarousel}
                    </div>
                    <p>rating: <span style={{color: "orange"}}>{this.state.court.avg_score}</span></p>
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
        }
      };
}

export default connect(mapStateToProps, mapDispatchToProps)(Court);