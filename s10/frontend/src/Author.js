import React, { Component } from 'react'

class Author extends Component {
  constructor(props){
    super(props)
    this.state = {
      authorName : '',
      authorEmail : '',
      isEditing : false
    }
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
  }
  componentDidMount(){
    this.setState({
      authorName : this.props.author.name,
      authorEmail: this.props.author.email
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      isEditing : false,
      authorName : nextProps.author.name,
      authorEmail: nextProps.author.email
    })
  }
  render() {
    if (!this.state.isEditing){
      return (
        <div>
          {this.props.author.name} 
          _can be contacted at_
          {this.props.author.email}
          <input type="button" value="edit" onClick={() => this.setState({isEditing : true})}/>
          <input type="button" value="delete" onClick={() => this.props.onDelete(this.props.author.id)} />
          <input type="button" value="details" onClick={() => this.props.onSelect(this.props.author.id)} />
        </div>
      )
    }
    else{
      return (
        <div>
            <input type="text" name="authorName" onChange={this.handleChange} value={this.state.authorName}/>
            <input type="text" name="authorEmail" onChange={this.handleChange} value={this.state.authorEmail}/>
            <input type="button" value="cancel" onClick={() => this.setState({isEditing : false})}/>
            <input type="button" value="save" onClick={() => this.props.onSave(this.props.author.id, {name : this.state.authorName, email : this.state.authorEmail})}/>
        </div>  
      )
    }
  }
}

export default Author