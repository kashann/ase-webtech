import React, { Component } from 'react'

class AuthorForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      authorName : '',
      authorEmail : ''
    }
    this.handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
  }
  render() {
    return (
      <div>
        <h3>Add an author</h3>
        <form>
          Name : <input type="text" name="authorName" onChange={this.handleChange}/>
          Email : <input type="text" name="authorEmail" onChange={this.handleChange}/>
          <input type="button" value="add" onClick={() => this.props.onAdd({name : this.state.authorName, email:this.state.authorEmail})}/>
        </form>
      </div>
    )
  }
}

export default AuthorForm