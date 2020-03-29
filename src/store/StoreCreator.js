class StoreCreator {
  constructor(resource) {
    this.resource = resource
  }

  createStore() {
    return {
      state: this.resource.state,
      mutations: this.createMutations(),
      actions: this.createActions(),
    }
  }

  createMutations() {
    const mutation = {
      // [mutationType](payload){
      //   // doSomeThing
      // }
    }
    Object.keys(this.resource.action)
  }
  // { commitString }
  get context() {
    const state = this.state
    const commit = function(mutationType) {

    }
    // commit(mutationType, payload)
  }
}

// SomeAction(context, payload) context = { commit: fn, dispatch: fn, state: store.state }


export function createStore(resource) {
  return new StoreCreator(resource).store
}

/*
{ state:  
    { pending: { keypairList: false }, 
     error: { keypairList: null }, 
     keypairList: null }, 
  mutations:  
   { GET_KEYPAIRS: [λ], 
     GET_KEYPAIRS_SUCCEEDED: [λ], 
     GET_KEYPAIRS_FAILED: [λ] }, 
  actions: { getKeypairs: [λ] } } 
*/


class StoreCreatorExample {
  constructor(resource) {
    this.successSuffix = 'SUCCEEDED'
    this.failureSuffix = 'FAILED'
    this.resource = resource
    this.store = this.createStore()
  }

  createState() {
    const state = Object.assign(
      {
        pending: {},
        error: {},
      },
      this.resource.state,
    )
    const actions = this.resource.actions
    Object.keys(actions).forEach(action => {
      const property = actions[action].property
      state[property] = null
      state['pending'][property] = false
      state['error'][property] = null
    })
    return state
  }

  createGetter() {
    return {}
  }

  createMutations() {
    const mutations = {}
    const actions = this.resource.actions
    Object.keys(actions).forEach(action => {
      const {
        property,
        commitString,
        mutationSuccessFn,
        mutationFailureFn,
      } = actions[action]
      mutations[`${commitString}`] = state => {
        state.pending[property] = true
        state.error[property] = null
      }
      mutations[`${commitString}_${this.successSuffix}`] = (state, payload) => {
        state.pending[property] = false
        state.error[property] = null
        if (mutationSuccessFn) {
          mutationSuccessFn(state, payload)
        } else {
          state[property] = payload.data
        }
      }
      mutations[`${commitString}_${this.failureSuffix}`] = (state, payload) => {
        state.pending[property] = false
        state.error[property] = payload
        if (mutationFailureFn) {
          mutationFailureFn(state, payload)
        } else {
          state[property] = null
        }
      }
    })
    return mutations
  }

  createActions() {
    const storeActions = {}
    const actions = this.resource.actions
    Object.keys(actions).forEach(action => {
      const { dispatchString, commitString, requestFn } = actions[action]
      storeActions[dispatchString] = (
        { commit },
        { params = {}, data = {}, options = {} },
      ) =>
        __awaiter(this, void 0, void 0, function*() {
          commit(commitString)
          return requestFn(params, data, options).then(
            response => {
              commit(`${commitString}_${this.successSuffix}`, response)
              return Promise.resolve(response)
            },
            error => {
              commit(`${commitString}_${this.failureSuffix}`, error)
              return Promise.reject(error)
            },
          )
        })
    })
    return storeActions
  }

  createStore() {
    return {
      state: this.createState(),
      mutations: this.createMutations(),
      actions: this.createActions(),
    }
  }
}

var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }

      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }

