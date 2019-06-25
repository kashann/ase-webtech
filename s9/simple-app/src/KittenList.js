import React, {Component} from 'react'

class KittenList extends Component{
  constructor(props){
    super(props)
    this.state = {
      kittenName : '',
      kittenColor : ''
    }
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
  }
  render(){
    return (<div>
      I am a kitten list
      {this.props.list.map((k) => 
      <div>
        {k.name} is {k.color}
      </div>)}
      <form>
        Name : <input type="text" name="kittenName" onChange={this.handleChange}/>
        Color : <input type="text" name="kittenColor" onChange={this.handleChange}/>
        <input type="button" value="add" onClick={() => this.props.addHandler({name : this.state.kittenName, color : this.state.kittenColor})} />
      </form>
    </div>)
  }
}

export default KittenList