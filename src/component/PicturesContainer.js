import React, { Component } from 'react';
import Picture from './Picture';
import PictureCarousel from './PictureCarousel';
import Masonry from 'react-masonry-component';
import Waypoint from 'react-waypoint';
import '../css/PicturesContainer.css';
import { Alert, Button } from 'react-bootstrap';
import _ from 'lodash';

const getPicturesUrl = (apiKey, userId, pageId) =>
`https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&page=${pageId}&format=json&nojsoncallback=1&per_page=50`;
const getSizesUrl = (apiKey, photoId) =>
`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
const getInfoUrl = (apiKey, photoId, secret) =>
`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${photoId}&secret=${secret}&format=json&nojsoncallback=1`;


class PicturesContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			error: false
		};
		this.fetchMorePhotos = this.fetchMorePhotos.bind(this);
		this.disPatchAllPromises = this.disPatchAllPromises.bind(this);
		this.refreshPage = this.refreshPage.bind(this);
		this.dismissError = this.dismissError.bind(this);
		this.handleOpenCarousel = this.handleOpenCarousel.bind(this);
		this.handleCloseCarousel = this.handleCloseCarousel.bind(this);
		this.syncPictureListState = this.syncPictureListState.bind(this);
	}

	fetchSizes(apiKey, farm, secret, id){
		return fetch(getSizesUrl(apiKey, id))
			.then(response => {
				if (!response.ok) {
					this.setState({
						error: true,
						errorMessage: response.statusText
					});
				}
				return response;
			})
			.then(d => d.json())
			.then(d => {
				const sizes = _.filter(d.sizes.size, (photo) =>{ 
					return photo.label === 'Large' || photo.label === 'Original'; 
				});
				return {key: farm+'-'+secret+'-'+id,
						sizes: sizes};
			},
			 () => {
			this.setState({
				error: true
			});
		});
	}


	fetchInfo(apiKey, farm, secret, id){
		return fetch(getInfoUrl(apiKey, id, secret))
			.then(response => {
				if (!response.ok) {
					this.setState({
						error: true,
						errorMessage: response.statusText
					});
				}
				return response;
			})
			.then(d => d.json())
			.then(d => {

				let dateTakenObj = new Date(d.photo.dates.taken);

				return {key: farm+'-'+secret+'-'+id,
					info: {
						lastupdate: {
							numeric: _.toNumber(d.photo.dates.lastupdate),
							display: (new Date(_.toNumber(d.photo.dates.lastupdate) * 1000).toDateString())
						},
						posted: {
							numeric: _.toNumber(d.photo.dates.posted),
							display: (new Date(_.toNumber(d.photo.dates.posted) * 1000).toDateString())
						},
						taken: {
							numeric: dateTakenObj.getTime()/1000|0,
							display: dateTakenObj.toDateString()
						},
						dateuploaded: {
							numeric: _.toNumber(d.photo.dateuploaded),
							display: (new Date(_.toNumber(d.photo.dateuploaded) * 1000).toDateString())
						},
						description: d.photo.description._content,
						owner: {
							location: d.photo.owner.location,
							realname: d.photo.owner.realname
						},
						views: _.toNumber(d.photo.views)
					}};
				
			}, () => {
			this.setState({
				error: true
			});
		});

	}


	disPatchAllPromises(callsArray){
		let stateObj = this.state.photolist;

		let firstPages = stateObj.length === 50 ? [] : _.dropRight(stateObj, 50);
		let lastPage = stateObj.length === 50 ? stateObj : stateObj.slice(-50);
		return Promise.all(callsArray).then(response =>{

			// array order is maintained, can just do

			const merged = (_.merge(lastPage, response));

			this.setState({
				photolist: firstPages.concat(merged)
			});
		})
	}


	fetchPictures(pageId){
		var that = this;
		fetch(getPicturesUrl(this.props.apiKey, this.props.userId, pageId))
			.then(response => {
				if (!response.ok) {
					this.setState({
						error: true,
						errorMessage: response.statusText
					});
				}
				return response;
			})
			.then(d => d.json())
			.then(data => {

				let getSizeCalls = [];
				let getInfoCalls = [];
				let previousPhotos = this.state.photolist || [];
				let photos = data.photos.photo.map(photo =>{
					getSizeCalls.push( that.fetchSizes(that.props.apiKey, photo.farm, photo.secret, photo.id) );
					getInfoCalls.push( that.fetchInfo(that.props.apiKey, photo.farm, photo.secret, photo.id));
					return {
					   'id': photo.id,
					   'key': photo.farm+'-'+photo.secret+'-'+photo.id,
					   'farm': photo.farm,
					   'owner': photo.owner,
					   'secret': photo.secret,
					   'server': photo.server,
					   'title': photo.title 
					};
				});

				that.setState({
					photolist: previousPhotos.concat(photos),
					page: data.photos.page,
					pages: data.photos.pages
				});

				that.disPatchAllPromises(getSizeCalls);
				that.disPatchAllPromises(getInfoCalls);
				
			}, () => {
			this.setState({
				error: true
			});
		});
	}

	handleOpenCarousel(index){
		this.props.onUpdate({
			carouselIndex: index,
			isCarouselShown: true
		});
	}

	handleCloseCarousel(){
		this.props.onUpdate({isCarouselShown: false});
	}

	componentDidMount() {
		this.fetchPictures(this.state.page);
	}

	fetchMorePhotos(){
		if(this.state.page < this.state.pages) {
			this.fetchPictures(this.state.page + 1);
			this.dismissError();
		}
	}

	dismissError() {
		this.setState({
			error: false
		})
	}

	refreshPage() {
		this.setState({
			page: 1,
			error: false,
			photolist: []
		});
		this.fetchMorePhotos();
		this.dismissError();
	}

	syncPictureListState(){
		let that = this;
		let filteredArray = this.state.photolist;

		if(this.props.filterText && this.props.filterText !== ''){
			filteredArray = _.filter(that.state.photolist, (item) => {
				if(isNaN(that.props.filterText)) {
					// search for title
					return item.title.toLowerCase().indexOf(that.props.filterText.toLowerCase()) !== -1;
				}else{
					return item.id.toLowerCase().indexOf(that.props.filterText.toLowerCase()) !== -1;
				}
			});
		}

		// don't sort when all the info hasnt arrived yet; sort will trigger when they do
		if(this.props.sortField && this.props.sortField !== '' && filteredArray[filteredArray.length-1].info){

			filteredArray = _.orderBy(filteredArray, item =>{
				if(this.props.sortField === 'views'){
					return item.info[that.props.sortField];
				}
				return item.info[that.props.sortField].numeric;
			}, [that.props.isAscending ? 'asc' : 'desc']);

		}
		return filteredArray;
	}

	getPictureList(){
		let that = this;
		const filteredArray = this.syncPictureListState();
		// console.log(filteredArray);
		return _.map(filteredArray, (item, index) => {
			return (
				<Picture onPictureClick={ (index) => this.handleOpenCarousel(index)} index={index} key={item.farm+'-'+item.secret+'-'+item.id} photoId={item.id} secret={item.secret} server={item.server} farm={item.farm} title={item.title} info={item.info} sizes={item.sizes} apiKey={that.props.apiKey}></Picture>
			);
		});
	}


	render() {
		return (
			<div>
				<div className="main-container">
					{ this.state.error ?
					<Alert bsStyle="danger" className="error-alert" onDismiss={this.dismissError}>
					<h4>Oh snap! You got an error!</h4>
						<p>{this.state.errorMessage ? this.state.errorMessage : 'please try again.'}</p>
						<p className="buttons">
							<Button bsStyle="danger" onClick={this.refreshPage}>Refresh Page</Button>
	            			<Button onClick={this.dismissError}>Close</Button>
	            		</p>
	        		</Alert> : null }
					<div>
						<Masonry
							className={"my-gallery-class"} 
							disableImagesLoaded={false}
							updateOnEachImageLoad={true}
						>

							{this.getPictureList()}

						</Masonry>
					</div>
					<Waypoint
						buttomOffset={'-200px'}
						onEnter={this.fetchMorePhotos}
					>
						 <div className="loader"><i className="fa fa-spinner fa-spin"></i></div>
					</Waypoint>
				</div>
				{ this.props.isCarouselShown ? 
					<div className="overlay">
						<PictureCarousel onClose={ () => this.handleCloseCarousel()} index={this.props.carouselIndex} photolist={this.syncPictureListState()}></PictureCarousel> 
					</div>
					: null
				}
			</div>
		);
	}
}


export default PicturesContainer;
