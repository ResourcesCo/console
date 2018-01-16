import dynamic from 'next/dynamic'
//const App = dynamic(import('../components/app'), {ssr: false})
import AppWrapper from '../components/app-wrapper'

export default () => (
  <AppWrapper />
)