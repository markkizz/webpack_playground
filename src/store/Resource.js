import axios from 'axios'

class IntialResource {
  constructor(options = {}) {
    this.actions = {}
    this.state = options.state || {}
  }
  /**
   *
   * @param {action, commit} options
   */
  addAction(options) {
    this.action = {
      action: options.action,
      commitString: options.commitString
    }
    return this
  }
}

// Resource { HTTPMethod: Set { 'get', 'delete', 'head', 'post', 'put', 'patch' }, 
//   actions:  
//    { getKeypairs:  
//       { requestFn: [λ: requestFn], 
//         property: 'keypairList', 
//         mutationSuccessFn: undefined, 
//         mutationFailureFn: undefined, 
//         dispatchString: 'getKeypairs', 
//         commitString: 'GET_KEYPAIRS' }, 
//      getKey:  
//       { requestFn: [λ: requestFn], 
//         property: 'keyList', 
//         mutationSuccessFn: undefined, 
//         mutationFailureFn: undefined, 
//         dispatchString: 'getKey', 
//         commitString: 'GET_KEY' } }, 
//   baseURL: 'http://localhost:5000', 
//   state: {}, 
//   queryParams: false } 





class ResourceExample {
  constructor(baseURL, options = {}) {
    this.HTTPMethod = new Set(['get', 'delete', 'head', 'post', 'put', 'patch'])
    this.actions = {}
    this.baseURL = baseURL
    this.state = options.state || {}
    this.axios = options.axios || axios
    this.queryParams = options.queryParams || false
  }

  addAction(options) {
    options.method = options.method || 'get'
    options.requestConfig = options.requestConfig || {}
    if (!options.property) {
      throw new Error("'property' field must be set.")
    }
    if (this.HTTPMethod.has(options.method) === false) {
      const methods = [...this.HTTPMethod.values()].join(', ')
      throw new Error(
        `Illegal HTTP method set. Following methods are allowed: ${methods}`,
      )
    }
    const completePathFn = params => this.baseURL + options.pathFn(params)
    this.actions[options.action] = {
      requestFn: (params = {}, data = {}, option = {}) => {
        let queryParams
        // use action specific queryParams if set
        if (options.queryParams !== undefined) {
          queryParams = options.queryParams
          // otherwise use Resource-wide queryParams
        } else {
          queryParams = this.queryParams
        }
        const requestConfig = Object.assign(option, options.requestConfig)
        const paramsSerializer =
          options.requestConfig['paramsSerializer'] !== undefined ||
          this.axios['defaults']['paramsSerializer'] !== undefined
        if (queryParams || paramsSerializer) {
          requestConfig['params'] = params
        }
        if (['post', 'put', 'patch'].indexOf(options.method) > -1) {
          localStorage['callAPI'] = 2
          return this.axios[options.method](
            completePathFn(params),
            data,
            requestConfig,
          )
        } else if (['delete'].indexOf(options.method) > -1) {
          localStorage['callAPI'] = 2
          return this.axios[options.method](
            completePathFn(params),
            { data },
            requestConfig,
          )
        } else {
          return this.axios[options.method](
            completePathFn(params),
            requestConfig,
          )
        }
      },
      property: options.property,
      mutationSuccessFn: options.mutationSuccessFn,
      mutationFailureFn: options.mutationFailureFn,
      dispatchString: this.getDispatchString(options.action),
      commitString: this.getCommitString(options.action),
    }
    return this
  }

  getDispatchString(action) {
    return action
  }

  getCommitString(action) {
    const capitalizedAction = action.replace(/([A-Z])/g, '_$1').toUpperCase()
    return capitalizedAction
  }
}
