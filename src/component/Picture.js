import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/Picure.css';
import { Thumbnail } from 'react-bootstrap';


const getSizesUrl = (apiKey, photoId) =>
`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
const getInfoUrl = (apiKey, photoId, secret) =>
`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${photoId}&secret=${secret}&format=json&nojsoncallback=1`;
const thumbnailUrl = (farm, server, photoId, secret) =>
`https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}.jpg`;

class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    fetchSizes(){
        fetch(getSizesUrl(this.props.apiKey, this.props.photoId))
            .then(response => {
                if (!response.ok) {
                    throw Error("Network request failed")
                }
                return response;
            })
            .then(d => d.json())
            .then(d => {
                
                console.log(d);
                this.setState({
                    sizes: d.sizes.size
                })

            }, () => {
            this.setState({
                error: true
            })
        });
    }

    fetchInfo(){
        fetch(getInfoUrl(this.props.apiKey, this.props.photoId, this.props.secret))
        .then(response => {
            if (!response.ok) {
                throw Error("Network request failed")
            }
            return response;
        })
        .then(d => d.json())
        .then(d => {
            
            console.log(d);
            let datefilters = d.photo.dates;
            datefilters.dateuploaded = d.dateuploaded;
            this.setState({
                dates: datefilters,
                description: d.photo.description._content,
                views: d.photo.views,
                author: d.photo.owner.username
            })
            
        }, () => {
        this.setState({
            error: true
        })
    });

    }

    fetchDetails(){
        this.fetchSizes();
        this.fetchInfo();
    }
    
    render() {
    return(
        // <div>
        //     {this.state.sizes && <img src={this.state.sizes[this.state.sizes.length-1].source}/>}
        //     <div>{this.props.title}</div>
        //     {this.state.description && <div>{this.state.description}</div>}
        //     {this.state.views && <div>{this.state.views}</div>}
        // </div>
        // <div>
        //     <img onClick={this.fetchDetails()} src={thumbnailUrl(this.props.farm, this.props.server, this.props.photoId, this.props.secret)}/>
        //     {this.state.hover ? <div>{this.props.title}</div> : null}
        // </div>
        <Thumbnail src={thumbnailUrl(this.props.farm, this.props.server, this.props.photoId, this.props.secret)} alt={this.props.title}>
            <p className="image-title">{this.props.title}</p>
      </Thumbnail>
    );

    }
  }


export default Picture;
