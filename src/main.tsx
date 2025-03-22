import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/index.tsx'
import Account from './components/Account.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Account>
        <App />
      </Account>
    </Provider>
  </StrictMode>,
)
