let editModal = null;
let userEmail = null;
let tbody = null;

window.addEventListener("click", windowOnClick);

document.addEventListener("click", editUserInfo);
document.addEventListener("click", save);
document.addEventListener("click", cancel);

function getSignedUpUsersList(obj) {
    tbody = document.querySelector(".list-body");
    const fragment = document.createDocumentFragment();
    let tr = null;
    let tdN = null;
    let tdEmail = null;
    let tdName = null;
    let tdBDate = null;
    let tdEdit = null;
    let a = null;

    editModal = dataServiceObj.parentEl.querySelector(".edit-modal");
    closeBtn = editModal.querySelector(".close-edit-modal");
    closeBtn.addEventListener("click", toggleModal);
    
    let i = 1;
    
    for (const key in obj) {
        tr = document.createElement("tr");
        tdN = document.createElement("td");
        tdEmail = document.createElement("td");
        tdName = document.createElement("td");
        tdBDate = document.createElement("td");
        tdEdit = document.createElement("td");
        a = document.createElement("a");

        tr.classList.add("list-body-item");
        tdN.textContent = `${i}.`;
        tdEmail.textContent = `${key}`;
        tdName.textContent = obj[key].name;
        tdBDate.textContent =obj[key].bdate;

        a.classList.add("edit-btn");
        a.textContent = "Edit";
        a.dataset.email = `${key}`;
        
        
        tdEdit.appendChild(a);

        tr.append(tdN, tdEmail, tdName, tdBDate, tdEdit);
        fragment.append(tr);
        i++;
    }

    tbody.appendChild(fragment);
}

function editUserInfo(ev) {
    if (eventTargetChecker(ev, "edit-btn")) {
        toggleModal();

        userEmail = ev.target.dataset.email;
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

    dataServiceObj.loginsObj[userEmail].name = editForm[0].value;
    dataServiceObj.loginsObj[userEmail].bdate = editForm[1].value;

    dataServiceObj.set("usersLogins", dataServiceObj.loginsObj);
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

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