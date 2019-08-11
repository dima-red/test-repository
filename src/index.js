(() => {
    this.typeOfOperation = null;
    const calcWrapper = document.querySelector(".calc-wrapper");
    init();

    // let displayValue = 0;

    function init() {
        
        const keyBtnArr = Array.from(calcWrapper.querySelectorAll(".key-btn"));
        keyBtnArr.forEach(item => item.addEventListener("click", calc));
    }

    function calc(ev) {
        let displayValue = calcWrapper.querySelector('.display').innerHTML;
        if(displayValue === "0") {
            calcWrapper.querySelector('.display').innerHTML = ev.target.dataset.btn;
        } else {
            calcWrapper.querySelector('.display').innerHTML += ev.target.dataset.btn;
        }

        if(ev.target.dataset.btn === "=") {
            debugger;
            const result = displayValue.split("").reduce((acc, item, index) => {
                
                if(!!parseInt(item)) {
                    if(!index) {
                        return acc += parseInt(item);
                    } else {
                        if(this.typeOfOperation === "+") {
                            return acc + parseInt(item);
                        } else if(this.typeOfOperation === "-") {
                            return acc - parseInt(item);
                        } else if(this.typeOfOperation === "x") {
                            return acc * parseInt(item);
                        } else if(this.typeOfOperation === "/") {
                            return acc / parseInt(item);
                        }
                    }
                } else {
                    this.typeOfOperation = item;
                    return acc;
                }
            }, 0)

            calcWrapper.querySelector('.display').innerHTML = result;
        }
    }
})();
