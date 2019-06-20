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

    this.onInit = onInit;
    this.getSignUpTemplate = getSignUpTemplate;
    this.getLogInTemplate = getLogInTemplate;
    this.signUp = signUp;
    this.login = login;
    this.isEmpty = isEmpty;
    this.getLocalStorageData = getLocalStorageData;
    this.isLoggedInUser = isLoggedInUser;
    this.findCredentials = findCredentials;
    
    getLocalStorageData(localStorage);
    onInit();
    isLoggedInUser();
    
    console.log(loginsObj);


    
    function onInit() {
        console.log("onInit");
        
        parentEl = document.getElementsByClassName("major-content")[0];
        signUpTemplate = parentEl.getElementsByClassName("signup-block")[0];
        signupBtn = parentEl.getElementsByClassName("signup-btn")[0];
        signupBtn.onclick = this.signUp.bind(this);
        signUpTemplate.remove();
        logInTemplate = parentEl.getElementsByClassName("login-block")[0];
        loginBtn = parentEl.getElementsByClassName("login-btn")[0];
        loginBtn.onclick = this.login.bind(this);
        
        homeTemplate = parentEl.getElementsByClassName("home-block")[0];
        homeTemplate.remove();
        this.signUpQuestionBtn = parentEl.getElementsByClassName("signup-question-btn")[0];
        this.signUpQuestionBtn.onclick = this.getSignUpTemplate.bind(this);
        logInQuestionTemplate = parentEl.getElementsByClassName("login-question")[0];
        logInQuestionTemplate.remove();
    }

    function login() {
        const logForm = Array.from(document.getElementsByClassName("login-form")[0]);
        const emailInput = logInTemplate.getElementsByClassName("log-email")[0];
        const passwordInput = logInTemplate.getElementsByClassName("log-password")[0];
        const logEmail = logForm[0].value;
        const logPassword = logForm[1].value;
        signUpQuestionTemplate = parentEl.getElementsByClassName("signup-question")[0];
        logInQuestionTemplate = parentEl.getElementsByClassName("login-question")[0];

        if (!logEmail.length) {
            emailInput.classList.add("error");
            emailInput.focus();
            emailInput.placeholder = "Please, type your email";
        } else {
            emailInput.classList.remove("error");
        }

        if (!logPassword.length) {
            passwordInput.classList.add("error");
            passwordInput.focus();
            passwordInput.placeholder = "Please, type your password";
        } else {
            passwordInput.classList.remove("error");
        }

        if (
            !!logEmail.length &&
            !!logPassword.length &&
            this.findCredentials(loginsObj, logEmail, logPassword)
        ) {
            homeTemplate.classList.remove("hide");
            logInTemplate.replaceWith(homeTemplate);
            signUpQuestionTemplate.remove();

            const homeContent = parentEl.getElementsByClassName("home-content")[0];
            const childParagraph = document.createElement("p");
            childParagraph.textContent = "Congratulations! " + `${signUpStore.email}` + " has successfully logged in."

            homeContent.appendChild(childParagraph);

            localStorage.setItem("loggedInUser", JSON.stringify(logEmail));
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
        this.logInQuestionBtn = parentEl.getElementsByClassName("login-question-btn")[0];
        this.logInQuestionBtn.onclick = this.getLogInTemplate.bind(this);
    }

    function getLogInTemplate() {
        this.getLocalStorageData(localStorage);
        signUpTemplate.replaceWith(logInTemplate);
        logInQuestionTemplate.replaceWith(signUpQuestionTemplate);
        this.signUpQuestionBtn = parentEl.getElementsByClassName("signup-question-btn")[0];
        this.signUpQuestionBtn.onclick = this.getSignUpTemplate.bind(this);
    }

    function signUp() {
        const regForm = Array.from(document.getElementsByClassName("signup-form")[0]);
        const emailInput = signUpTemplate.getElementsByClassName("reg-email")[0];
        const passwordInput = signUpTemplate.getElementsByClassName("reg-password")[0];
        const repeatedPasswordlInput = signUpTemplate.getElementsByClassName("reg-rePassword")[0];
        const regEmail = regForm[0].value;
        const regPassword = regForm[1].value;
        const regRePassword = regForm[2].value;

        signUpStore.email = regForm[0].value;
        signUpStore.password = regForm[1].value;
        signUpStore.repeatedPassword = regForm[2].value;

        if (!regEmail.length) {
            emailInput.classList.add("error");
            emailInput.focus();
            emailInput.placeholder = "Please, type your email";
        } else {
            emailInput.classList.remove("error");
        }

        if (!regPassword.length) {
            passwordInput.classList.add("error");
            passwordInput.focus();
            passwordInput.placeholder = "Please, type your password";
        } else {
            passwordInput.classList.remove("error");
        }

        if (!regRePassword.length) {
            repeatedPasswordlInput.classList.add("error");
            repeatedPasswordlInput.focus();
            repeatedPasswordlInput.placeholder = "Duplicate your password";
        } else {
            repeatedPasswordlInput.classList.remove("error");
        }

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
        if (this.isEmpty(storage)) {
            const mapFromLocalStorage = storage.getItem("usersLogins");
            const objFromLocalStorage = JSON.parse(mapFromLocalStorage);
            loggedInUser = JSON.parse(storage.getItem("loggedInUser"));
            loginsObj = objFromLocalStorage;
        }
    };

    function isLoggedInUser() {
        if (this.isEmpty(localStorage) && loggedInUser) {
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