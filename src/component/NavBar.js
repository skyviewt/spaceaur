import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { MenuItem, Nav, Navbar, NavDropdown, FormGroup, FormControl, Button } from 'react-bootstrap';

class NavBar extends Component {
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
          <NavDropdown eventKey={3} title="Sort By" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Separated link</MenuItem>
          </NavDropdown>
        </Nav>

        <Navbar.Form pullRight>
          <FormGroup>
            <FormControl type="text" placeholder="Search Image Title" />
          </FormGroup>
          {' '}
          <Button type="submit">Submit</Button>
        </Navbar.Form>

      </Navbar.Collapse>
    </Navbar>
    );
  }
}

export default NavBar;
