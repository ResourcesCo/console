import Link from 'next/link'
import Head from '../components/head'
import Rest from '../components/rest-hint-of-gray'

export default () => (
  <div>
    <Head title="Resources" />

    <div className="center">
      <Rest />
    </div>

    <style jsx>{`
      .center {
        max-width: 500px;
        margin: 10px auto;
      }
    `}</style>
  </div>
)
