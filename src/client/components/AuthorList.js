import React, { Component } from "react";
import {Link} from "react-router-dom";

class  AuthorList extends Component {
  componentDidMount() {
    this.props.getAuthors()
  }
  
  render() {
    return (<div>
      <h2>Authors</h2>
      {this.props.loading ? 
        this.renderLoading() : this.renderList()
      }
    </div>)
  }
  
  renderLoading(){
    return <p>loading...</p>
  }
  
  renderList(){
    const {list} = this.props;
    return (
      <ul className='list author-list'>
        {list.map((author,i) => {
          return <li key={i}>
            <Link to={`/authors/${author._id}`}>
              {author.name}
            </Link>
          </li>
        })}
      </ul>
    )
  }
}

export default  AuthorList;

