import React, { Component } from 'react';
import Picture from './Picture';
import Masonry from 'react-masonry-component';

const getPicturesUrl = (apiKey, userId) =>
`https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;

class PicturesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    componentDidMount() {
        fetch(getPicturesUrl(this.props.apiKey, this.props.userId))
            .then(response => {
                if (!response.ok) {
                    throw Error("Network request failed")
                }

                return response;
            })
            .then(d => d.json())
            .then(data => {
                console.log(this.props);
                console.log(data);
                this.setState({
                    flikrPhotosRawData: data.photos.photo,
                    page: data.photos.page,
                    pages: data.photos.pages
                });
                
            }, () => {
            this.setState({
                error: true
            })
        });
    }

    // addToParsedPhoto(photo){
    //     if(!this.state.photos){
    //         this.state.photos = [photo];

    //     }else{
    //         this.state.photos.push(photo);
    //     }
    // }

    
    
      render() {
    
        if (this.state.error) {
             return <p>Failed!</p>
        }
        if (!this.state.flikrPhotosRawData) {
            return <i className="fa fa-spinner fa-spin"></i>
        } 
        var that = this;
        var listItems = this.state.flikrPhotosRawData.map(function(item) {
			return (
				<Picture key={item.id} photoId={item.id} secret={item.secret} server={item.server} farm={item.farm} title={item.title} apiKey={that.props.apiKey}></Picture>
			);
		});
        return (
            <Masonry
            className={'my-gallery-class'} // default ''
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
            {listItems}
        </Masonry>
        );
      }
  }


export default PicturesContainer;
