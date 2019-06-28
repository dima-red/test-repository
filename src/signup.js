(() => {
    const signUpStore = {};
    let loginsObj = {};
    let loggedInUser = null;
    let parentEl = null;
    let signUpTemplate = null;
    let logInTemplate = null;
    let homeTemplate = null;
    let signUpQuestionTemplate = null;
    let logInQuestionTemplate = null;
    let loginBtnHeader = null;
    let logoutBtnHeader = null;
    let modal = null;
    
    getLoginsInfo(localStorage);
    onInit();
    
    console.log(loginsObj);
    
    function onInit() {
        console.log("onInit");

        parentEl = document.getElementById("bodyWrapper");

        !loggedInUser ? signupHandler() : homePageHandler();
    }

    function signupHandler() {
        signUpTemplate = parentEl.querySelector("#signupBlock");
        document.addEventListener("click", signUp);

        logInTemplate = parentEl.getElementsByClassName("login-block")[0];
        document.addEventListener("click", login);

        document.addEventListener("click", getSignUpTemplate);
        document.addEventListener("click", getLogInTemplate);

        logInQuestionTemplate = parentEl.getElementsByClassName("login-question-wrapper")[0];

        modal = parentEl.querySelector(".modal");
        loginBtnHeader = parentEl.querySelector(".login-modal");
        const closeButton = parentEl.querySelector(".close-button");
        loginBtnHeader.classList.remove("hide");
        loginBtnHeader.addEventListener("click", toggleModal);
        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
    }

    function homePageHandler() {
        const homeContent = parentEl.getElementsByClassName("home-content")[0];
        const childParagraph = document.createElement("p");

        childParagraph.textContent = "Congratulations! " + `${loggedInUser}` + " has successfully logged in."
        homeContent.appendChild(childParagraph);
        homeTemplate = parentEl.querySelector(".home-block");
        homeTemplate.classList.remove("hide");

        logoutBtnHeader = parentEl.querySelector(".logout-btn-header");
        logoutBtnHeader.addEventListener("click", logout);
        logoutBtnHeader.classList.remove("hide");

        getSignedUpUsersList();
    }

    function getSignedUpUsersList() {
        const userList = document.querySelector(".user-list");
        const fragment = document.createDocumentFragment();
        const listItem = document.createElement("li");
        
        let i = 1;
      
        for (const key in loginsObj) {            
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
            tdName.textContent = loginsObj[key].name;
            tdBDate.textContent =loginsObj[key].bdate;

            a.classList.add("edit-btn");
            a.textContent = "Edit";
            tdEdit.appendChild(a);

            tr.append(tdN, tdEmail, tdName, tdBDate, tdEdit);
            table.appendChild(tr);

            listItem.append(table);
            fragment.appendChild(listItem);
            i++;
        }

        userList.appendChild(fragment);
    }

    function toggleModal() {
        console.log("login header");
        modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }

    function login(ev) {
        if (eventTargetChecker(ev, "login-btn")) {
            console.log("login login");

            const logForm = Array.from(document.getElementsByClassName("login-form")[0]);
            const logEmail = logForm[0].value;
            const logPassword = logForm[1].value;
            signUpQuestionTemplate = parentEl.getElementsByClassName("signup-question-wrapper")[0];
    
            if (
                !!logEmail.length &&
                !!logPassword.length &&
                findCredentials(loginsObj, logEmail, logPassword)
            ) {
                parentEl.querySelector(".modal-section").classList.add("hide");
                dataServiceObj.set("loggedInUser", logEmail);
    
                toggleModal();
                loginBtnHeader.classList.add("hide");;
                getLoginsInfo(localStorage);
                homePageHandler();
                logoutBtnHeader.classList.remove("hide");
            }
        }
    };

    function logout() {
        dataServiceObj.remove("loggedInUser");
        getLoginsInfo(localStorage);

        logoutBtnHeader.classList.add("hide");;
        signupHandler();
        loginBtnHeader.classList.remove("hide");

        homeTemplate.classList.add("hide");
        parentEl.querySelector(".modal-section").classList.remove("hide");
        onInit();
    }

    function findCredentials(obj, email, password) {
        for (const key in obj) {
            if (key === email && obj[key].password === password) {
              return true;
            }
        }
        return false;
    }

    function eventTargetChecker (ev, selector) {
        return ev.target.classList.value.includes(selector);
    }

    function getSignUpTemplate(ev) {
        
        if (eventTargetChecker(ev, "signup-question-btn")) {
            signUpQuestionTemplate = parentEl.getElementsByClassName("signup-question-wrapper")[0];

            signUpTemplate.classList.remove("hide");
            logInTemplate.replaceWith(signUpTemplate);
            logInQuestionTemplate.classList.remove("hide");
            signUpQuestionTemplate.replaceWith(logInQuestionTemplate);
        }
    }

    function getLogInTemplate(ev) {
        if (eventTargetChecker(ev, "login-question-btn")) {
            getLoginsInfo(localStorage);
            signUpTemplate.replaceWith(logInTemplate);
            logInQuestionTemplate.replaceWith(signUpQuestionTemplate);
        }
    }

    function signUp(ev) {
        
        if (eventTargetChecker(ev, "signup-btn")) {

            console.log("signup signup")

            const regForm = Array.from(document.getElementsByClassName("signup-form")[0]);
            const regEmail = regForm[0].value;
            const regPassword = regForm[1].value;
            const regRePassword = regForm[2].value;

            signUpStore.email = regEmail;
            signUpStore.password = regPassword;
            signUpStore.repeatedPassword = regRePassword;

            inputReqs["reg-re-password"][0].param = regPassword;
            for (let i = 0; i < regForm.length; i++) {
                checkInput(regForm[i]);
            };

            if (
                isEmpty(signUpStore) &&
                !!signUpStore.password.length &&
                !!signUpStore.repeatedPassword.length &&
                signUpStore.password === signUpStore.repeatedPassword
            ) {
                logInTemplate.classList.remove("hide");
                signUpTemplate.replaceWith(logInTemplate);
                logInQuestionTemplate.replaceWith(signUpQuestionTemplate);
                loginsObj[signUpStore.email] = {
                    "password": signUpStore.password,
                    "name": "Name 1",
                    "bdate": "11.11.1111"
                }

                dataServiceObj.set("usersLogins", loginsObj);
            }

            console.log(signUpStore);
        }
    };

    function isEmpty(obj) {
        const valuesArr = [];

        for (let val = 0; val < Object.keys(obj).length; val++) {
            valuesArr.push(obj[Object.keys(obj)[val]].length);
        }

        const valuesLength = valuesArr.reduce((acc, curr) => {
            return acc + curr;
        }, 0);

        return !!valuesLength;
    };

    function getLoginsInfo(storage) {
        loginsObj = dataServiceObj.getSignedUpUsers(storage);
        loggedInUser = dataServiceObj.getLoggedInUser(storage);
    }
})()