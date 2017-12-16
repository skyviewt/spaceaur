import React, { Component } from 'react';
import '../css/NavBar.css';
import 'bootstrap/dist/css/bootstrap.css';
import { MenuItem, Nav, Navbar, NavDropdown, FormGroup, FormControl, Button } from 'react-bootstrap';

class NavBar extends Component {


	updateText (event) {
		let fleldVal = event.target.value;
		this.props.onFilterTextUpdate(fleldVal);
	}


	clearText () {
		this.props.onFilterTextUpdate("");
	}


	render() {
		return (
			<Navbar inverse collapseOnSelect fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="/"><i className="fa fa-space-shuttle"></i>Spaceaur</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<NavDropdown title="Sort By" id="basic-nav-dropdown">
							<MenuItem><i className="fa fa-calendar-o"></i> Date Uploaded Earlist First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Uploaded Most Recent First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Last Updated Earlist First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Last Updated Most Recent First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Posted Earliest First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Posted Most Recent First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Taken Earliest First</MenuItem>
							<MenuItem><i className="fa fa-calendar-o"></i> Date Taken Most Recent First</MenuItem>
							<MenuItem divider />
							<MenuItem><i className="fa fa-eye"></i> Number of Views from Low To High</MenuItem>
							<MenuItem><i className="fa fa-eye"></i> Number of Views from High To Low</MenuItem>
						</NavDropdown>
					</Nav>

					<Navbar.Form pullRight>
						<FormGroup>
							<FormControl type="text" placeholder="Filter Image..." value={this.props.filterText} onChange={this.updateText.bind(this)} ></FormControl>
							<Button onClick={this.clearText.bind(this)} className="clear-field"><i className="fa fa-times"></i></Button>
						</FormGroup>
						{' '}
					</Navbar.Form>

				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default NavBar;
