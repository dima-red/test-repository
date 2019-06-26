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
    let loginBtn = null;
    let signupBtn = null;
    let signUpQuestionBtn = null;
    let logInQuestionBtn = null;
    let loginBtnHeader = null;
    let modal = null;
    
    getLocalStorageData(localStorage);
    onInit();
    isLoggedInUser();
    
    console.log(loginsObj);
    
    function onInit() {
        console.log("onInit");

        parentEl = document.getElementById("bodyWrapper");

        if (!loggedInUser) {
            signUpTemplate = parentEl.querySelector("#signupBlock");

            signupBtn = parentEl.getElementsByClassName("signup-btn")[0];
            signupBtn.addEventListener("click", signUp);

            signUpTemplate.remove();
            logInTemplate = parentEl.getElementsByClassName("login-block")[0];
            loginBtn = parentEl.getElementsByClassName("login-btn")[0];
            loginBtn.addEventListener("click", login);
            
            homeTemplate = parentEl.querySelector(".home-block");
            homeTemplate.remove();

            signUpQuestionBtn = parentEl.getElementsByClassName("signup-question-btn")[0];
            signUpQuestionBtn.addEventListener("click", getSignUpTemplate);
            logInQuestionBtn = parentEl.getElementsByClassName("login-question-btn")[0];
            logInQuestionBtn.addEventListener("click", getLogInTemplate);

            logInQuestionTemplate = parentEl.getElementsByClassName("login-question")[0];
            logInQuestionTemplate.remove();

            modal = parentEl.querySelector(".modal");
            loginBtnHeader = parentEl.querySelector(".login-btn-header");
            const closeButton = parentEl.querySelector(".close-button");
            loginBtnHeader.classList.remove("hide");
            loginBtnHeader.addEventListener("click", toggleModal);
            closeButton.addEventListener("click", toggleModal);
            window.addEventListener("click", windowOnClick);

        } else {
            const homeContent = parentEl.getElementsByClassName("home-content")[0];
            const childParagraph = document.createElement("p");

            childParagraph.textContent = "Congratulations! " + `${loggedInUser}` + " has successfully logged in."
            homeContent.appendChild(childParagraph);
            homeTemplate = parentEl.querySelector(".home-block");
            homeTemplate.classList.remove("hide");
        }
    }

    function toggleModal() {
        modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }

    function login() {
        const logForm = Array.from(document.getElementsByClassName("login-form")[0]);
        const logEmail = logForm[0].value;
        const logPassword = logForm[1].value;
        signUpQuestionTemplate = parentEl.getElementsByClassName("signup-question-wrapper")[0];

        if (
            !!logEmail.length &&
            !!logPassword.length &&
            findCredentials(loginsObj, logEmail, logPassword)
        ) {
            logInTemplate.remove();
            signUpQuestionTemplate.remove();
            parentEl.querySelector(".modal-section").classList.add("hide");
            
            localStorage.setItem("loggedInUser", JSON.stringify(logEmail));

            toggleModal();

            loginBtnHeader.remove(); 
        }
    };

    function findCredentials(obj, email, password) {
        for (const key in obj) {
            if (key === email && obj[key] === password) {
              return true;
            }
        }
        return false;
      }

    function getSignUpTemplate() {
        signUpQuestionTemplate = parentEl.getElementsByClassName("signup-question")[0];

        signUpTemplate.classList.remove("hide");
        logInTemplate.replaceWith(signUpTemplate);
        logInQuestionTemplate.classList.remove("hide");
        signUpQuestionTemplate.replaceWith(logInQuestionTemplate);
    }

    function getLogInTemplate() {
        getLocalStorageData(localStorage);
        signUpTemplate.replaceWith(logInTemplate);
        logInQuestionTemplate.replaceWith(signUpQuestionTemplate);
    }

    function signUp() {        
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
            console.log(signUpStore);
            loginsObj[signUpStore.email] = signUpStore.password;

            localStorage.setItem("usersLogins", JSON.stringify(loginsObj));            
        }

        console.log(signUpStore);
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

    function getLocalStorageData(storage) {
        if (isEmpty(storage)) {
            const mapFromLocalStorage = storage.getItem("usersLogins");
            const objFromLocalStorage = JSON.parse(mapFromLocalStorage);
            loggedInUser = JSON.parse(storage.getItem("loggedInUser"));
            loginsObj = objFromLocalStorage;
        }
    };

    function isLoggedInUser() {
        if (isEmpty(localStorage) && loggedInUser) {
            signUpQuestionTemplate = parentEl.getElementsByClassName("signup-question")[0];
            homeTemplate.classList.remove("hide");
            logInTemplate.replaceWith(homeTemplate);
            signUpQuestionTemplate.remove();
            const homeContent = parentEl.getElementsByClassName("home-content")[0];
            const childParagraph = document.createElement("p");
            
            childParagraph.textContent = "Congratulations! " + `${loggedInUser}` + " has successfully logged in.";

            homeContent.appendChild(childParagraph);
        }
    }
})()