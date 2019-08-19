import "./styles.scss";

class MyCalculator {
    calcWrapper = document.querySelector(".calc-wrapper");
    displayValueEl = this.calcWrapper.querySelector(".display");
    displayValue = 0;
    currentNumber = 0;
    mathExpression = [];
    mathAction = null;
    amountItemsForReplacing = 3;
    numbers = ["1","2","3","4","5","6","7","8","9","0"];
    actions = ["/", "*","-","+"];
    result = "Enter";
    clean = "Backspace";
    
    constructor() {
        Array
            .from(this.calcWrapper.querySelectorAll(".key-btn"))
            .forEach(el => el.addEventListener("click", this.onNumberBtnClicked.bind(this)));

        Array
            .from(this.calcWrapper.querySelectorAll(".action-btn"))
            .forEach(el => el.addEventListener("click", this.onMathActionBtnClicked.bind(this)));

        this.calcWrapper.querySelector(".result-btn").addEventListener("click", this.onResultBtnClicked.bind(this));
        this.calcWrapper.querySelector(".clean-btn").addEventListener("click", this.onCleanBtnClicked.bind(this));
        document.addEventListener("keydown", this.keyBoardHandler.bind(this));
       
    }

    onDisplay(value) {
        this.displayValueEl.innerHTML = value;
    }

    onNumberBtnClicked(ev) {
        const inputNumber = ev.target ? ev.target.dataset.btn : ev;

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
        const mathActionSign = ev.target ? ev.target.dataset.action : ev;
        
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
        console.log(arr);
        const indexByMultiplication = arr.indexOf("*");
        const indexByDivision = arr.indexOf("/");
        const indexByAddition = arr.indexOf("+");
        const indexBySubstraction = arr.indexOf("-");

        if(indexByMultiplication < 0 && indexByDivision < 0 && indexByAddition < 0 && indexBySubstraction < 0) {
            this.onDisplay(arr[0]);
            this.currentNumber = this.displayValue = arr[0];
            this.mathExpression = [];
            this.mathAction = null;
            console.log(arr);
        }

        if (indexByMultiplication > 0 && (indexByDivision < 0 || indexByMultiplication < indexByDivision)) {
            const multiplicationArr = arr.splice(indexByMultiplication - 1, this.amountItemsForReplacing);
            const resultItem = multiplicationArr[0] * multiplicationArr[2];
            arr.splice(indexByMultiplication -1, 0, resultItem);
            this.calc(arr);

        } else if(indexByDivision > 0 && (indexByMultiplication < 0 || indexByDivision < indexByMultiplication)) {
            const divisionArr = arr.splice(indexByDivision - 1, this.amountItemsForReplacing);
            const resultItem = divisionArr[0] / divisionArr[2];
            arr.splice(indexByDivision -1, 0, resultItem);
            this.calc(arr);

        } else if(indexByAddition > 0 && indexByMultiplication < 0 && indexByDivision < 0 && (indexBySubstraction < 0 || indexByAddition < indexBySubstraction)) {
            const additionArr = arr.splice(indexByAddition - 1, this.amountItemsForReplacing);
            const resultItem = additionArr[0] + additionArr[2];
            arr.splice(indexByAddition -1, 0, resultItem);
            this.calc(arr);

        } else if(indexBySubstraction > 0 && indexByMultiplication < 0 && indexByDivision < 0 && (indexByAddition < 0 || indexByAddition > indexBySubstraction)) {
            const substructionArr = arr.splice(indexBySubstraction - 1, this.amountItemsForReplacing);
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

    keyBoardHandler(ev) {
        if(this.numbers.some(item => item === ev.key)) {
            return this.onNumberBtnClicked(ev.key);
        } else if(this.actions.some(item => item === ev.key)) {
            return this.onMathActionBtnClicked(ev.key);
        } else if(this.result === ev.key) {
            return this.onResultBtnClicked();
        } else if(this.clean === ev.key) {
            return this.onCleanBtnClicked();
        }
    }
}

// new MyCalculator();

document.addEventListener('DOMContentLoaded', () => new MyCalculator());