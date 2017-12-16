import React, { Component } from 'react';
import Picture from './Picture';
import Masonry from 'react-masonry-component';
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
			error: false
		};
	}


	fetchSizes(apiKey, id){
		return fetch(getSizesUrl(apiKey, id))
			.then(response => {
				if (!response.ok) {
					throw Error('Network request failed')
				}
				return response;
			})
			.then(d => d.json())
			.then(d => {
				return {id: id,
						sizes: d.sizes.size};
			},
			 () => {
			this.setState({
				error: true
			});
		});
	}


	fetchInfo(apiKey, id, secret){
		return fetch(getInfoUrl(apiKey, id, secret))
			.then(response => {
				if (!response.ok) {
					throw Error('Network request failed')
				}
				return response;
			})
			.then(d => d.json())
			.then(d => {
				return {id: id,
					info: {
						lastupdate: d.photo.dates.lastupdate,
						posted: d.photo.dates.posted,
						taken: d.photo.dates.taken,
						dateuploaded: d.photo.dateuploaded,
						description: d.photo.description._content,
						owner: {
							location: d.photo.owner.location,
							realname: d.photo.owner.realname
						},
						views: d.photo.views
					}};
				
			}, () => {
			this.setState({
				error: true
			});
		});

	}


	getSizesForAllPics(sizesCallArray){
		let stateObj = this.state.photolist;
		return Promise.all(sizesCallArray).then(response =>{

			// if arrays order not maintained:
			//Concat the arrays, and reduce the combined array to a Map. 
			//Use Object#assign to combine objects with the same id to a new object,
			// and store in map. Convert the map to an array with Map#values and spread
		   
			// const merged = [...stateObj.concat(response).reduce((m, o) => 
			//     m.set(o.id, Object.assign(m.get(o.id) || {}, o))
			// , new Map()).values()];

			// array order is maintained, can just do
			const merged = _.merge(stateObj, response);

			console.log(merged);

			this.setState({
				photolist: merged
			});
		})
	}


	getInfoForAllPics(infosCallArray){
		let stateObj = this.state.photolist;
		return Promise.all(infosCallArray).then(response =>{

			const merged = _.merge(stateObj, response);

			console.log(merged);
			this.setState({
				photolist: merged
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

				let photos = data.photos.photo.map(photo =>{
					getSizeCalls.push( that.fetchSizes(that.props.apiKey, photo.id) );
					getInfoCalls.push( that.fetchInfo(that.props.apiKey, photo.id, photo.secret));
					return {
					   'id': photo.id,
					   'farm': photo.farm,
					   'owner': photo.owner,
					   'secret': photo.secret,
					   'server': photo.server,
					   'title': photo.title 
					}
				});

				this.setState({
					photolist: photos,
					page: data.photos.page,
					pages: data.photos.pages
				});

				this.getSizesForAllPics(getSizeCalls);
				this.getInfoForAllPics(getInfoCalls);
				
			}, () => {
			this.setState({
				error: true
			});
		});
	}


	sortByfilter(fieldToFilter){

	}

	// componentWillReceiveProps(nextProps) {
	//   console.log(nextProps);
	//   if(this.state.sortField !== nextProps.sortField || this.state.isAscending !== nextProps.isAscending) {
	//   	this.setState({
	//   		sortField: nextProps.sortField,
	//   		isAscending: nextProps.isAscending
	//   	});
	//   }
	// }

	componentDidMount() {
		this.fetchPictures(this.state.page);
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
				return _.toNumber(item.info[that.props.sortField]);
			}, [that.props.isAscending ? 'asc' : 'desc']);

		}
		console.log(filteredArray);
		return _.map(filteredArray, (item, index) => {
			return (
				<Picture index={index} key={item.id} photoId={item.id} secret={item.secret} server={item.server} farm={item.farm} title={item.title} info={item.info} sizes={item.sizes} apiKey={that.props.apiKey}></Picture>
			);
		});
	}


	render() {

		if (this.state.error) {
			return <p>Failed!</p>
		}
		if (!this.state.photolist) {
			return <i className="fa fa-spinner fa-spin"></i>
		} 

		return (
			<Masonry
				className={"my-gallery-class"} 
				disableImagesLoaded={false}
				updateOnEachImageLoad={true}>

				{this.getPictureList()}

			</Masonry>
		);
	}
	}


export default PicturesContainer;
