import React, { Component } from 'react'
import './App.css'
import AuthorList from './AuthorList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to our message app</h1>
        </header>
        <AuthorList />
      </div>
    )
  }
}

export default App