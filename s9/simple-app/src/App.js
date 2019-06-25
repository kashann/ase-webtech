import React, { Component } from 'react'
import './App.css'
import KittenList from './KittenList'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      kittens : [{name : 'tim', color : 'black'},
        {name : 'tom', color : 'yellow'}]
    }
    this.addKitten = (kitten) => {
      let kittenState = this.state.kittens
      kittenState.push(kitten)
      this.setState({
        kittens : kittenState
      })
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <KittenList list={this.state.kittens} addHandler={this.addKitten} />
      </div>
    )
  }
}

export default App;
