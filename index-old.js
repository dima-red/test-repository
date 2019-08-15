class MyCalculator {
    typeOfOperation = null;
    calcWrapper = document.querySelector(".calc-wrapper");
    displayValueEl = this.calcWrapper.querySelector(".display");
    displayValue = "0";
    firstNumber = "";
    secondNumber = "";
    mathActionValue = "";
    mathActionValueFlag = false;
    bufferNumber = null;
    bufferAction = null;
    bufferResult = null;
    inputNumbersflag = true;
    useBracketsFlag = false;
    canContinueFlag = false;

    constructor() {
        Array
            .from(this.calcWrapper.querySelectorAll(".key-btn"))
            .forEach(item => {
                item.addEventListener("click", this.inputNumbers.bind(this));
            });

        Array
            .from(this.calcWrapper.querySelectorAll(".action-btn"))
            .forEach(item => {
                item.addEventListener("click", this.mathAction.bind(this));
            });

        Array
            .from(this.calcWrapper.querySelectorAll(".bracket-btn"))
            .forEach(item =>{
                item.addEventListener("click", this.useBrackets.bind(this));
            });
            
        this.calcWrapper.querySelector(".result-btn").addEventListener("click", this.result.bind(this));
        this.calcWrapper.querySelector(".clean-btn").addEventListener("click", this.clean.bind(this));
    }

    display(ev) {
        const displayedData = ev.target.dataset;

        if(this.displayValue === "0") {
            if(displayedData.bracket) {
                alert('Please, enter a number!');
            } else if(displayedData.action) {
                this.displayValue += displayedData.action || displayedData.bracket;
                this.displayValueEl.innerHTML = this.displayValue;
            } else {
                this.displayValue = displayedData.btn;
                this.displayValueEl.innerHTML = this.displayValue;
            }
        } else if(displayedData.bracket && !this.bufferAction) {
            return;
        } else {
            if(this.mathActionValueFlag) {
                this.displayValue = this.firstNumber + this.mathActionValue;
                this.displayValueEl.innerHTML = this.displayValue;
                this.mathActionValueFlag = false;
            } else {
                this.displayValue += displayedData.btn || displayedData.action || displayedData.bracket;
                this.displayValueEl.innerHTML = this.displayValue;
            }
        }
    }

    inputNumbers(ev) {
        const inputData = ev.target.dataset.btn;
        
        if(this.canContinueFlag && inputData && !this.mathActionValue) {
            this.firstNumber = "";
            this.displayValue = "";
            this.displayValueEl.innerHTML = "";
            this.canContinueFlag = false;
        }

        this.inputNumbersflag ? this.firstNumber += inputData : this.secondNumber += inputData;
        this.display(ev);
    }

    mathAction(ev) {
        if (this.mathActionValue) {
            this.mathActionValueFlag = true;
        }
        this.inputNumbersflag = false;
        this.mathActionValue = ev.target.dataset.action;
        this.display(ev);
    }

    result(ev) {
        if(ev && ev.target.dataset.result && !this.useBracketsFlag && this.secondNumber) {
            this.displayValue = this.calc(this.firstNumber, this.secondNumber, this.mathActionValue);
            this.displayValueEl.innerHTML = this.displayValue;
            this.reset(this.displayValue);

            // console.log(this.firstNumber);
            // console.log(this.secondNumber);
            // console.log(this.mathActionValue);

        } else if(this.useBracketsFlag) {
            this.bufferResult = this.calc(this.firstNumber, this.secondNumber, this.mathActionValue);
            this.firstNumber = this.bufferNumber;
            this.mathActionValue = this.bufferAction;
            this.secondNumber = this.bufferResult;
            this.useBracketsFlag = false;
            
        } else if (!this.secondNumber) {
            alert('Please enter the second number!');
        }
    }

    useBrackets(ev) {
        const bracketsData = ev.target.dataset;

        if(bracketsData.bracket === ")" &&  !this.useBracketsFlag) {
            alert("You cannot use ')' without '('!");
        } else if(bracketsData && this.displayValue === "0") {
            return;
        } else if(bracketsData && !this.mathActionValue) {
            alert('Please, select a Math action!');
        } else if(bracketsData.bracket === "(" && !this.useBracketsFlag) {
            this.bufferNumber = this.firstNumber;
            this.bufferAction = this.mathActionValue;
            this.firstNumber = "";
            this.mathActionValue = "";
            this.inputNumbersflag = true;
            this.useBracketsFlag = true;

            console.info('transfer rights');
        }

        if(bracketsData.bracket === ")" && this.useBracketsFlag) {
            this.result();
        }
        this.display(ev);
    }

    calc(n1, n2, operator) {
        let result = null;
        switch (operator) {
            case "+":
                result = (parseInt(n1) + parseInt(n2)).toString();
                return result;
            case "-":
                result = (parseInt(n1) - parseInt(n2)).toString();
                return result;
            case "x":
                result = (parseInt(n1) * parseInt(n2)).toString();
                return result;
            case "/":
                result = (parseInt(n1) / parseInt(n2)).toString();
                return result;
        }
    }

    reset(result) {
        this.firstNumber = result;
        this.inputNumbersflag = true;
        this.secondNumber = "";
        this.mathActionValue = "";
        this.canContinueFlag = true;
    }

    clean() {
        this.firstNumber = "";
        this.inputNumbersflag = true;
        this.secondNumber = "";
        this.displayValue = "0";
        this.displayValueEl.innerHTML = "0";
    }
}

// new MyCalculator();

document.addEventListener('DOMContentLoaded', () => new MyCalculator());
