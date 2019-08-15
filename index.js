class MyCalculator {
    calcWrapper = document.querySelector(".calc-wrapper");
    displayValueEl = this.calcWrapper.querySelector(".display");
    displayValue = 0;
    currentNumber = 0;
    mathExpression = [];
    mathAction = null;
    
    constructor() {
        Array
            .from(this.calcWrapper.querySelectorAll(".key-btn"))
            .forEach(el => el.addEventListener("click", this.onNumberBtnClicked.bind(this)));

        Array
            .from(this.calcWrapper.querySelectorAll(".action-btn"))
            .forEach(el => el.addEventListener("click", this.onMathActionBtnClicked.bind(this)));

        this.calcWrapper.querySelector(".result-btn").addEventListener("click", this.onResultBtnClicked.bind(this));
        this.calcWrapper.querySelector(".clean-btn").addEventListener("click", this.onCleanBtnClicked.bind(this));
       
    }

    onDisplay(value) {
        this.displayValueEl.innerHTML = value;
    }

    onNumberBtnClicked(ev) {
        const inputNumber = ev.target.dataset.btn;

        if(!parseInt(this.displayValue) && !this.mathAction) {
            this.displayValue = this.currentNumber = inputNumber;
            this.onDisplay(this.displayValue);
        } else if(parseInt(inputNumber) || parseInt(this.currentNumber)) {
            this.currentNumber += inputNumber;
            this.displayValue += inputNumber;
            this.onDisplay(this.displayValue);
        }
    }

    onMathActionBtnClicked(ev) {
        const mathActionSign = ev.target.dataset.action;
        
        if(!this.mathAction || this.currentNumber) {
            this.mathAction = mathActionSign;
            this.displayValue += mathActionSign;
            this.mathExpression.push(...[parseInt(this.currentNumber), this.mathAction]);
            this.currentNumber = "";
            this.onDisplay(this.displayValue);

        } else if(this.mathAction && this.mathAction !== mathActionSign && !this.currentNumber) {

            this.mathExpression.splice(this.mathExpression.lastIndexOf(this.mathAction), 1, mathActionSign);
            this.displayValue = this.mathExpression.join("");
            this.mathAction = mathActionSign;
            this.onDisplay(this.displayValue);
        }
    }

    onResultBtnClicked() {
        if(this.currentNumber) {
            this.mathExpression.push(parseInt(this.currentNumber));
            this.calc(this.mathExpression);
        } else {
            alert("Please, enter a number!");
        }
    }

    calc(arr) {
        const indexByMultiplication = arr.indexOf("x");
        const indexByDivision = arr.indexOf("/");
        const indexByAddition = arr.indexOf("+");
        const indexBySubstraction = arr.indexOf("-");

        if(indexByMultiplication < 0 && indexByDivision < 0 && indexByAddition < 0 && indexBySubstraction < 0) {
            this.onDisplay(arr[0]);
            this.currentNumber = this.displayValue = arr[0];
            this.mathExpression = [];
            this.mathAction = null;
        }

        if (indexByMultiplication > 0 && (indexByDivision < 0 || indexByMultiplication < indexByDivision)) {
            const multiplicationArr = arr.splice(indexByMultiplication - 1, 3);
            const resultItem = multiplicationArr[0] * multiplicationArr[2];
            arr.splice(indexByMultiplication -1, 0, resultItem);
            this.calc(arr);

        } else if(indexByDivision > 0 && (indexByMultiplication < 0 || indexByDivision < indexByMultiplication)) {
            const divisionArr = arr.splice(indexByDivision - 1, 3);
            const resultItem = divisionArr[0] / divisionArr[2];
            arr.splice(indexByDivision -1, 0, resultItem);
            this.calc(arr);

        } else if(indexByAddition > 0 && indexByMultiplication < 0 && indexByDivision < 0 && (indexBySubstraction < 0 || indexByAddition < indexBySubstraction)) {
            const additionArr = arr.splice(indexByAddition - 1, 3);
            const resultItem = additionArr[0] + additionArr[2];
            arr.splice(indexByAddition -1, 0, resultItem);
            this.calc(arr);

        } else if(indexBySubstraction > 0 && indexByMultiplication < 0 && indexByDivision < 0 && (indexByAddition < 0 || indexByAddition > indexBySubstraction)) {
            const substructionArr = arr.splice(indexBySubstraction - 1, 3);
            const resultItem = substructionArr[0] - substructionArr[2];
            arr.splice(indexBySubstraction -1, 0, resultItem);
            this.calc(arr);
        }
    }

    onCleanBtnClicked() {
        this.currentNumber = 0;
        this.displayValue = 0;
        this.mathExpression = [];
        this.mathAction = null;
        this.displayValueEl.innerHTML = 0;
    }
}

// new MyCalculator();

document.addEventListener('DOMContentLoaded', () => new MyCalculator());