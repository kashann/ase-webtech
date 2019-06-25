import axios from 'axios'

const SERVER = 'https://webtech-kashann.c9users.io'

class AuthorStore{
  constructor(ee){
    this.emitter = ee
    this.content = []
    this.selected = null
  }
  getAll(){
    axios(SERVER + '/authors')
      .then((response) => {
        this.content = response.data
        this.emitter.emit('AUTHOR_LOAD')
      })
      .catch((error) => console.warn(error))
  }
  addOne(author){
    axios.post(SERVER + '/authors', author)
      .then(() => this.getAll())
      .catch((error) => console.warn(error))
  }
  deleteOne(id){
    axios.delete(SERVER + '/authors/' + id)
      .then(() => this.getAll())
      .catch((error) => console.warn(error))
  }
  saveOne(id, author){
    axios.put(SERVER + '/authors/' + id, author)
      .then(() => this.getAll())
      .catch((error) => console.warn(error))
  }
  getOne(id){
    axios(SERVER + '/authors/' + id)
      .then((response) => {
        this.selected = response.data
        this.emitter.emit('SINGLE_AUTHOR_LOAD')
      })
      .catch((error) => console.warn(error))
  }
}

export default AuthorStore