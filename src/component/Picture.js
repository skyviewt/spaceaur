import React, { Component } from 'react';
import '../css/Picture.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Thumbnail, Col } from 'react-bootstrap';


const thumbnailUrl = (farm, server, photoId, secret) =>
`https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}.jpg`;

class Picture extends Component {

	constructor(props) {
		super(props);
		this.openCarousel = this.openCarousel.bind(this);
	}

	openCarousel(){
		this.props.onPictureClick(this.props.index);
	}

	render() {

		return(
			<Col onClick={() => this.openCarousel()} xs={12} sm={6} md={4} lg={3}>
				<span className="index-counter">{this.props.index + 1}</span>
				<Thumbnail src={thumbnailUrl(this.props.farm, this.props.server, this.props.photoId, this.props.secret)} alt={this.props.title}>
					<p className="image-title">{this.props.title} {this.props.info ? <span className="view-count"><i className="fa fa-eye"></i>{this.props.info.views} views</span> : null} </p>
				</Thumbnail>
			</Col>
		);
	}

}

export default Picture;
