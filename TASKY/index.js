const taskContainer = document.querySelector(".task__container");

const openTaskModal = document.querySelector(".displayModal");

let globalStorage = [];

//load  initially saved data
const initialLoadCards = () => {
  //accessing data from localstorage
  const getCardData = localStorage.getItem("tasky");

  //parsing the data from localstorage
  const { cards } = JSON.parse(getCardData);

  //loop to create html cards
  cards.map((cardObject) => {
    //injecting the cards to dom
    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

    //updating the globalstorage
    globalStorage.push(cardObject);
  });
};

//to create new cards with the data
const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4" id=${taskData.id}>
  <div class="card">
    <div class="card-header d-flex justify-content-end gap-1">
      <button type="button" class="btn btn-outline-success" id=${taskData.id} onclick="editCard.apply(this, arguments)">
        <i class="fas fa-pencil-alt" id=${taskData.id} onclick="editCard.apply(this, arguments)"></i>
      </button>
      <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this, arguments)">
        <i class="fas fa-trash" id=${taskData.id} onclick="deleteCard.apply(this, arguments)"></i>
      </button>
    </div>
    <div class="card-body">
      <img
        src="${taskData.imageUrl}"
        class="card-img-top"
        alt="Card Image"
      />
      <h5 class="card-title">${taskData.taskTitle}</h5>
      <p class="card-text">${taskData.taskDescription}</p>
      <a class="bg-primary text-light"> ${taskData.taskType} </a>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <button 
        type="button" 
        class="btn btn-outline-primary" 
        id=${taskData.id} 
        data-bs-toggle="modal" 
        data-bs-target="#openTaskModal" 
        onclick="openTask.apply(this, arguments)"
      > 
        Open Task
      </button>
    </div>
  </div>
</div>
`;

//to save the data using save changes button
const saveChanges = () => {
  const taskData = {
    id: `${Date.now()}`,
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("taskTitle").value,
    taskType: document.getElementById("taskType").value,
    taskDescription: document.getElementById("taskDescription").value,
  };

  taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

  globalStorage.push(taskData);

  localStorage.setItem("tasky", JSON.stringify({ cards: globalStorage }));
};

//delete card button
const deleteCard = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;

  globalStorage = globalStorage.filter(
    (cardObject) => cardObject.id !== targetId
  );

  localStorage.setItem("tasky", JSON.stringify({ cards: globalStorage }));

  if (tagname === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

//edit card button
const editCard = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[3].childNodes[3];
  let taskDescription = parentElement.childNodes[3].childNodes[5];
  let taskType = parentElement.childNodes[3].childNodes[7];
  let submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.innerHTML = "Save changes";
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.setAttribute(
    "onclick",
    "saveEditedChanges.apply(this, arguments)"
  );
};

//save change after editing
const saveEditedChanges = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[3].childNodes[3];
  let taskDescription = parentElement.childNodes[3].childNodes[5];
  let taskType = parentElement.childNodes[3].childNodes[7];
  let submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  globalStorage = globalStorage.map((task) => {
    if (task.id === targetId) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task;
  });

  localStorage.setItem("tasky", JSON.stringify({ cards: globalStorage }));

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.innerHTML = "Open task";
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#openTaskModal");
};

//modal call for display task contents
const displayTask = (task) => {
  return `
  <div class="modal-header">
  <h5 class="modal-title">${task.taskTitle}</h5>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="modal"
      aria-label="Close"
    ></button>
  </div>
  <div class="modal-body">
    <img
      src="${task.imageUrl}"
      class="card-img-top"
      alt="Card Image"
    />
    <p class="card-text">${task.taskDescription}</p>
    <a class="bg-primary text-light"> ${task.taskType} </a>
  </div>
  <div class="modal-footer">
    <button
      type="button"
      class="btn btn-secondary"
      data-bs-dismiss="modal"
    >
    Close
    </button>
  </div>
  `;
};

//display task contents
const openTask = (event) => {
  event = window.event;
  const targetId = event.target.id;

  const taskData = globalStorage.filter(
    (cardObject) => cardObject.id === targetId
  );

  openTaskModal.innerHTML = displayTask(taskData[0]);
};
