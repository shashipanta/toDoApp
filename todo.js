let newTask = document.querySelector("#new-task");
let addTaskBtn = document.querySelector("#addTask");
let toDoUl = document.querySelector(".todo-list ul");
let completeUL = document.querySelector(".complete-list ul");

// let completedTask = [];

let addToLocalStorage = (taskName) => {
  let taskCount = localStorage.getItem("totalTasks");
  console.log(typeof taskCount);
  if (taskCount === null) {
    localStorage.setItem("totalTasks", 0);
    taskCount = 0;
  }
  console.log(`${taskCount} : ${taskName}`);
  // store the object to localStorage
  localStorage.setItem(taskCount, taskName);
  // increase the index
  taskCount++;
  // update this value in local storage database
  localStorage.setItem("totalTasks", taskCount);
};

let addToCompletedTask = (taskName) => {
  let completedTaskArr = localStorage.getItem("completedTaskArr");
  // let completedTask = localStorage.getItem("completedTask");
  console.log(typeof completedTaskArr);
  if (completedTaskArr === null) {
    // if there are no completed task then
    completedTaskArr = [];
    // add the task
    completedTaskArr.push(taskName);

    localStorage.setItem("completedTaskArr", JSON.stringify(completedTaskArr));
  } else {
    let totalTaskCount = localStorage.getItem("totalTask");
    completedTaskArr = JSON.parse(completedTaskArr);
    console.log(completedTaskArr);
    completedTaskArr.push(taskName);
    // store in the local storage
    localStorage.setItem("completedTaskArr", JSON.stringify(completedTaskArr));
    localStorage.setItem("totalTasks", totalTaskCount--);
  }
};

let queryLocalStorage = (taskType) => {
  // comp : finding completedTasks
  // inComp : finding incomplete Tasks
  let taskArray = [];
  if (taskType === "inCompTask") {
    Object.keys(localStorage).forEach((key) => {
      if (!(key === "totalTasks") && !(key === "completedTaskArr")) {
        taskArray.push(localStorage[key]);
      }
    });
  } else {
    return JSON.parse(localStorage.getItem("completedTaskArr"));
  }
  console.log("Tasks", taskArray);
  return taskArray;
};

// remove from completed list in local storage
let removeTaskFromArray = (taskName) => {
  let taskToDel = taskName;
  let tempTaskArr = JSON.parse(localStorage.getItem("completedTaskArr"));
  console.log("type of temp task", tempTaskArr);
  if (tempTaskArr != null) {
    for (let i = 0; i < tempTaskArr.length; i++) {
      if (tempTaskArr[i] === taskToDel) {
        console.log(tempTaskArr.splice(i, 1));
        // update the local storage
        localStorage.setItem("completedTaskArr", JSON.stringify(tempTaskArr));
      }
    }
    console.log("completed task list : ", tempTaskArr);
  }
};

// remove task from incomplete task  in local storage
let removeTask = (taskName) => {
  console.log(`Moving taskName ${taskName} to completed task..`);
  console.log("Task to remove ", taskName);
  let taskToDel = taskName;
  // delete from Incomplete task database
  Object.keys(localStorage).forEach((key) => {
    let taskCount = localStorage.getItem("totalTasks");
    // console.log(localStorage[key], key);
    // console.log(typeof taskToDel, " ", typeof localStorage[key]);
    if (localStorage[key] == taskToDel) {
      console.log(`${localStorage[key]} is deleted.`);
      localStorage.removeItem(key);
    }
  });
};

let createListItem = () => {
  let listItem = document.createElement("li");
  let checkBox = document.createElement("input");
  listItem.className = "sep-content";
  checkBox.type = "checkbox";
  let label = document.createElement("label");
  return { listItem, checkBox, label };
};

let createDeleteButton = () => {
  // let taskName = listItem.childNodes[1].innerText;
  let deleteBtn = document.createElement("button"); //<button>
  deleteBtn.innerText = "Delete";
  deleteBtn.className = "delete";

  return deleteBtn;
};

let renderOnReload = () => {
  // render Incomplete Tasks
  console.log("Reload hapened");
  let inCompTaskArray = queryLocalStorage("inCompTask");
  let compTaskArray = queryLocalStorage("CompTask");

  if (compTaskArray != null) {
    // completed tasks
    compTaskArray.forEach((compTask) => {
      console.log("completed task : ", compTask);
      let { listItem, checkBox, label } = createListItem();
      let deleteBtn = createDeleteButton();

      // we don't need checkbox
      label.innerText = compTask;
      listItem.appendChild(label);
      listItem.appendChild(deleteBtn);

      // add the list item to the completed task document
      completeUL.appendChild(listItem);

      handleCompleteItems(listItem);
    });
  }

  // remove the completedTaskArr
  inCompTaskArray.forEach((task) => {
    // console.log(task);
    // create list item
    let { listItem, checkBox, label } = createListItem();
    // stick the list item to the document
    label.innerText = task;
    console.log(task);
    listItem.appendChild(checkBox);
    listItem.appendChild(label);

    // add the whole item to document
    toDoUl.appendChild(listItem);
    handleInCompleteItem(listItem);
  });
};

function addTask() {
  let { listItem, checkBox, label } = createListItem();

  // add task to localStorage
  let taskName = newTask.value;
  addToLocalStorage(taskName);
  label.innerText = taskName;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);

  // remove the content
  newTask.value = "";

  toDoUl.appendChild(listItem); //it will add tasks in incomplete tasks section
  handleInCompleteItem(listItem);
  // console.log(listItem);
}

function checkBoxClick() {
  let listItem = this.parentNode;
  let taskName = listItem.childNodes[1].innerText;
  let deleteBtn = createDeleteButton();
  listItem.appendChild(deleteBtn);
  console.log(deleteBtn);
  console.log("latest", listItem);

  let checkboxIn = listItem.querySelector("input[type=checkbox]");
  checkboxIn.remove();
  console.log("update", listItem);
  // add the newly formed listItem to window
  completeUL.appendChild(listItem);

  // add to completed task local storage
  addToCompletedTask(taskName);

  // remove from incomplete task storage
  removeTask(taskName);

  // remove the completed task after pressing checkbox
  handleCompleteItems(listItem);
}

function handleInCompleteItem(listItem) {
  let checkboxIn = listItem.querySelector("input[type=checkbox]");
  checkboxIn.onchange = checkBoxClick;
}

// delete the completed task
let handleCompleteItems = (listItem) => {
  let deleteButton = listItem.querySelector(".delete");
  deleteButton.onclick = deleteButtonPress;
};

function deleteButtonPress() {
  let listItem = this.parentNode;
  console.log("this : ", this);
  console.log("listItem : ", this.parentNode);
  let ul = listItem.parentNode;
  console.log("Delete button is pressed .... ");
  console.log("UL element ", ul);
  let taskToDel = listItem.querySelector("label").innerText;
  console.log(taskToDel);

  // find the task to delete
  let tempTaskArr = JSON.parse(localStorage.getItem("completedTaskArr"));

  console.log("type of temp task", typeof tempTaskArr);
  for (let i = 0; i < tempTaskArr.length; i++) {
    if (tempTaskArr[i] === taskToDel) {
      console.log("We are performing deletion operation");
      console.log(tempTaskArr.splice(i, 1));
      // update the local storage
      localStorage.setItem("completedTaskArr", JSON.stringify(tempTaskArr));
    }
  }
  console.log("completed task list : ", tempTaskArr);

  // after deletion reload the page to view changes
  setTimeout(location.reload(), 2000);

  // removeTaskFromArray(taskToDel);
  // console.log("Task to delete : ", taskToDel.replace("Delete", ""));

  // delete from Incomplete task database
  // Object.keys(localStorage).forEach((key) => {
  //   let taskCount = localStorage.getItem("totalTasks");
  //   // console.log(localStorage[key], key);
  //   // console.log(typeof taskToDel, " ", typeof localStorage[key]);
  //   if (localStorage[key] == taskToDel) {
  //     console.log(`${localStorage[key]} is deleted.`);
  //     localStorage.removeItem(key);

  //     // update the task count
  //     // localStorage.setItem("taskCount", --taskCount);
  //   }
  // });
  // console.log(this, ul, ul.firstElementChild.innerText);
  ul.removeChild(listItem);
  // remove entry form the local database
  // localStorage.removeItem()
}

addTaskBtn.addEventListener("click", addTask);
newTask.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    // cancel the default action
    e.preventDefault();
    addTaskBtn.click();
  }
});

// let task1 = "my task";

// localStorage.setItem("task1", task1);

// let localData = localStorage.getItem("task1");

// console.log(localData);

// let myTasks = {
//   taskName: "This is a task that I want to do",
// };

// let myArray = ["a", "b", "c"];

// localStorage.setItem("object", JSON.stringify(myTasks));

// localStorage.setItem("array", myArray);

// console.log(JSON.parse(localStorage.getItem("object")));

let taskObj = {};
// let taskCount = 1;

let createTask = (task) => {
  taskObj[taskCount] = task;
  // store in the local storage
  localStorage.setItem(taskCount, task);

  taskCount += 1;
};

window.addEventListener("load", renderOnReload);
