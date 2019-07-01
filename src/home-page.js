let editModal = null;
let idNumber = null;
let userEmail = null;

function getSignedUpUsersList(obj) {
    const userList = document.querySelector(".user-list");
    const fragment = document.createDocumentFragment();
    const listItem = document.createElement("li");
    listItem.classList.add("list-body");
    editModal = dataServiceObj.parentEl.querySelector(".edit-modal");
    closeBtn = editModal.querySelector(".close-edit-modal");
    closeBtn.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
    document.addEventListener("click", save);
    document.addEventListener("click", cancel);
    
    let i = 1;
    
    for (const key in obj) {            
        const table = document.createElement("table");
        const tr = document.createElement("tr");
        const tdN = document.createElement("td");
        const tdEmail = document.createElement("td");
        const tdName = document.createElement("td");
        const tdBDate = document.createElement("td");
        const tdEdit = document.createElement("td");
        const a = document.createElement("a");

        tdN.textContent = `${i}.`;
        tdEmail.textContent = `${key}`;
        tdEmail.classList.add("email");
        tdName.textContent = obj[key].name;
        tdBDate.textContent =obj[key].bdate;

        a.classList.add("edit-btn");
        a.textContent = "Edit";
        a.id = "editBtn" + `${i}`;
        document.addEventListener("click", editUserInfo);
        
        tdEdit.appendChild(a);

        tr.append(tdN, tdEmail, tdName, tdBDate, tdEdit);
        table.appendChild(tr);
        table.id = "listItem" + `${i}`;

        listItem.append(table);
        fragment.appendChild(listItem);
        i++;
    }

    userList.appendChild(fragment);
}

function editUserInfo(ev) {
    if (eventTargetChecker(ev, "edit-btn")) {
        toggleModal();

        idNumber = getIdNumber(ev.target.id);
        userEmail = document.querySelector("#listItem" + `${idNumber}`+ " .email");

        console.log(userEmail.textContent);
        console.log(dataServiceObj.loginsObj);
    }
}

function save(ev) {
    if (eventTargetChecker(ev, "save-changes-btn")) {
        updadeUserInfo();
    }   
}

function cancel(ev) {
    if (eventTargetChecker(ev, "cancel-changes-btn")) {
        toggleModal();
    }   
}

function updadeUserInfo() {
    const editForm = Array.from(dataServiceObj.parentEl.querySelector(".edit-form"));

    dataServiceObj.loginsObj[userEmail.textContent] = {
        "name": editForm[0].value,
        "bdate": editForm[1].value
    }

    dataServiceObj.set("usersLogins", dataServiceObj.loginsObj);
    document.querySelector(".list-body").remove();

    getSignedUpUsersList(dataServiceObj.loginsObj);
    toggleModal();
}

function eventTargetChecker (ev, selector) {
    return ev.target.classList.value.includes(selector);
}

function toggleModal() {
    editModal.classList.toggle("show-edit-modal");
}

function windowOnClick(event) {
    if (event.target === editModal) {
        toggleModal();
    }
}

function getIdNumber(stringWithId) {
    const theLastSymbol = stringWithId[stringWithId.length - 1];
    const beforeLastSymbol = stringWithId[stringWithId.length - 2];
    let id = null;
    
    if (theLastSymbol === "0") {
        id = `${beforeLastSymbol}` + `${theLastSymbol}`;
    } else {
        id = theLastSymbol;
    }

    return id;
}
