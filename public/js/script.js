TodoModel = can.Model.extend({
  findAll: 'GET /todo-api',
  create:  'POST /todo-api',
  update: 'POST /todo-api',
  destroy: 'DELETE /todo-api/{id}'
},{});
can.Component.extend({
    tag: 'todo-view',
    //get the template from stache written in HTML.
    template: can.view('todo-view-stache'),
    viewModel: {
        todoList: new can.List(),
        newTodo: '',
        //get all the list of todos stored in server.
        init: function() {
          TodoModel.findAll().then(this.proxy(function(data) {
            data.each(this.proxy(function(item){
              var todo = new TodoModel(item);
              todo.attr('status', +todo.status ? 1 : 0);
              this.todoList.push(todo);
            }));
          }));
        },
        //send updates to the server.
        changeStatus: function(todo) {
          todo.attr('status', todo.status ? 0 : 1);
          todo.save().then(function(data){
            data.attr('status', +data.status ? 1 : 0)
            console.log(data);
          });
        },
        //send newly added to server and update the local list.
        addTodo: function() {
          if(this.newTodo) {
            TodoModel.create({todoItem:this.newTodo}).then(this.proxy(function(data){
              var todo = new TodoModel(data);
              console.log(todo);
              this.todoList.push(todo);
              this.attr('newTodo','');
            }));
          }
        },
        //delete the todo from the list and update it to server.
        deleteTodo: function(todo) {
          todo.destroy().then(this.proxy(function(data){
            this.todoList.each(this.proxy(function(ele, index){
              if(todo.id === ele.id) {
                  this.todoList.splice(index, 1);
                  return false;
              }
            }));
            console.log(data);
          }));
        }
    }
});

$("body").append(can.view("app", {}));
