import React, { Component } from 'react';
import '../css/NavBar.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  MenuItem,
  Nav,
  Navbar,
  NavDropdown,
  FormGroup,
  FormControl,
  Button
} from 'react-bootstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.updateFilterText = this.updateFilterText.bind(this);
    this.updateSortField = this.updateSortField.bind(this);
    this.clearText = this.clearText.bind(this);
    this.onChangeNavName = this.onChangeNavName.bind(this);
  }

  updateFilterText(event) {
    this.props.onUpdate({ filterText: event.target.value });
  }

  updateSortField(value, isAscending) {
    console.log(value, isAscending);
    this.props.onUpdate({
      sortField: value,
      isAscending: isAscending
    });
  }

  clearText() {
    this.props.onUpdate({ filterText: '' });
  }

  onChangeNavName(eventKey) {
    this.props.onUpdate({
      labelText: 'Sort by ' + this.refs[eventKey].props.children[1]
    });
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">
              <i className="fa fa-space-shuttle" /> Spaceaur
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown title={this.props.labelText} id="basic-nav-dropdown">
              <MenuItem
                ref="dateuploaded1"
                eventKey="dateuploaded1"
                onClick={() => this.updateSortField('dateuploaded', true)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Uploaded Earliest First
              </MenuItem>
              <MenuItem
                ref="dateuploaded2"
                eventKey="dateuploaded2"
                onClick={() => this.updateSortField('dateuploaded', false)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Uploaded Most Recent
                First
              </MenuItem>
              <MenuItem
                ref="lastupdate1"
                eventKey="lastupdate1"
                onClick={() => this.updateSortField('lastupdate', true)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Last Updated Earliest
                First
              </MenuItem>
              <MenuItem
                ref="lastupdate2"
                eventKey="lastupdate2"
                onClick={() => this.updateSortField('lastupdate', false)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Last Updated Most Recent
                First
              </MenuItem>
              <MenuItem
                ref="posted1"
                eventKey="posted1"
                onClick={() => this.updateSortField('posted', true)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Posted Earliest First
              </MenuItem>
              <MenuItem
                ref="posted2"
                eventKey="posted2"
                onClick={() => this.updateSortField('posted', false)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Posted Most Recent First
              </MenuItem>
              <MenuItem
                ref="taken1"
                eventKey="taken1"
                onClick={() => this.updateSortField('taken', true)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Taken Earliest First
              </MenuItem>
              <MenuItem
                ref="taken2"
                eventKey="taken2"
                onClick={() => this.updateSortField('taken', false)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-calendar-o" /> Date Taken Most Recent First
              </MenuItem>

              <MenuItem divider />

              <MenuItem
                ref="views1"
                eventKey="views1"
                onClick={() => this.updateSortField('views', true)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-eye" /> Number of Views from Low To High
              </MenuItem>
              <MenuItem
                ref="views2"
                eventKey="views2"
                onClick={() => this.updateSortField('views', false)}
                onSelect={this.onChangeNavName}
              >
                <i className="fa fa-eye" /> Number of Views from High To Low
              </MenuItem>
            </NavDropdown>
          </Nav>

          <Navbar.Form pullRight>
            <FormGroup>
              <FormControl
                type="text"
                placeholder="Filter by Title/Id..."
                value={this.props.filterText}
                onChange={this.updateFilterText}
              />
              <Button onClick={this.clearText} className="clear-field">
                <i className="fa fa-times" />
              </Button>
            </FormGroup>{' '}
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
