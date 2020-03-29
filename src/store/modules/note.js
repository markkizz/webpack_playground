import { createStore } from '../StoreCreator'
import Resource from '../Resource'

const note = {
  state: {
    noteLists: []
  },
  actions: {},
  mutations: {},
  getters: {},
}

// const resource = new Resource('http://localhost:5000').addAction({
//   action: 'getKeypairs',
//   method: 'get',
//   property: 'keypairList',
//   pathFn: () => '/v2.1/keypairs',
// })

export default createStore(resource)
