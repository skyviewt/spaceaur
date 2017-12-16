import React, { Component } from 'react';
import '../css/App.css';
import NavBar from './NavBar';
import PicturesContainer from './PicturesContainer';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			filterText: ''
		}
	}


	onFilterTextUpdate (data) { 
		this.setState({
			filterText: data
		}) 
	};


	render() {
		return (
			<div>
				<NavBar onFilterTextUpdate={this.onFilterTextUpdate.bind(this)} filterText={this.state.filterText} ></NavBar>
				<PicturesContainer filterText={this.state.filterText} apiKey="a5e95177da353f58113fd60296e1d250" userId="24662369@N07"></PicturesContainer>
			</div>
		);
	}
}

export default App;
