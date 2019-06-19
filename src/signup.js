(() => {
    const signUpStore = {};

    this.parentEl = null;
    this.signUpTemplate = null;
    this.logInTemplate = null;
    this.homeTemplate = null;

    this.onInit = onInit;
    this.getSignUpTemplate = getSignUpTemplate;
    this.getLogInTemplate = getLogInTemplate;
    this.signUp = signUp;
    this.login = login;
    this.isEmpty = isEmpty;
    this.getLocalStorageData = getLocalStorageData;
    this.isLoggedInUser = isLoggedInUser;
    onInit();
    getLocalStorageData(localStorage);
    isLoggedInUser();
    

    function onInit() {
        console.log("onInit");

        this.parentEl = document.getElementsByClassName("major-content")[0];
        this.signUpTemplate = this.parentEl.getElementsByClassName("signup-block")[0];
        this.signUpTemplate.remove();
        this.logInTemplate = this.parentEl.getElementsByClassName("login-block")[0];
        this.loginBtn = this.parentEl.getElementsByClassName("login-btn")[0];
        this.loginBtn.onclick = this.login.bind(this);
        this.homeTemplate = this.parentEl.getElementsByClassName("home-block")[0];
        this.homeTemplate.remove();
        this.signUpQuestionBtn = this.parentEl.getElementsByClassName("signup-question-btn")[0];
        this.signUpQuestionBtn.onclick = this.getSignUpTemplate.bind(this);
        this.logInQuestionTemplate = this.parentEl.getElementsByClassName("login-question")[0];
        this.logInQuestionTemplate.remove();
    }

    function login() {
        const logForm = Array.from(document.getElementsByClassName("login-form")[0]);
        const emailInput = this.logInTemplate.getElementsByClassName("log-email")[0];
        const passwordInput = this.logInTemplate.getElementsByClassName("log-password")[0];
        const logEmail = logForm[0].value;
        const logPassword = logForm[1].value;
        this.signUpQuestionTemplate = this.parentEl.getElementsByClassName("signup-question")[0];
        this.logInQuestionTemplate = this.parentEl.getElementsByClassName("login-question")[0];

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
            signUpStore.email === logEmail &&
            signUpStore.password === logPassword
        ) {
            this.homeTemplate.classList.remove("hide");
            this.logInTemplate.replaceWith(this.homeTemplate);
            this.signUpQuestionTemplate.remove();

            const homeContent = this.parentEl.getElementsByClassName("home-content")[0];
            const childParagraph = document.createElement("p");
            childParagraph.textContent = "Congratulations! " + `${signUpStore.email}` + " has successfully logged in."

            homeContent.appendChild(childParagraph);


        }
    };

    function getSignUpTemplate() {
        this.signUpQuestionTemplate = this.parentEl.getElementsByClassName("signup-question")[0];

        this.signUpTemplate.classList.remove("hide");
        this.logInTemplate.replaceWith(this.signUpTemplate);
        this.logInQuestionTemplate.classList.remove("hide");
        this.signUpQuestionTemplate.replaceWith(this.logInQuestionTemplate);
        this.logInQuestionBtn = this.parentEl.getElementsByClassName("login-question-btn")[0];
        this.logInQuestionBtn.onclick = this.getLogInTemplate.bind(this);
    }

    function getLogInTemplate() {
        this.getLocalStorageData(localStorage);
        this.signUpTemplate.replaceWith(this.logInTemplate);
        this.logInQuestionTemplate.replaceWith(this.signUpQuestionTemplate);
        this.signUpQuestionBtn = this.parentEl.getElementsByClassName("signup-question-btn")[0];
        this.signUpQuestionBtn.onclick = this.getSignUpTemplate.bind(this);
    }

    function signUp() {
        const regForm = Array.from(document.getElementsByClassName("signup-form")[0]);
        const emailInput = this.signUpTemplate.getElementsByClassName("reg-email")[0];
        const passwordInput = this.signUpTemplate.getElementsByClassName("reg-password")[0];
        const repeatedPasswordlInput = this.signUpTemplate.getElementsByClassName("reg-rePassword")[0];
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
            this.logInTemplate.classList.remove("hide");
            this.signUpTemplate.replaceWith(this.logInTemplate);
            this.logInQuestionTemplate.replaceWith(this.signUpQuestionTemplate);
            
            const usersLogins = {};
            usersLogins[signUpStore.email] = signUpStore.password;
            localStorage.setItem("user1", JSON.stringify(usersLogins));
            localStorage.setItem("loggedInUser", signUpStore.email);
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
            const mapFromLocalStorage = storage.getItem("user1");
            const objFromLocalStorage = JSON.parse(mapFromLocalStorage);
            const loggedInUser = storage.getItem("loggedInUser");

            signUpStore.email = loggedInUser;
            signUpStore.password = objFromLocalStorage[loggedInUser];
        }
    };

    function isLoggedInUser() {
        if (this.isEmpty(localStorage) && signUpStore.email && signUpStore.email.length) {
            this.signUpQuestionTemplate = this.parentEl.getElementsByClassName("signup-question")[0];
            this.homeTemplate.classList.remove("hide");
            this.logInTemplate.replaceWith(this.homeTemplate);
            this.signUpQuestionTemplate.remove();
            const homeContent = this.parentEl.getElementsByClassName("home-content")[0];
            const childParagraph = document.createElement("p");
            
            childParagraph.textContent = "Congratulations! " + `${signUpStore.email}` + " has successfully logged in.";

            homeContent.appendChild(childParagraph);
        }
    }
})()