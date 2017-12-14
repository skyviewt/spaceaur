import React, { Component } from 'react';
import '../css/App.css';
import NavBar from './NavBar';
import PicturesContainer from './PicturesContainer';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar></NavBar>
        <PicturesContainer apiKey="a5e95177da353f58113fd60296e1d250" userId="24662369@N07"></PicturesContainer>
      </div>
    );
  }
}

export default App;
