import React, { Component } from 'react'
import './App.css'
import AuthorStore from './AuthorStore'
import {EventEmitter} from 'fbemitter'
import Author from './Author'
import AuthorForm from './AuthorForm'

let ee = new EventEmitter()
let store = new AuthorStore(ee)

function addAuthor(author){
  store.addOne(author)
}

function deleteAuthor(id){
  store.deleteOne(id)
}

function saveAuthor(id, author){
  store.saveOne(id, author)
}

class AuthorList extends Component {
  constructor(props){
    super(props)
    this.state = {
      authors : [],
      detailsFor : -1,
      selected : null
    }
    this.selectAuthor = (id) => {
      store.getOne(id)
      ee.addListener('SINGLE_AUTHOR_LOAD', () => {
        this.setState({
          detailsFor : store.selected.id,
          selected : store.selected
        })
      })
    }
  }
  componentDidMount(){
    store.getAll()
    ee.addListener('AUTHOR_LOAD', () => {
      this.setState({
        authors : store.content
      })
    })
  }
  render() {
    if (this.state.detailsFor === -1){
      return (
        <div>
          <div>
          List of authors
          {this.state.authors.map((a) => 
            <Author author={a} key={a.id} onDelete={deleteAuthor} onSave={saveAuthor} onSelect={this.selectAuthor} />
          )}
          </div>
          <div>
            <AuthorForm onAdd={addAuthor}/>
          </div>
        </div>
      )      
    }
    else{
      return (
        <div>
          i am {this.state.selected.name} and can be contacted at {this.state.selected.email}
          <input type="button" value="cancel" onClick={() => this.setState({detailsFor : -1})}/>
        </div>  
      )
    }
  }
}

export default AuthorList