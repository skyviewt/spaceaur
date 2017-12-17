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
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createMarkup = this.createMarkup.bind(this);
    this.calculateImageHeight = this.calculateImageHeight.bind(this);
    this.calculateImageWidth = this.calculateImageWidth.bind(this);
    this.getImageIndex = this.getImageIndex.bind(this);
  }

  openModal(text) {
    this.setState({
      showModal: true,
      modalText: text
    });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  handleSelect(selectedIndex, event) {
    this.setState({
      index: selectedIndex,
      direction: event.direction
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
    return { __html: html };
  }

  getImageIndex(sizes) {
    return sizes.length === 1 ? 0 : sizes[0].label === 'Large' ? 0 : 1;
  }

  calculateImageWidth(sizes) {
    const index = this.getImageIndex(sizes);
    const width = sizes[index].width;
    const height = sizes[index].height;
    if (this.state.height < height) {
      return width * this.state.height / height;
    }
    return width;
  }

  calculateImageHeight(sizes) {
    const index = this.getImageIndex(sizes);
    const height = sizes[index].height;
    return this.state.height < height ? this.state.height : height;
  }

  getCarouselList() {
    return _.map(this.props.photolist, (item, index) => {
      return (
        <Carousel.Item key={item.key}>
          {item.sizes ? (
            <img
              width={this.calculateImageWidth(item.sizes)}
              height={this.calculateImageHeight(item.sizes)}
              alt={item.title}
              src={item.sizes[this.getImageIndex(item.sizes)].source}
            />
          ) : null}
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={() => this.openModal(item.info.description)}
            >
              Read description
            </Button>
            {item.info ? (
              <div className="details">
                <span>
                  <i className="fa fa-calendar" /> uploaded:{' '}
                  {item.info.dateuploaded.display}
                </span>
                <span>
                  <i className="fa fa-calendar" /> Last Updated:{' '}
                  {item.info.lastupdate.display}
                </span>
                <span>
                  <i className="fa fa-calendar" /> Posted:{' '}
                  {item.info.posted.display}
                </span>
                <span>
                  <i className="fa fa-calendar" /> Taken:{' '}
                  {item.info.taken.display}
                </span>
                <span>
                  <i className="fa fa-map-marker" /> Location:{' '}
                  {item.info.owner.location}
                </span>
                <span>
                  <i className="fa fa-user" /> User: {item.info.owner.realname}
                </span>
              </div>
            ) : null}
          </Carousel.Caption>
        </Carousel.Item>
      );
    });
  }

  render() {
    const carouselStyle = {
      width: this.state.width,
      height: this.state.height
    };
    return (
      <div>
        <div className="close-button" onClick={this.props.onClose}>
          <i className="fa fa-times-circle-o" />
        </div>
        <Carousel
          style={carouselStyle}
          activeIndex={this.state.index}
          direction={this.state.direction}
          onSelect={this.handleSelect}
        >
          {this.getCarouselList()}
        </Carousel>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Image Description</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p
              dangerouslySetInnerHTML={this.createMarkup(this.state.modalText)}
            />
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
