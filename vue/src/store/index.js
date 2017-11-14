import Vue from 'vue'
import Vuex from 'vuex'
import todos from './todos'

const INCREMENT = "INCREMENT"

const store = {
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
}

export function createStore(initialState) {
  return new Vuex.Store(store)
}
