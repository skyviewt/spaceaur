import React, { Component } from 'react';
import '../css/Picture.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Thumbnail, Col } from 'react-bootstrap';

const thumbnailUrl = (farm, server, photoId, secret) =>
  `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}.jpg`;

class Picture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false
    };
    this.openCarousel = this.openCarousel.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  openCarousel() {
    this.props.onPictureClick(this.props.index);
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering
    };
  }

  render() {
    return (
      <Col
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
        onClick={() => this.openCarousel()}
        xs={12}
        sm={6}
        md={4}
        lg={3}
      >
        <span className="index-counter">{this.props.index + 1}</span>
        <Thumbnail
          src={thumbnailUrl(
            this.props.farm,
            this.props.server,
            this.props.photoId,
            this.props.secret
          )}
          alt={this.props.title}
        >
          <p className="image-title">
            {this.props.title}{' '}
            {this.props.info ? (
              <span className="view-count">
                <i className="fa fa-eye" />
                {this.props.info.views} views
              </span>
            ) : null}{' '}
          </p>
        </Thumbnail>
        {this.state.isHovering ? (
          <div className="on-hover">
            <span>
              <i className="fa fa-camera-retro fa-2x" /> Click for more details
            </span>
          </div>
        ) : null}
      </Col>
    );
  }
}

export default Picture;
