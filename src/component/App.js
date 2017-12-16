import React, { Component } from 'react';
import '../css/App.css';
import NavBar from './NavBar';
import PicturesContainer from './PicturesContainer';

const APIKEY = 'a5e95177da353f58113fd60296e1d250';
const USERID = '24662369@N07';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
			sortField: '',
			isAscending: false
		}
		this.onUpdate = this.onUpdate.bind(this);
	}


	onUpdate (data) {
		this.setState(data);
	};


	render() {
		return (
			<div>
				<NavBar onUpdate={this.onUpdate} filterText={this.state.filterText} ></NavBar>
				<PicturesContainer filterText={this.state.filterText} sortField={this.state.sortField} isAscending={this.state.isAscending} apiKey={APIKEY} userId={USERID}></PicturesContainer>
			</div>
		);
	}
}

export default App;
