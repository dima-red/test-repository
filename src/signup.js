(() => {
    const signUpStore = {};
    let loggedInUser = null;
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
    
    console.log(dataServiceObj.loginsObj);
    
    function onInit() {
        console.log("onInit");

        dataServiceObj.parentEl = document.getElementById("bodyWrapper");

        !loggedInUser ? signupHandler() : homePageHandler();
    }

    function signupHandler() {
        signUpTemplate = dataServiceObj.parentEl.querySelector("#signupBlock");
        document.addEventListener("click", signUp);

        logInTemplate = dataServiceObj.parentEl.getElementsByClassName("login-block")[0];
        document.addEventListener("click", login);

        document.addEventListener("click", getSignUpTemplate);
        document.addEventListener("click", getLogInTemplate);

        logInQuestionTemplate = dataServiceObj.parentEl.getElementsByClassName("login-question-wrapper")[0];

        modal = dataServiceObj.parentEl.querySelector(".modal");
        loginBtnHeader = dataServiceObj.parentEl.querySelector(".login-modal");
        const closeButton = dataServiceObj.parentEl.querySelector(".close-button");
        loginBtnHeader.classList.remove("hide");
        loginBtnHeader.addEventListener("click", toggleModal);
        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
    }

    function homePageHandler() {
        const homeContent = dataServiceObj.parentEl.getElementsByClassName("home-content")[0];
        const childParagraph = document.createElement("p");

        childParagraph.textContent = "Congratulations! " + `${loggedInUser}` + " has successfully logged in."
        homeContent.appendChild(childParagraph);
        homeTemplate = dataServiceObj.parentEl.querySelector(".home-block");
        homeTemplate.classList.remove("hide");

        logoutBtnHeader = dataServiceObj.parentEl.querySelector(".logout-btn-header");
        logoutBtnHeader.addEventListener("click", logout);
        logoutBtnHeader.classList.remove("hide");

        getSignedUpUsersList(dataServiceObj.loginsObj);
    }

    function toggleModal() {
        modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }

    function login(ev) {
        if (eventTargetChecker(ev, "login-btn")) {

            const logForm = Array.from(document.getElementsByClassName("login-form")[0]);
            const logEmail = logForm[0].value;
            const logPassword = logForm[1].value;
            signUpQuestionTemplate = dataServiceObj.parentEl.getElementsByClassName("signup-question-wrapper")[0];
    
            if (
                !!logEmail.length &&
                !!logPassword.length &&
                findCredentials(dataServiceObj.loginsObj, logEmail, logPassword)
            ) {
                dataServiceObj.parentEl.querySelector(".modal-section").classList.add("hide");
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
        dataServiceObj.parentEl.querySelector(".modal-section").classList.remove("hide");
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
            signUpQuestionTemplate = dataServiceObj.parentEl.getElementsByClassName("signup-question-wrapper")[0];

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
                dataServiceObj.loginsObj[signUpStore.email] = {
                    "password": signUpStore.password,
                    "name": "Name 1",
                    "bdate": "11.11.1111"
                }

                dataServiceObj.set("usersLogins", dataServiceObj.loginsObj);
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
        dataServiceObj.loginsObj = dataServiceObj.getSignedUpUsers(storage);
        loggedInUser = dataServiceObj.getLoggedInUser(storage);
    }
})()