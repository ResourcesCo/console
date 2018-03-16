import dynamic from 'next/dynamic'
//const App = dynamic(import('../components/app'), {ssr: false})
import App from '../components/app-wrapper'

export default ({url}) => {
  return (
    <App requestId={url.query.id} />
  )
}