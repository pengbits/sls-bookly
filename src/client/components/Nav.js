import React, { Component } from "react";
import {Link} from "react-router-dom";

export default () => (<nav>
  <Link to="/authors">Authors</Link>{' '}|{' '}
  <Link to="/books">Books</Link>
</nav>)