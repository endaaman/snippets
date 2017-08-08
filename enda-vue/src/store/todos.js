import Vue from 'vue'
import Vuex from 'vuex'

const MARK = 'MARK'

export default {
  namespaced: true,
  state: {
    items: [
      { id: 1, text: 'あかり', done: true },
      { id: 2, text: 'ちなる', done: false },
      { id: 3, text: 'きょうこ', done: false },
      { id: 4, text: 'ゆい', done: false },
    ],
  },
  mutations: {
    MARK (state, { ids, done }) {
      state.items
        .filter(item => ids.includes(item.id))
        .forEach((item) => {
          item.done = !!done
        })
    }
  },
  actions: {
    done({ commit }, ids) {
      commit(MARK, { ids, done: true })
    },
    undone({ commit }, ids) {
      commit(MARK, { ids, done: false })
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
}
