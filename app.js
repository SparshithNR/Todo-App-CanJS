var express = require('express');

var app = express();
var cors = require('cors');
var bodyParser =  require('body-parser');
var counter = 4;

var todoList = [
	{
		id: '1',
		todoItem: 'b',
		status: 1
	},
	{
		id: '2',
		todoItem: 'd',
		status: 1	
	},
	{
		id: '3',
		todoItem: 'f',
		status: 1
	},
	{
		id: '4',
		todoItem: 'h',
		status: 0
	}
];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
	console.log(`${req.method} request for '${JSON.stringify(req.body)}'`);
	next();
});

app.use(express.static('./public'));

//Intial send all the todos stored in server.
app.get('/todo-api', function (req, res) {
	res.json(todoList);
});

//Handle adding new todo or update of todo.
app.post('/todo-api', function(req,res) {
	var todo;
	if(req.body.id) {
		todoList.forEach(function(ele) {
			if(ele.id === req.body.id) {
				ele.status = req.body.status;
				todo = ele;
				return false;
			}
		});
	} else {
		var id = counter+1;
		todo = {
			id : id.toString(),
			todoItem: req.body.todoItem,
			status: 1
		}
		todoList.push(todo);
	}
	console.log(todo);
	res.json(todo);
});

//Handle delete request from client. Match current list using id. send the deleted element.
app.delete('/todo-api/:id', function(req, res) {
	var todo;
	todoList  = todoList.filter(function(ele) {
		if(ele.id.toLowerCase() === req.params.id.toLowerCase()) {
			todo = ele;
			return false;
		}
		return true;
	});
	res.json(todo);
});
app.use(cors());
app.listen(3000);

console.log('express running in port 3000:');

module.exports = app;

