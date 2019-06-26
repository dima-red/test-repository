const errorChecker = { 
    min: function (value, param) {
        return value.length && value.length >= param;
    },

    max: function (value, param) {
        return value.length <= param;
    },

    isValidEmail: function (value, param) {
        return param.test(value);
    },

    isTheSame: function (value, param) {
        return param.length && value === param;
    }
}

const inputReqs = {

    "reg-email": [
        {
            type: "min",
            param: 5
        },
    
        {
            type: "max",
            param: 15
        },
    
        {
            type: "isValidEmail",
            param: /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){0,3}\.[a-z]{2,3}$/
        }
    ],

    "reg-password": [
        {
            type: "min",
            param: 5
        },

        {
            type: "max",
            param: 15
        },
    ],

    "reg-re-password": [
        {
            type: "isTheSame",
            param: null
        },
    ],

    "log-email": [

    ],

    "log-password": [

    ]
};

const parentEl = document.querySelector("#bodyWrapper");

function checkInput(input) {
    for (let i = 0; i < inputReqs[input.className].length; i++) {
        const errorCheckerResult = errorChecker[inputReqs[input.className][i].type](input.value, inputReqs[input.className][i].param);
        if (!errorCheckerResult) {
            const formGroup = parentEl.getElementsByClassName(input.className)[0].parentElement;
            formGroup.classList.add("error");
            formGroup.getElementsByTagName("span")[i].classList.add("display");
        }
    }
}