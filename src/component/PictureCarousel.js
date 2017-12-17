import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/PictureCarousel.css';
import { Carousel, Button, Modal } from 'react-bootstrap';
import _ from 'lodash';

class PictureCarousel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index,
			direction: null,
			width: 0,
			height: 0,
			showModal: false,
			modalText: ''
		}
		this.handleSelect = this.handleSelect.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.createMarkup = this.createMarkup.bind(this);
		this.calculateImageHeight = this.calculateImageHeight.bind(this);
		this.calculateImageWidth = this.calculateImageWidth.bind(this);
	}

	openModal(text){
		this.setState({ 
			showModal: true,
			modalText: text
		});
	}

	closeModal(){
		this.setState({ showModal: false });
	}

	handleSelect(selectedIndex, event) {
		this.setState({
			index: selectedIndex,
			direction: event.direction,
		});
		this.closeModal();
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	createMarkup(html) {
		return {__html: html};
	}

	calculateImageWidth(width, height){
		if(this.state.height < height) {
			return width * this.state.height / height;
		}
		return width;
	}

	calculateImageHeight(width, height){
		return this.state.height < height ? this.state.height : height;
	}

	getCarouselList(){
		return _.map(this.props.photolist, (item, index) => {
			console.log(item, index);
			return (
				<Carousel.Item key={item.key}>
					{item.sizes ? 
						<img 
						width={this.calculateImageWidth(item.sizes[item.sizes.length - 1].width, item.sizes[item.sizes.length - 1].height)} 
						height={this.calculateImageHeight(item.sizes[item.sizes.length - 1].width, item.sizes[item.sizes.length - 1].height)} 
						alt="900x500" src={item.sizes[item.sizes.length - 1].source} /> : null 
					}
					<Carousel.Caption>
						<h3>{item.title}</h3>
						<Button
							bsStyle="primary"
							bsSize="large"
							onClick={() => this.openModal(item.info.description)}
						>
							Read description
						</Button>
						{item.info ? 
							<div className="details">	
								<span><i className="fa fa-calendar"></i> uploaded: {item.info.dateuploaded.display}</span>
								<span><i className="fa fa-calendar"></i> Last Updated: {item.info.lastupdate.display}</span>
								<span><i className="fa fa-calendar"></i> Posted: {item.info.posted.display}</span>
								<span><i className="fa fa-calendar"></i> Taken: {item.info.taken.display}</span>
								<span><i className="fa fa-map-marker"></i> Location: {item.info.owner.location}</span>
								<span><i className="fa fa-user"></i> User: {item.info.owner.realname}</span>
							</div> : null
						}
						
					</Carousel.Caption>
				</Carousel.Item>
			);
		});
	}

	render() {
		let carouselStyle= {
			width: this.state.width, 
			height: this.state.height
		};
		return(
			<div>
				<div className="close-button" onClick={this.props.onClose}><i className="fa fa-times-circle-o"></i></div>
				<Carousel style={carouselStyle} activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
					{this.getCarouselList()}
				</Carousel>
				<Modal show={this.state.showModal} onHide={this.closeModal}>
					<Modal.Header closeButton>
						<Modal.Title>Image Description</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p dangerouslySetInnerHTML={this.createMarkup(this.state.modalText)}></p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closeModal}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}

}

export default PictureCarousel;
