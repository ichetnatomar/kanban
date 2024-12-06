const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css';
document.head.appendChild(link);

const modalWindowElement = document.querySelector('.modal-cont');
const removeBtn = document.querySelector('.trash-btn');
const addBtn = document.querySelector('.add-btn');
const textElement = document.querySelector('.text-area');
const mainContainerElement = document.querySelector('.main-cont');
const priorityColorElements = document.querySelectorAll('.priority-color');
const trashIconElement = document.querySelector('.fa-solid, .fa-trash');
const toolboxColors = document.querySelectorAll('.toolbox-filter-color');
let savedTickets = [];
let ticketsArr = [];
// let ticketsArr = JSON.parse(localStorage.getItem('tickets'))||[]; //dont use this, many things will change. but see for locgic: used, incase you have any tickets from last session, picki them first, and the add new tickets. then there is no need to make a separate array saveTickets[]

//this array is used to change ticket's color when its color band gets clicked
const toolboxColorArray = ['filter-color-1', 'filter-color-2', 'filter-color-3', 'filter-color-4'];

let toolboxColorClass = null;
let isModalOn = false;
let ticketColorClass = 'filter-color-1';
let isTrashOn = false;


//every time page refreshes, call init() that puuls tickte info from localStroarge, recreates and displays them.
const init = () => {
  savedTickets = JSON.parse(localStorage.getItem('tickets')); //JSON string is parsed to normal object(in thi case array of obejcts)

  if (savedTickets) {
    savedTickets.forEach((ticketObj) => {
      const id = ticketObj.id;
      const color = ticketObj.color;
      const task = ticketObj.task;
      createTicket(color, id, task);
    })
  }
}
init();





//generate a ticket
function createTicket(ticketColorClass, id, task) {

  const ticketElement = document.createElement('div');
  ticketElement.classList.add('ticket-cont');
  ticketElement.innerHTML = `   
    <div class="ticket-header"></div>
      <div class="ticket-title"></div>
      <div class="ticket-description"></div>
      <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
      </div>      
   `;

  const ticketDescriptionElement = ticketElement.querySelector('.ticket-description');
  const lockElement = ticketElement.querySelector('.ticket-lock').parentElement;

  mainContainerElement.appendChild(ticketElement);

  //populating info into the ticket
  const ticketTitleElement = ticketElement.querySelector('.ticket-title');
  ticketTitleElement.innerText = id;  //assign id to ticket

  //populate ticket's descrption with modal windows' text area content
  ticketElement.querySelector('.ticket-description').innerText = task;

  ticketElement.querySelector('.ticket-header').classList.add(ticketColorClass); //assign color thats chose after clickking on priorty colors 
  ticketColorClass = 'filter-color-1'; //setting back to default value


  handleticketsArr(ticketElement);          //after a ticket is created and populated, add it to ticketsArr.

  removeModalPopup();                       //remove modal pop-up window once its corresponding ticket is generated

  handleColor(ticketElement);               //when a ticket is created, a handlecolor() function is binded to it.

  handleLock2(ticketElement);               //handle lock of the ticket

  deleteTicket(ticketElement);              //delete ticket when trash button is activated, and that ticket is clicked 

}

function handleticketsArr(ticketElement) {
  const color = ticketElement.querySelector('.ticket-header').classList[1];  //extract color from ticket
  const id = ticketElement.querySelector('.ticket-title').innerText;         //extract id from ticket
  const task = ticketElement.querySelector('.ticket-description').innerText; //extract task from ticket

  const ticketObj = {
    'color': color,
    'id': id,
    'task': task,
  }

  ticketsArr.push(ticketObj);

  //Set local storage
  localStorage.setItem('tickets', JSON.stringify(ticketsArr));
}



function removeModalPopup() {
  modalWindowElement.style.display = 'none';
  isModalOn = false;
}



//on clicking the plus button, pop-up a modal window
addBtn.addEventListener('click', function () {
  if (isModalOn) {     //if modal window is already there, then remove it, and make flag false
    modalWindowElement.style.display = 'none';
    isModalOn = false;
  }
  else {               //if modal window is not there, then pop it up, and make flag true
    modalWindowElement.style.display = 'flex';
    textElement.innerText = "";
    isModalOn = true;
  }
});




//write tasks
document.addEventListener('keydown', function (e) {
  if (e.key == 'Shift' && isModalOn) {
    //call a function that creates a fresh ticket for each task
    // pass values of color, id and description with it
    const id = (Math.random() * 10000).toFixed(0);
    const task = modalWindowElement.querySelector('.text-area').value;
    createTicket(ticketColorClass, id, task);
  }
});




//on clicking color, show highlight
priorityColorElements.forEach((priorityColorElement) => {

  priorityColorElement.addEventListener('click', () => {
    priorityColorElements.forEach((colorElement) => {
      colorElement.classList.remove('chosen-color-border');
    });

    priorityColorElement.classList.add('chosen-color-border');

    //another way of accessing color, extract color class for element,
    priorityColorElement.classList.forEach(priorityColorElementClass => {
      if (priorityColorElementClass.match('filter-color')) {
        ticketColorClass = priorityColorElementClass;
      }
    });
  });
});

//doing above this using event delegation method, instead of forEach

// document.addEventListener('click', function (e) {
//   if (e.target.matches('.priority-color')
//   ) {
//     //first remove any chosen-color-border class from any buttons if present
//     document.querySelectorAll('.chosen-color-border').forEach(element => {
//       element.classList.remove('chosen-color-border');
//     });
//     e.target.classList.add('chosen-color-border');
//   }
// });




//activate trash button
const trashElement = document.querySelector('.trash-btn');
trashElement.addEventListener('click', () => {
  isTrashOn = !isTrashOn;
  if (isTrashOn) {
    trashIconElement.style.color = 'black'; //change trash color to black
    trashElement.style.backgroundColor = '#FA0533'; //change bg color to red

    alert("Delete button has been activated.");
    const allTickets = document.querySelectorAll('.ticket-cont');
    allTickets.forEach(ticket => {
      ticket.style.cursor = 'pointer';
    })
  }
  else {
    trashIconElement.style.color = 'azure';
    trashElement.style.backgroundColor = 'rgb(6, 255, 89)';
  }
});




//delete a ticket
function deleteTicket(ticketElement) {
  ticketElement.addEventListener('click', () => {
    if (isTrashOn) {
      //remove ticket from ticketarray
      const ticketId = ticketElement.querySelector('.ticket-title').innerText;

      //once you know id. search it inside ticketarray and delete it
      const ticketIdx = getIdx(ticketId);

      ticketsArr.splice(ticketIdx, 1);  //1 ticket counting from ticketidx was spliced from ticketsArr

      //using filter()
      // ticketsArr = ticketsArr.filter((ticketObj)=>{

      //   let ans = ticketObj.id === ticketId ? false : true;
      //   return ans;      

      // });

      ticketElement.remove();

      updateLocalStorage();
    }
  })
}


// document.addEventListener('click', (e) => {
//   if (isTrashOn) {
//     e.target.parentElement.classList.forEach(parentClass => {
//       if (parentClass.match('ticket-cont')) {
//         e.target.parentElement.remove();
//       }
//     })
//   }
// });




//on double-clicking any toolbox color, all tickets are displayed
toolboxColors.forEach(toolboxColor => {
  toolboxColor.addEventListener('dblclick', () => {
    const allTicketsElements = document.querySelectorAll('.ticket-cont');
    allTicketsElements.forEach(ticketEle => {
      ticketEle.style.display = 'block';
    })
  })
})




//select a toolbox color and filter all tickets of that color
toolboxColors.forEach(toolboxColor => {
  toolboxColor.addEventListener('click', () => {
    toolboxColorClass = toolboxColor.classList[1];
    let allTicketsElements = document.querySelectorAll('.ticket-cont');

    //for each ticket check, if its header class has chose color
    allTicketsElements.forEach(ticket => {
      if (ticket.children[0].classList.contains(toolboxColorClass)) {
        ticket.style.display = 'block';
      }
      else {
        ticket.style.display = 'none';
      }
    })
  })
})




function handleColor(ticketElement) {
  const ticketHeaderElement = ticketElement.querySelector('.ticket-header');
  let ticketHeaderColor = ticketHeaderElement.classList[1]; //access ticket color class
  let ticketHeaderColorIndex = -1;


  //when this ticket header is clicked, its color is changed to next color
  ticketHeaderElement.addEventListener('click', () => {


    ticketHeaderColorIndex = toolboxColorArray.findIndex((color) => {       //find index of ticket' color in color array
      return (ticketHeaderColor === color);
    })

    //increase the index by 1,
    ticketHeaderElement.classList.remove(ticketHeaderColor);

    ticketHeaderColorIndex = (ticketHeaderColorIndex + 1) % (toolboxColorArray.length);
    ticketHeaderColor = toolboxColorArray[ticketHeaderColorIndex];
    ticketHeaderElement.classList.add(toolboxColorArray[ticketHeaderColorIndex]);

    //upadte this new color inside ticket

    //this change in ticket's color property should also be persisited in local storage
    //locate where in ticket array this modified ticket lies
    const ticketIdx = getIdx(ticketElement.querySelector('.ticket-title').innerText); //access id
    ticketsArr[ticketIdx].color = ticketHeaderColor;
    updateLocalStorage();
  })
}




//on clicking the lock, it opens, and closes, toggle.
function handleLock(ticketElement) {
  const lockElement = ticketElement.querySelector('.ticket-lock');
  const lockIconElement = lockElement.querySelector('.fa-lock');
  let isLockToOpen = false;
  lockElement.addEventListener('click', () => {
    isLockToOpen = !isLockToOpen;
    if (isLockToOpen) {
      //lock should open
      lockIconElement.classList.remove('fa-lock');
      lockIconElement.classList.add('fa-lock-open');
    }
    else {
      //lock should close
      lockIconElement.classList.remove('fa-lock-open');
      lockIconElement.classList.add('fa-lock');
    }
  })
}

//doing handle lock WITHOUT Flag
function handleLock2(ticketElement) {
  const lockElement = ticketElement.querySelector('.ticket-lock');
  const lockElem = lockElement.childNodes[1];
  lockElem.addEventListener('click', () => {
    if (lockElem.classList.contains('fa-lock')) {
      lockElem.classList.remove(lockElem.classList[1]);
      lockElem.classList.add('fa-lock-open');
    }
    else {
      lockElem.classList.remove(lockElem.classList[1]);
      lockElem.classList.add('fa-lock');
    }
  })
}




function getIdx(id) {
  //go over ticketArr, and locate that ticket using id

  const ticketIdx = ticketsArr.findIndex((ticket) => {
    return ticket.id === id; //moment ticket id == id, return from there.
  })
  return ticketIdx;
}

//everytime ay chnage is made to ticktes, it is persisted inside localstorage
function updateLocalStorage() {
  localStorage.setItem('tickets', JSON.stringify(ticketsArr));
}
