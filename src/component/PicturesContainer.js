import React, { Component } from 'react';
import Picture from './Picture';
import Masonry from 'react-masonry-component';
import Waypoint from 'react-waypoint';
import '../css/PicturesContainer.css';

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
			error: false,
			isLoading: true

		};
		this.fetchMorePhotos = this.fetchMorePhotos.bind(this);
		this.disPatchAllPromises = this.disPatchAllPromises.bind(this);
		this.handleImageLoaded = this.handleImageLoaded.bind(this);

	}

	fetchSizes(apiKey, farm, secret, id){
		return fetch(getSizesUrl(apiKey, id))
			.then(response => {
				if (!response.ok) {
					throw Error('Network request failed')
				}
				return response;
			})
			.then(d => d.json())
			.then(d => {
				return {key: farm+'-'+secret+'-'+id,
						sizes: d.sizes.size};
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
					throw Error('Network request failed')
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
							display: new Date(_.toNumber(d.photo.dates.lastupdate) * 1000)
						},
						posted: {
							numeric: _.toNumber(d.photo.dates.posted),
							display: new Date(_.toNumber(d.photo.dates.posted) * 1000)
						},
						taken: {
							numeric: dateTakenObj.getTime()/1000|0,
							display: dateTakenObj
						},
						dateuploaded: {
							numeric: _.toNumber(d.photo.dateuploaded),
							display: new Date(_.toNumber(d.photo.dateuploaded))
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

			// console.log(merged);

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
					throw Error('Network request failed')
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

	handleImageLoaded(){
		this.setState({
			isLoading: false
		});
	}


	componentDidMount() {
		this.fetchPictures(this.state.page);
	}

	fetchMorePhotos(){
		console.log('in waypoint');
		if(this.state.page < this.state.pages && !this.state.isLoading) {
			this.fetchPictures(this.state.page + 1);
		}
	}


	getPictureList(){
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

		if(this.props.sortField && this.props.sortField !== ''){

			filteredArray = _.orderBy(filteredArray, item =>{
				if(this.props.sortField === 'views'){
					return item.info[that.props.sortField];
				}
				return item.info[that.props.sortField].numeric;
			}, [that.props.isAscending ? 'asc' : 'desc']);

		}
		// console.log(filteredArray);
		return _.map(filteredArray, (item, index) => {
			return (
				<Picture index={index} key={item.farm+'-'+item.secret+'-'+item.id} photoId={item.id} secret={item.secret} server={item.server} farm={item.farm} title={item.title} info={item.info} sizes={item.sizes} apiKey={that.props.apiKey}></Picture>
			);
		});
	}


	render() {

		if (this.state.error) {
			return <p>Failed!</p>
		}

		return (
			<div>
				<div>
					<Masonry
						className={"my-gallery-class"} 
						disableImagesLoaded={false}
						updateOnEachImageLoad={false}
						onImagesLoaded={this.handleImageLoaded}>

						{this.getPictureList()}

					</Masonry>
				</div>
				<Waypoint
					buttomOffset={'-200px'}
					onEnter={this.fetchMorePhotos}
					debug={true}
				>
					 <div className="loader"><i className="fa fa-spinner fa-spin"></i></div>
				</Waypoint>
			</div>
		);
	}
	}


export default PicturesContainer;
