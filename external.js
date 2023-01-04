/* eslint-disable no-undef */

const idb = indexedDB.open('todo-list', 1);
idb.onupgradeneeded = () => {
  const res = idb.result;
  res.createObjectStore('lists', { autoIncrement: true });
};
idb.onsuccess = () => {
  const res = idb.result;
  const tx = res.transaction('lists', 'readonly');
  const store = tx.objectStore('lists');
  const cursor = store.openCursor();
  cursor.onsuccess = () => {
    const list = cursor.result;
    if (list) {
      document.getElementById('added-lists').innerHTML += `
      <li>
        <a id="list-name-${list.key}" class="has-text-light">
          <i class="fa-solid fa-clipboard-list mr-5"></i>
          ${list.value.ListName}
        </a>
        <span id="list-delete" onclick=deleteList(${list.key}) class="icon">
          <i class="fa-solid fa-trash"></i>
        </span>
        <span id="list-edit" onclick=editList(${list.key}) class="icon">
          <i class="fa-regular fa-pen-to-square"></i>
        </span>
      </li>
      `;
      list.continue();
    }
  };
};

const addNewList = () => {
  const newList = document.getElementById('new-list-input').value;
  const idb = indexedDB.open('todo-list', 1);

  idb.onsuccess = () => {
    const res = idb.result;
    const tx = res.transaction('lists', 'readwrite');
    const store = tx.objectStore('lists');
    store.put({
      ListName: newList
    });
  };
};

const editList = (key) => {
  const listName = document.getElementById(`list-name-${key}`).innerText;
  document.getElementById(`list-name-${key}`).innerHTML = `
  <i class="fa-solid fa-clipboard-list mr-5"></i>
  <form id='edit-list-name'>
    <input id='list-new-name' type='text'  />
  </form>
  `;
  document.getElementById('list-new-name').focus();
  document.getElementById('list-new-name').value = document.getElementById('list-new-name').value;
  document.getElementById('edit-list-name').onsubmit = function () {
    if (document.getElementById('list-new-name').value) {
      newName = document.getElementById('list-new-name').value;
    } else {
      newName = listName;
    }
    const idb = indexedDB.open('todo-list', 1);
    idb.onsuccess = () => {
      const res = idb.result;
      const tx = res.transaction('lists', 'readwrite');
      const store = tx.objectStore('lists');
      store.put({
        ListName: newName
      }, key);
    };
  };
};

const deleteList = (key) => {
  const idb = indexedDB.open('todo-list', 1);
  idb.onsuccess = () => {
    const res = idb.result;
    const tx = res.transaction('lists', 'readwrite');
    const store = tx.objectStore('lists');
    store.delete(key);
  };
  location.reload();
};

const updateListSelector = () => {
  const idb = indexedDB.open('todo-list', 1);
  idb.onsuccess = () => {
    const res = idb.result;
    const tx = res.transaction('lists', 'readonly');
    const store = tx.objectStore('lists');
    const cursor = store.openCursor();
    cursor.onsuccess = () => {
      const lists = cursor.result;
      if (lists) {
        document.getElementById('list-selector').innerHTML += `
          <option value='${lists.value.ListName}'>${lists.value.ListName}</option>
        `;
        lists.continue();
      }
    };
  };
};
updateListSelector();

const TaskList = JSON.parse(localStorage.getItem('Tasks'));
if (TaskList) {
  for (let i = TaskList.length; i > 0; i--) {
    document.getElementById('task-list').innerHTML += `
    <div class="level m-3 p-2 has-background-grey" id="task" >
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle columns mx-2">
              <input type="checkbox" id="task-status-${TaskList[i - 1].id}" onclick="checkboxIsClicked(${TaskList[i - 1].id})" class="column" style="width: 25px; height: 25px;"/>
            </p>
          </div>
          <div class="level-item has-text-left mx-5">
            <div>
              <p id="task-title-${TaskList[i - 1].id}" class="title">${TaskList[i - 1].Title}</p>
              <p id="task-note-${TaskList[i - 1].id}" class="heading">${TaskList[i - 1].Note}</p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item has-text-left mx-5">
            <div>
              <p class="subtitle mx-3" id="task-duedate-${TaskList[i - 1].id}" title="${TaskList[i - 1].DueDate}"><i class="fa-solid fa-calendar-days"></i></p>
            </div>
            <div>
              <p class="subtitle mx-3" id="task-reminder-${TaskList[i - 1].id}" title="${TaskList[i - 1].Reminder}"><i class="fa-solid fa-bell"></i></p>
            </div>
            <div>
              <p class="subtitle mx-3" id="task-important-${TaskList[i - 1].id}"><i class="fa-solid fa-star"></i></p>
            </div>
          </div>
          <button onclick="editTask(${TaskList[i - 1].id})" class="task-edit" id="task-edit-${TaskList[i - 1].id}"><i class="fa-regular fa-pen-to-square"></i></button>
          <button onclick="deleteTask(${TaskList[i - 1].id})" class="task-delete" id="task-delete-${TaskList[i - 1].id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    if (document.getElementById(`task-duedate-${i}`).title) {
      document.getElementById(`task-duedate-${i}`).innerHTML = '<i class="fa-solid fa-calendar-days has-text-primary"></i>';
    }
    if (document.getElementById(`task-reminder-${i}`).title) {
      document.getElementById(`task-reminder-${i}`).innerHTML = '<i class="fa-solid fa-bell has-text-primary"></i>';
    }
    if (TaskList[i - 1].IsImportant === true) {
      document.getElementById(`task-important-${i}`).innerHTML = '<i class="fa-solid fa-star has-text-primary"></i>';
    }
    if (TaskList[i - 1].Status === true) {
      document.getElementById(`task-status-${i}`).checked = true;
      document.getElementById(`task-title-${i}`).style.textDecoration = 'line-through';
      document.getElementById(`task-edit-${i}`).disabled = true;
      document.getElementById(`task-edit-${i}`).style.backgroundColor = 'grey';
      document.getElementById(`task-delete-${i}`).disabled = true;
      document.getElementById(`task-delete-${i}`).style.backgroundColor = 'grey';
    } else {
      document.getElementById(`task-status-${i}`).checked = false;
      document.getElementById(`task-title-${i}`).style.textDecoration = 'none';
      document.getElementById(`task-edit-${i}`).disabled = false;
      document.getElementById(`task-edit-${i}`).style.backgroundColor = 'blue';
      document.getElementById(`task-delete-${i}`).disabled = false;
      document.getElementById(`task-delete-${i}`).style.backgroundColor = 'red';
    }
  }
}

const checkboxIsClicked = (id) => {
  const TaskList = JSON.parse(localStorage.getItem('Tasks'));
  if (TaskList[id - 1].Status === false) {
    TaskList[id - 1].Status = true;
    document.getElementById(`task-title-${id}`).style.textDecoration = 'line-through';
    document.getElementById(`task-edit-${id}`).disabled = true;
    document.getElementById(`task-edit-${id}`).style.backgroundColor = 'grey';
    document.getElementById(`task-delete-${id}`).disabled = true;
    document.getElementById(`task-delete-${id}`).style.backgroundColor = 'grey';
  } else {
    TaskList[id - 1].Status = false;
    document.getElementById(`task-title-${id}`).style.textDecoration = 'none';
    document.getElementById(`task-edit-${id}`).disabled = false;
    document.getElementById(`task-edit-${id}`).style.backgroundColor = 'blue';
    document.getElementById(`task-delete-${id}`).disabled = false;
    document.getElementById(`task-delete-${id}`).style.backgroundColor = 'red';
  }
  localStorage.setItem('Tasks', JSON.stringify(TaskList));
};

const closeTaskEditor = () => {
  document.getElementById('task-editor').style.display = 'none';
};

const openTaskEditor = () => {
  document.getElementById('task-editor').style.display = 'flex';
  document.getElementById('task-title-input').value = null;
  document.getElementById('task-note-input').value = null;
  document.getElementById('task-important-input').checked = false;
  document.getElementById('task-duedate-input').value = null;
  document.getElementById('task-reminder-input').value = null;
  document.getElementById('list-selector').selectedIndex = 0;
};

const addNewTask = () => {
  let TaskList = [];
  TaskList = JSON.parse(localStorage.getItem('Tasks')) ?? [];

  let id;
  if (TaskList.length !== 0) {
    // eslint-disable-next-line no-return-assign
    TaskList.findLast((task) => id = task.id);
  } else {
    id = 0;
  }

  const taskTitle = document.getElementById('task-title-input').value;
  const taskNote = document.getElementById('task-note-input').value;
  const taskDateTime = Date.now();
  const taskImportant = document.getElementById('task-important-input').checked === true;
  const taskDueDate = document.getElementById('task-duedate-input').value;
  const taskReminder = document.getElementById('task-reminder-input').value;

  const task = {
    id: id + 1,
    Title: taskTitle,
    Note: taskNote,
    IsImportant: taskImportant,
    DateTime: taskDateTime,
    DueDate: taskDueDate,
    Reminder: taskReminder,
    Status: false,
    ListId: 1
  };

  TaskList.push(task);
  localStorage.setItem('Tasks', JSON.stringify(TaskList));

  document.getElementById('task-title-input').value = '';
  document.getElementById('task-note-input').value = '';
  document.getElementById('task-duedate-input').value = '';
  document.getElementById('task-reminder-input').value = '';

  closeTaskEditor();
  location.reload();
};

const editTask = (id) => {
  openTaskEditor();
  document.getElementById('create-task-btn').innerText = 'Save Edited Task';

  const TaskList = JSON.parse(localStorage.getItem('Tasks'));

  document.getElementById('task-title-input').value = TaskList[id - 1].Title;
  document.getElementById('task-note-input').value = TaskList[id - 1].Note;
  TaskList[id - 1].IsImportant === true ? document.getElementById('task-important-input').checked = true : document.getElementById('task-important-input').checked = false;
  document.getElementById('task-duedate-input').value = TaskList[id - 1].DueDate;
  document.getElementById('task-reminder-input').value = TaskList[id - 1].Reminder;

  document.getElementById('create-task-btn').onclick = () => {
    const taskTitle = document.getElementById('task-title-input').value;
    const taskNote = document.getElementById('task-note-input').value;
    const taskDateTime = Date.now();
    const taskImportant = document.getElementById('task-important-input').checked === true;
    const taskDueDate = document.getElementById('task-duedate-input').value;
    const taskReminder = document.getElementById('task-reminder-input').value;

    const task = {
      id,
      Title: taskTitle,
      Note: taskNote,
      IsImportant: taskImportant,
      DateTime: taskDateTime,
      DueDate: taskDueDate,
      Reminder: taskReminder,
      Status: false,
      ListId: 1
    };

    TaskList[id - 1] = task;
    localStorage.setItem('Tasks', JSON.stringify(TaskList));

    document.getElementById('task-title-input').value = '';
    document.getElementById('task-note-input').value = '';
    document.getElementById('task-duedate-input').value = '';
    document.getElementById('task-reminder-input').value = '';

    closeTaskEditor();
    location.reload();
  };
};

const deleteTask = (id) => {
  const TaskList = JSON.parse(localStorage.getItem('Tasks'));
  TaskList.splice(id - 1, 1);
  localStorage.setItem('Tasks', JSON.stringify(TaskList));
  location.reload();
};

// filters
const getImportant = () => {
  const TaskList = JSON.parse(localStorage.getItem('Tasks'));
  if (TaskList) {
    for (let i = TaskList.length; i > 0; i--) {
      document.getElementById('task-list').innerHTML += `
      <div class="level m-3 p-2 has-background-grey" id="task" >
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle columns mx-2">
              <input type="checkbox" id="task-status-${TaskList[i - 1].id}" onclick="checkboxIsClicked(${TaskList[i - 1].id})" class="column" style="width: 25px; height: 25px;"/>
            </p>
          </div>
          <div class="level-item has-text-left mx-5">
            <div>
              <p id="task-title-${TaskList[i - 1].id}" class="title">${TaskList[i - 1].Title}</p>
              <p id="task-note-${TaskList[i - 1].id}" class="heading">${TaskList[i - 1].Note}</p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item has-text-left mx-5">
            <div>
              <p class="subtitle mx-3" id="task-duedate-${TaskList[i - 1].id}" title="${TaskList[i - 1].DueDate}"><i class="fa-solid fa-calendar-days"></i></p>
            </div>
            <div>
              <p class="subtitle mx-3" id="task-reminder-${TaskList[i - 1].id}" title="${TaskList[i - 1].Reminder}"><i class="fa-solid fa-bell"></i></p>
            </div>
            <div>
              <p class="subtitle mx-3" id="task-important-${TaskList[i - 1].id}"><i class="fa-solid fa-star"></i></p>
            </div>
          </div>
          <button onclick="editTask(${TaskList[i - 1].id})" class="task-edit" id="task-edit-${TaskList[i - 1].id}"><i class="fa-regular fa-pen-to-square"></i></button>
          <button onclick="deleteTask(${TaskList[i - 1].id})" class="task-delete" id="task-delete-${TaskList[i - 1].id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
      `;
      if (document.getElementById(`task-duedate-${i}`).title) {
        document.getElementById(`task-duedate-${i}`).innerHTML = '<i class="fa-solid fa-calendar-days has-text-primary"></i>';
      }
      if (document.getElementById(`task-reminder-${i}`).title) {
        document.getElementById(`task-reminder-${i}`).innerHTML = '<i class="fa-solid fa-bell has-text-primary"></i>';
      }
      if (TaskList[i - 1].IsImportant === true) {
        document.getElementById(`task-important-${i}`).innerHTML = '<i class="fa-solid fa-star has-text-primary"></i>';
      }
      if (TaskList[i - 1].Status === true) {
        document.getElementById(`task-status-${i}`).checked = true;
        document.getElementById(`task-title-${i}`).style.textDecoration = 'line-through';
        document.getElementById(`task-edit-${i}`).disabled = true;
        document.getElementById(`task-edit-${i}`).style.backgroundColor = 'grey';
        document.getElementById(`task-delete-${i}`).disabled = true;
        document.getElementById(`task-delete-${i}`).style.backgroundColor = 'grey';
      } else {
        document.getElementById(`task-status-${i}`).checked = false;
        document.getElementById(`task-title-${i}`).style.textDecoration = 'none';
        document.getElementById(`task-edit-${i}`).disabled = false;
        document.getElementById(`task-edit-${i}`).style.backgroundColor = 'blue';
        document.getElementById(`task-delete-${i}`).disabled = false;
        document.getElementById(`task-delete-${i}`).style.backgroundColor = 'red';
      }
    }
  }
};
