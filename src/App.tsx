import {BlockchainStore, StoreProvider} from './store'
import {Home} from './home'

const store = new BlockchainStore()

export default function App() {
  return (
    <StoreProvider store={store}>
      <Home />
    </StoreProvider>
  )
}
