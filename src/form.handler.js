const errorChecker = {
    min: function (value, param) {
        return value.length >= param;
    },

    max: function (value, param) {
        return value.length <= param;
    },

    isValidEmail: function (value, param) {
        return param.test(value);
    },

    isTheSame: function (value, param) {
        return value === param;
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

const parentEl = document.getElementsByClassName("major-content")[0];

function checkInput(inputName, inputValue) {
    for (let i = 0; i < inputReqs[inputName].length; i++) {
        const condition = errorChecker[inputReqs[inputName][i].type](inputValue, inputReqs[inputName][i].param);
        if (!condition) {
            const formGroup = parentEl.getElementsByClassName(inputName)[0].parentElement;
            formGroup.classList.add("error");
            formGroup.getElementsByTagName("span")[i].classList.add("display");
        }
    }
}