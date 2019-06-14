(()=>{
    console.log("onInit");
    const signUpStore = {};
    this.signUp = signUp;
    this.login = login;

    function signUp() {
        const form = Array.from(document.querySelector(".signup-form"));

        signUpStore.email = form[0].value;
        signUpStore.password = form[1].value;
        signUpStore.repeatedPassword = form[2].value;

        console.log(signUpStore);
    };

    function login() {
        console.log("Login");
    };

})()