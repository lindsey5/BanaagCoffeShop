import { Toaster } from 'sileo'
import AppRouter from './routes/AppRouter'

function App() {

  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  )
}

export default App
