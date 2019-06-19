(() => {
    const signUpStore = {};

    if (isEmpty(localStorage)) {
        const mapFromLocalStorage = localStorage.getItem("user1");
        const arrFromLocalStorage = JSON.parse(mapFromLocalStorage);
        signUpStore.email = arrFromLocalStorage[0][0];
        signUpStore.password = arrFromLocalStorage[0][1];
        
        console.log(signUpStore);
    }

    this.parentEl = null;
    this.signUpTemplate = null;
    this.loginTemplate = null;
    this.homeTemplate = null;

    this.onInit = onInit;
    this.getSignUpTemplate = getSignUpTemplate;
    this.signUp = signUp;
    this.login = login;
    this.isEmpty = isEmpty;
    onInit();

    function onInit() {
        console.log("onInit");

        this.parentEl = document.getElementsByClassName("major-content")[0];
        this.signUpTemplate = this.parentEl.getElementsByClassName("signup-block")[0];
        this.signUpTemplate.remove();
        this.loginTemplate = this.parentEl.getElementsByClassName("login-block")[0];
        this.loginBtn = this.parentEl.getElementsByClassName("login-btn")[0];
        this.loginBtn.onclick = this.login.bind(this);
        this.homeTemplate = this.parentEl.getElementsByClassName("home-block")[0];
        this.homeTemplate.remove();
        this.signUpQuestionBtn = this.parentEl.getElementsByClassName("signup-question-btn")[0];
        this.signUpQuestionBtn.onclick = this.getSignUpTemplate;

        console.log(this.loginTemplate);
        console.log(this.signUpTemplate);
        console.log(this.homeTemplate);

    }

    function login() {
        console.log(this.loginTemplate);
        console.log(this.signUpTemplate);
        console.log(this.homeTemplate);
        const logForm = Array.from(document.getElementsByClassName("login-form")[0]);
        const logEmail = logForm[0].value;
        const logPassword = logForm[1].value;

        // if (signUpStore.email === logEmail && signUpStore.password === logPassword) {
        //     this.homeTemplate.classList.remove("hide");
        //     this.loginTemplate.replaceWith(this.homeTemplate);
        // }
    };

    function getSignUpTemplate () {
        console.log("signup request");
    }

    function signUp() {
        console.log(this.loginTemplate);
        console.log(this.signUpTemplate);
        console.log(this.homeTemplate);
        const regForm = Array.from(document.getElementsByClassName("signup-form")[0]);
        this.emailInput = this.signUpTemplate.getElementsByClassName("reg-email")[0];
        this.passwordInput = this.signUpTemplate.getElementsByClassName("reg-password")[0];
        this.repeatedPasswordlInput = this.signUpTemplate.getElementsByClassName("reg-rePassword")[0];

        signUpStore.email = regForm[0].value;
        signUpStore.password = regForm[1].value;
        signUpStore.repeatedPassword = regForm[2].value;

        if (!regForm[0].value.length) {
            this.emailInput.classList.add("error");
            this.emailInput.focus();
            this.emailInput.placeholder = "Please, type your email";
        } else {
            this.emailInput.classList.remove("error");
        }

        if (!regForm[1].value.length) {
            this.passwordInput.classList.add("error");
            this.passwordInput.focus();
            this.passwordInput.placeholder = "Please, type your password";
        } else {
            this.passwordInput.classList.remove("error");
        }

        if (!regForm[2].value.length) {
            this.repeatedPasswordlInput.classList.add("error");
            this.repeatedPasswordlInput.focus();
            this.repeatedPasswordlInput.placeholder = "Duplicate your password";
        } else {
            this.repeatedPasswordlInput.classList.remove("error");
        }

        if (
            isEmpty(signUpStore) &&
            !!signUpStore.password.length &&
            !!signUpStore.repeatedPassword.length &&
            signUpStore.password === signUpStore.repeatedPassword
            ) 
        {
            this.loginTemplate.classList.remove("hide");
            this.signUpTemplate.replaceWith(this.loginTemplate);

            const map = new Map();
            map.set(signUpStore.email, signUpStore.password);
            localStorage.setItem("user1", JSON.stringify([...map]));
            console.log(map);
        }

        console.log(signUpStore);
    };

    function isEmpty(obj) {
        const valuesArr = [];
      
        for (let val=0; val<Object.keys(obj).length; val++) {
          valuesArr.push(obj[Object.keys(obj)[val]].length);
        }

        const valuesLength = valuesArr.reduce((acc, curr) => {
          return acc + curr;
        }, 0);
      
        return !!valuesLength;
      };
})()