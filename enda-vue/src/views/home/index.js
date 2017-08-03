import { mapState, mapGetters, mapActions } from 'vuex'
import template from './index.jade'

export default {
  render: template,
  computed: {
    ...mapState({
      count: state => state.count,
      todos: state => state.todos
    }),
    ...mapGetters([
      'todos/doneCount',
    ]),
  },
  methods: {
    ...mapActions([
      'increment',
    ]),
    done() {
      this.$store.dispatch('done')
    }
  }
}
