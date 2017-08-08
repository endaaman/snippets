import { mapState, mapGetters, mapActions } from 'vuex'
import template from './index.jade'

export default {
  render: template,
  data() {
    return {
      selectedTodoIds: [],
    }
  },
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
      this.$store.dispatch('todos/done', this.selectedTodoIds)
    },
    undone() {
      this.$store.dispatch('todos/undone', this.selectedTodoIds)
    },
    onSelected(selectedItems) {
      this.selectedTodoIds = selectedItems.map(todo => todo.id)
    }
  }
}
