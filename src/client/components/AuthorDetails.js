import React, { Component } from "react";
import {Link} from 'react-router-dom'

class  AuthorDetails extends Component {
  componentDidMount() {
    const {id, getAuthor} = this.props
    getAuthor({id})
  }
  
  render() {
    return (<div>
      <h2>Author Details</h2>
      {this.props.loading ? 
        this.renderLoading() : this.renderDetails()
      }
    </div>)
  }
  
  renderLoading(){
    return <p>loading...</p>
  }
  
  renderDetails() {
    const {
      name,
      about
    } = this.props.details
    
    return (<div>
      <p>
        <b>Name</b><br />
        {name}
      </p>
      <p>
        <b>About</b><br />
        <span dangerouslySetInnerHTML={{__html: about}} />
      </p>
      <p>
        <Link to='/authors'>Back</Link>
      </p>
    </div>)
  }
}

export default  AuthorDetails;

