import { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class RequestList extends Component {
  render() {
    const requests = this.props.data.requests ? this.props.data.requests : []
    return (
      <div className="list">
        {
          requests.map(({id}) => (<div className="item" key={id}>
            {id}
          </div>))
        }

        <style jsx>{`
          .item {
            color: red;
          }
        `}</style>
      </div>
    )
  }
}

const ListRequests = gql`
  query {
    requests {
      id
    }
  }
`

const RequestListWithData = graphql(ListRequests)(RequestList)

export default RequestListWithData