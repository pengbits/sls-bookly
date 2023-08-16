import { connect } from 'react-redux'
import { getAuthors } from '../redux/authors'
import AuthorList from '../components/AuthorList'

const mapStateToProps = (state, ownProps) => {
  const {
    loading,
    list
  } = state.authors || {}
  return {
    loading,
    list
  }
}

const mapDispatchToProps = {
  getAuthors
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorList)

