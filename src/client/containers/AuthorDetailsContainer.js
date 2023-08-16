import { connect } from 'react-redux'
import { getAuthor } from '../redux/authors'
import AuthorDetails from '../components/AuthorDetails'

const mapStateToProps = (state, ownProps) => {


  const {
    loading,
    details,
  } = state.authors || {}
  return {
    loading,
    details
  }
}

const mapDispatchToProps = {
  getAuthor
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorDetails)

