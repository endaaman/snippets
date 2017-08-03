import Vue from 'vue'
import Vuex from 'vuex'

const DONE = 'DONE'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [
      { id: 1, text: 'あかり', done: true },
      { id: 2, text: 'ちなる', done: false },
      { id: 3, text: 'きょうこ', done: false },
      { id: 4, text: 'ゆい', done: false },
    ],
  },
  mutations: {
    DONE (state, { id }) {
      t = state.todos.find(item => item.id === id)
      if (t) {
        t.done = true
      }
    }
  },
  actions: {
    done ({ commit }, id) {
      commit(DONE, { id: 4 })
    }
  },
  getters: {
    doneTodos: state => {
      return state.items.filter(todo => todo.done)
    },
    doneCount: state => {
      return state.items.filter(todo => todo.done).length
    },
  },
})
