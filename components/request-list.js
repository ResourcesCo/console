import { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import ObjectID from 'bson-objectid'

class RequestList extends Component {
  get requests() {
    const rawData = this.props.data.requests ? this.props.data.requests : []
    const requests = rawData.map(({id, data}) => {
      return {
        id,
        data: JSON.parse(data),
        created: ObjectID(id).getTimestamp()
      }
    }).reverse()
    const request = this.props.request
    if (request && request.id && !requests.map(r => r.id).includes(request.id)) {
      requests.unshift({
        id: request.id,
        created: ObjectID(request.id).getTimestamp()
      })
    }
    return requests
  }

  render() {
    
    return (
      <div className="list">
        {
          this.requests.map(({id, created}) => (
            <div onClick={() => this.props.onChange({requestId: id})} className="item" key={id}>
              {`${created}`}
            </div>
          ))
        }

        <style jsx>{`
          .list {
            cursor: pointer;
          }
          .item {
            color: white;
          }
        `}</style>
      </div>
    )
  }
}

const ListRequests = gql`
  query {
    requests {
      id,
      data
    }
  }
`

const RequestListWithData = graphql(ListRequests)(RequestList)

export default RequestListWithData