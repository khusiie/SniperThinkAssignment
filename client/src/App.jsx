import React from 'react'
import { ThemeProvider } from "next-themes"
import StrategyFlow from './components/StrategyFlow'
import FileUploadView from './components/FileUploadView'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="App" style={{ paddingBottom: '100px' }}>
        <main className="app-main-container">
          <StrategyFlow />

          <div className="upload-view-wrapper" style={{ marginTop: '40px' }}>
            <FileUploadView />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
