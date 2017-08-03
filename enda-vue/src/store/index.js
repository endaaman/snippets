import Vue from 'vue'
import Vuex from 'vuex'
import todos from './todos'

const INCREMENT = "INCREMENT"

Vue.use(Vuex)

console.log(todos)

export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    INCREMENT (state, { amount }) {
      state.count = state.count + amount
    }
  },
  actions: {
    increment ({ commit }, amount) {
      commit(INCREMENT, { amount })
    }
  },
  modules: {
    todos,
  },
})
