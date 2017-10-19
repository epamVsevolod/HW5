$(function () {
	// Event when document just loaded which tells JS to render widget with localstorage data
	// An array which contains new task objects
	var tasks = (window.localStorage['tasker'] === undefined ? [] : JSON.parse(window.localStorage['tasker']));

	// Variable which allows ot create an id for new document task object
	var count = (tasks.length === 0 ? 0 : tasks[0].number);

	// Days/months arrays
	var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	var months = ['Janary', 'Febrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// Bootstrap container
	var container = document.createElement('div');
	container.className = 'container';
	document.body.appendChild(container);

	// Bootstrap row
	var container__row = document.createElement('div');
	container__row.className = 'row justify-content-center';
	container.appendChild(container__row);

	// Bootstrap column
	var container__col = document.createElement('div');
	container__col.className = 'col-md-auto';
	container__col.setAttribute('style', 'position: relative; display: block; width: 500px; padding: 0;');
	container__row.appendChild(container__col);

	// Head container - buttons/search
	var container__head = document.createElement('div');
	container__head.className = 'row';
	container__head.setAttribute('style', 'padding: 0; margin: 0; position: relative; display: block; z-index: 100;');
	container__col.appendChild(container__head);

	// Body container - field to render elements
	var container__body = document.createElement('div');
	container__body.className = 'row justify-content-between';
	container__body.setAttribute('style', 'height: 100%; margin: 0;');
	container__col.appendChild(container__body);

	// Button 'Todo - render list of tasks with current one'
	var button__todo = document.createElement('button');
	button__todo.innerHTML = 'ToDo!';
	button__todo.className = 'col-md-2 btn btn-secondary btn-sm';
	container__head.appendChild(button__todo);
	button__todo.onclick = showTodo;

	// Opens calendar
	var button__calendar = document.createElement('button');
	button__calendar.className = 'col-md-2 btn btn-secondary btn-sm';
	button__calendar.innerHTML = 'Month';
	container__head.appendChild(button__calendar);
	button__calendar.onclick = function (event) {
		hideTodo();
		calendar.style.display = 'table';
		calendar__row.style.display = 'block';
		frame__text.style.display = 'none';
	};

	// Create new task
	var button__add = document.createElement('button');
	button__add.innerHTML = '+';
	button__add.className = 'col-md-1 btn btn-success btn-sm';
	container__head.appendChild(button__add);
	button__add.onclick = function(event) {
		hideTodo();
		newTask.style.display = 'block';
		calendar__row.style.display = 'none';
	};

	// Delete chosen tasks
	var button__delete = document.createElement('button');
	button__delete.className = 'col-md-2 btn btn-dark btn-sm';
	button__delete.innerHTML = 'Delete';
	container__head.appendChild(button__delete);
	button__delete.onclick = deleteTasks;

	// Searching by theme key words !!not working yet
	var search = document.createElement('input');
	search.className = 'col-md-3 form-control-sm';
	container__head.appendChild(search);

	// Click if you know what you wanna know
	var button__search = document.createElement('button');
	button__search.className = 'col-md-2 btn btn-info btn-sm';
	container__head.appendChild(button__search);
	button__search.innerHTML = 'finD!';

	// toDo page left side
	var container__left = document.createElement('div');
	container__left.className = 'col-md-7 container__left';
	container__left.setAttribute('style', 'height: 400px; padding: 0; margin: 0; display: table;');
	container__body.appendChild(container__left);

	// toDo page right side
	var container__right = document.createElement('div');
	container__right.className = 'col container__right';
	container__right.setAttribute('style', 'height: 400px; padding: 0; margin: 0; overflow: scroll;');
	container__body.appendChild(container__right);

	// Add new task page
	var newTask = document.createElement('form');
	newTask.className = 'col-md-auto task container';
	newTask.name = 'formToData';
	newTask.setAttribute('style', 'height: 400px; display: none; width: 100%;');
	container__body.appendChild(newTask);
	newTask.addEventListener('click', function(event) {
		event.preventDefault();
	});

	// Theme row
	var themeRow = document.createElement('div');
	themeRow.className = 'row';
	themeRow.style.padding = '15px 15px 0 0';
	newTask.appendChild(themeRow);

	var themeName = document.createElement('p');
	themeName.innerHTML = 'Theme:';
	themeName.className = 'col-md-3';
	themeRow.appendChild(themeName);

	var theme = document.createElement('input');
	theme.setAttribute('placeholder', 'Задача');
	theme.name = 'taskName';
	theme.className = 'col';
	themeRow.appendChild(theme);
	theme.onclick = function(event) {
		frame__text.style.display = 'none';
	};

	// Description texarea row
	var descriptionRow = document.createElement('div');
	descriptionRow.className = 'row';
	descriptionRow.style.padding = '5px 15px 0 0';
	newTask.appendChild(descriptionRow);

	var descriptionName = document.createElement('p');
	descriptionName.innerHTML = 'Description';
	descriptionName.className = 'col-md-3';
	descriptionName.setAttribute('style', 'display: block; float: left; clear: left;');
	descriptionRow.appendChild(descriptionName);

	var description = document.createElement('textarea');
	description.setAttribute('placeholder', 'Описание');
	description.setAttribute('type', 'text');
	description.setAttribute('rows', '5');
	description.className = 'col';
	description.name = 'taskDesc';
	description.setAttribute('style', 'width: 60%; display: block;');
	descriptionRow.appendChild(description);
	description.onclick = function(event) {
		frame__text.style.display = 'none';
	};

	// Deadline row
	var deadlineRow = document.createElement('div');
	deadlineRow.className = 'row';
	deadlineRow.style.padding = '5px 15px 5px 0';
	newTask.appendChild(deadlineRow);

	var deadlineName = document.createElement('p');
	deadlineName.innerHTML = 'Deadline';
	deadlineName.className = 'col-md-3';
	deadlineName.setAttribute('style', 'width: 20%; ');
	deadlineRow.appendChild(deadlineName);

	var deadline = document.createElement('input');
	deadline.name = 'taskDead';
	deadline.className = 'col-md-auto';
	deadline.setAttribute('type', 'date');
	deadline.style.width = '60%';
	// deadline.setAttribute('onkeypress', 'return false');
	deadlineRow.appendChild(deadline);
	deadline.onclick = function (event) {
		frame__text.style.display = (frame__text.style.display == 'none') ? 'block' : 'none';
	};

	// Submit form button
	var submitForm = document.createElement('button');
	submitForm.setAttribute('type', 'button');
	submitForm.className = 'btn btn-default btn-light';
	submitForm.setAttribute('style', 'margin-left: 5px;');
	submitForm.name = 'submitData';
	submitForm.innerHTML = 'Add+';
	deadlineRow.appendChild(submitForm);
	submitForm.onclick = createTask;

	document.body.onload = function (event) {if (tasks !== []) {
		render();
		createID();
	}};

	function render() {
	for (var i = 0; i < tasks.length; i++) {
		try{
			if (document.getElementsByClassName('container__right')[0].children[i].id === undefined) {};
		} catch(TypeError) {
			var newtask__wrapper = document.createElement('div');
			newtask__wrapper.id = i;
			newtask__wrapper.setAttribute('style', 'border-bottom: 1px solid #e4edbb; display: flex; flex-wrap: nowrap; justify-content: space-around;');

			var newtask__radio = document.createElement('input');
			newtask__radio.setAttribute('type', 'checkbox');
			newtask__radio.className = 'newtask__radio';
			newtask__radio.setAttribute('style', 'display: block; flex-direction: column; align-self: center;');
			newtask__radio.addEventListener('click', function(event) {
				var find = event.target.closest('div').children[1];
				find.style.textDecoration = 'none';
				if (event.target.checked === true) {
					find.style.textDecoration === 'none' ? find.style.textDecoration = 'line-through' : find.style.textDecoration = 'none';
				}
			});
			newtask__wrapper.appendChild(newtask__radio)
			var newtask__text = document.createElement('p');
			newtask__wrapper.appendChild(newtask__text); 
			newtask__text.setAttribute('style', 'display: block; flex-direction: column; align-self: center; line-height: 1.5rem; margin: 0; width: 80%;');
			newtask__text.innerHTML = tasks[i].theme.slice(0,20) + '<br/>' + tasks[i].description.slice(0,55);
			newtask__text.addEventListener('click', function(event) {
				for (var i = 0; i < tasks.length; i++) {
						if (tasks[i].number == event.target.closest('div').id) {
							var deadTime = new Date(tasks[i].deadline);
							container__left.innerHTML = '<div class="tableCell__left" style="display: table-cell; vertical-align: middle;">' + '<h5 style="text-align: center;">' + tasks[i].theme + '</h5>' 
							+ '<div style="overflow: hidden; max-width: 280px; display: block; text-align: justify; padding: 0 15px 0 5px;">' + tasks[i].description + '<div>'
							+ '<p style="color: #682A0A; margin: 10px; text-align: right;">' + deadTime.getDate() + ' ' + months[deadTime.getMonth()]+ ' ' +deadTime.getFullYear()+'</p>';
						}
					};
				});
			container__right.appendChild(newtask__wrapper);
		}
	}
	}
	// Calendar page/ calendar row
	var calendar__row = document.createElement('div');
	calendar__row.className = 'col calendar__row';
	calendar__row.setAttribute('style', 'text-align: center; display: none;')
	container__body.appendChild(calendar__row);

	// Calendar
	var calendar = document.createElement('table');
	calendar.className = 'calendar';
	calendar.setAttribute('style', 'display: none; width: 100%; height: 100%; margin-top: 15px;');
	calendar__row.appendChild(calendar);
	calendar.id = 'calendar';

	// Next/prev butrrons
	var calendarPrev = '<tr style="color: #682A0A;"><td id="prev" style="color: #FD9909; text-align: center;" colspan="2" ><</td><td colspan="3">';
	var calendarNext = '</td><td id="next" style="color: #FD9909; text-align: center;" colspan="2" style="display:block;">></td><tr>';

	function hideTodo() {
		container__left.style.display = 'none';
		container__right.style.display = 'none';
		newTask.style.display = 'none';
		frame__text.style.display = 'none';
	}

	function showTodo() {
		if (tasks !== []) {
			render();
			createID();
		}
		container__left.style.display = 'table';
		container__right.style.display = 'inline-block';
		newTask.style.display = 'none';
		calendar__row.style.display = 'none';
		frame__text.style.display = 'none';
	}

	function createTask(event) {
		var task = {};
		task.theme = formToData.elements.taskName.value;
		task.description = formToData.elements.taskDesc.value;
		task.deadline = deadline.value;
		task.number = count;
		tasks.unshift(task);
		var toStore = JSON.stringify(tasks);
		window.localStorage.setItem('tasker', toStore);
		render();
		createID();
	};

	function calendarPicker(year, month) {
		var calendarMonth =  new Date(year,month+1,0).getDate();
		var calendarDate = new Date(year,month,calendarMonth);
		var monthLastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarMonth).getDate();
		var weekdayLastMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), monthLastDay).getDay();
		var weekdayFirstMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
		var calendarRow = calendarPrev + months[calendarDate.getMonth()] + calendarDate.getFullYear() + calendarNext;
		// Создаем дни недели
		for (var i = 0; i < days.length; i++) {
			calendarRow += '<td>' + days[i];
			if (i === days.length -1) calendarRow += '<tr>'; 
		}
		// Создаем пустые клеточки
		if (weekdayFirstMonth !== 0) {
			var emptyData = document.createElement('td');
			for (var i = 1; i < weekdayFirstMonth; i++) calendarRow += '<td>';
		} else {
			for (var i = 0; i < 6; i++) calendarRow += '<td>';
		}

		// Дни месяца
		for(var  i = 1; i <= monthLastDay; i++) {
			if (i == new Date().getDate() && calendarDate.getFullYear() == new Date().getFullYear() && calendarDate.getMonth() == new Date().getMonth()) {
				calendarRow += '<td id="today">' + i;
			}else{
				calendarRow += '<td>' + i;
			}
			if (new Date(calendarDate.getFullYear(),calendarDate.getMonth(),i).getDay() == 0) {
				calendarRow += '<tr>';
			}
		}
		// Пустые клеточки после денй месяца
		if (weekdayLastMonth != 0) {
			for (var i = weekdayLastMonth; i < 7; i++) {
				calendarRow += '<tr>';
			}
		}

		var tableBorder = calendar.querySelectorAll('tr > td');
		for (var i = 0; i < tableBorder.length; i++) {
			if (i < 10) {
				tableBorder[i].setAttribute('style', 'font-size: 1.2rem; font-weight: 600;')
				continue;
			}
			if (tableBorder[i].innerHTML === '') {
				continue;
			}
			tableBorder[i].setAttribute('style', 'vertical-align: middle; font-size: 1rem; height: 40px; min-width: 40px;');
		}
		for(var  i = monthLastDay; i < 7; i++) calendarRow += '<td>&nbsp;';
		calendar.innerHTML = calendarRow;
		var calendarMonth =  new Date(year,month+1,0).getDate();
		var calendarDate = new Date(year,month,calendarMonth);
		document.getElementById('next').dataset.month = calendarDate.getMonth();
		document.getElementById('next').dataset.year = calendarDate.getFullYear();
		document.getElementById('prev').dataset.month = calendarDate.getMonth();
		document.getElementById('prev').dataset.year = calendarDate.getFullYear();
		try {document.getElementById('today').setAttribute('style', 'background-color: #E0F989;');} catch(TypeError){};
		document.getElementById('next').onclick = function() {calendarPicker(document.getElementById('next').dataset.year, parseFloat(document.getElementById('next').dataset.month)+1)};
		document.getElementById('prev').onclick = function() {calendarPicker(document.getElementById('prev').dataset.year, parseFloat(document.getElementById('prev').dataset.month)-1)};

		
		
	}
	calendarPicker(new Date().getFullYear(), new Date().getMonth());

	// Copying the table to render mini date picker
	var frame__text;
	function frameText() {
		frame__text = document.getElementsByClassName('calendar')[0].children[0].cloneNode(true);
		frame__text.setAttribute('style', 'position: absolute; display: none; background-color: rgba(253, 255, 236, 1); right: 20px;');
		frame__text.style.width = 'auto';
	}
	frameText();
	
	var ff = function makeSmall(arr) {
		// var newArr = Array.prototype.slice.call(arguments);
		for (var i = 0; i < arr.length; i++){
			if (arr[i].innerHTML === '&gt;') {
				arr[i].onclick = function(event) {
					calendarPicker(event.target.getAttribute('data-year'), parseFloat(event.target.getAttribute('data-month'))+1);
					frameText();

				};
			}
			if (arr[i].innerHTML === '&gt;') {
				arr[i].onclick = function(event) {
					calendarPicker(event.target.getAttribute('data-year'), parseFloat(event.target.getAttribute('data-month'))-1);
					frameText();
				};

			}

		}
	}(frame__text.querySelectorAll('tr > td'));

	var dd = function onClickPicker(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].innerHTML !== ' ' && arr[i].innerHTML != '&lt;' && arr[i].innerHTML !== '&gt;') {
				arr[i].onclick = function(event) {
					var tempYear = document.getElementById('next').getAttribute('data-year');
					var tempMonth = document.getElementById('next').getAttribute('data-month');
					var deadlineDate = new Date(tempYear, tempMonth, event.target.innerHTML);
					document.getElementsByName('taskDead')[0].value = deadlineDate.toLocaleDateString();
				};
			}
			arr[i].style.width = 'auto'; 
			arr[i].style.height = 'auto'; 
			arr[i].style.textAlign = 'center';
		}
	}(frame__text.querySelectorAll('tr > td'));
	
	container__body.appendChild(frame__text);


	function createID() {
		var render__wrapper = document.getElementsByClassName('container__right')[0].children;
		for (var j = tasks.length-1; j >= 0; j--) {
			tasks[tasks.length-1-j].number = j;
			render__wrapper[tasks.length-1-j].id = tasks[tasks.length-1-j].number;
		}
	}

	function deleteTasks(event) {
		var render__wrapper = document.getElementsByClassName('container__right')[0].children;
		var temp = [];
		for (var i = 0; i < render__wrapper.length; i++) {
			if (render__wrapper[i].children[0].checked === true) {
				temp.push(parseInt(render__wrapper[i].children[0].closest('div').id));
			}
		}
		temp.forEach(function(elem) {
			for (var i = 0; i < tasks.length; i++) {
				if (tasks[i].number == elem) {
					tasks.splice(i, 1);
					var toStore = JSON.stringify(tasks);
					window.localStorage.setItem('tasker', toStore);
					document.getElementById(elem).remove();
				}
			};
		});
		createID();
		if (document.getElementsByClassName('tableCell__left')[0] !== undefined) {
			document.getElementsByClassName('tableCell__left')[0].remove();
		}
	}
});





