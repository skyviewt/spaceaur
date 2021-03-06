import React, { Component } from 'react';
import NavBar from './NavBar';
import PicturesContainer from './PicturesContainer';

const APIKEY = 'a5e95177da353f58113fd60296e1d250';
const USERID = '24662369@N07';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      labelText: 'Sort by Date Posted Most Recent First',
      sortField: '',
      isAscending: false,
      carouselIndex: 0,
      isCarouselShown: false
    };
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(data) {
    this.setState(data);
  }

  render() {
    return (
      <div>
        {!this.state.isCarouselShown ? (
          <NavBar
            onUpdate={this.onUpdate}
            labelText={this.state.labelText}
            filterText={this.state.filterText}
          />
        ) : null}
        <PicturesContainer
          onUpdate={this.onUpdate}
          isCarouselShown={this.state.isCarouselShown}
          carouselIndex={this.state.carouselIndex}
          filterText={this.state.filterText}
          sortField={this.state.sortField}
          isAscending={this.state.isAscending}
          apiKey={APIKEY}
          userId={USERID}
        />
      </div>
    );
  }
}

export default App;
