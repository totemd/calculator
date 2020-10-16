function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return (b == 0) ? ERROR_MESSAGE : a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case "plus":
            return add(a, b);
        case "minus":
            return subtract(a, b);
        case "times":
            return multiply(a, b);
        case "over":
            return divide(a, b);
        default:
            return "Operator not recognized";
    }
}

function toPrecisionString(number, precision) {
    let output;
    if (number === ERROR_MESSAGE) {
        return ERROR_MESSAGE;
    }
    if (number === null || number === "") {
        return "";
    }
    number = +number;
    if (number < 1) {
        output = number.toPrecision(precision - 2) / 1;
    } else {
        output = number.toPrecision(precision) / 1;
    } 
    if (output.toString().length > 12) {
        output = "overflow";
    }
    return output.toString();
}

function userInput(button) {
    console.log(button);
    switch (button.classList[1]) {
        case "operand":
            calculator.inputOperand(button.value);
            break;
        case "operator":
            calculator.inputOperator(button.value);
            break;
        case "floating-point":
            calculator.inputFloatingPoint();
            break;
        case "toggle-sign":
            calculator.toggleSign();
            break;
        case "clear":
            calculator.clear();
            break;
        case "backspace":
            calculator.backspace();
            break;
    }
    calculator.updateDisplay();
}

const container = document.querySelector(".container");
container.addEventListener("click", (e) => userInput(e.target));

document.addEventListener("keydown", (e) => {
    const key = document.querySelector(`button[data-key="${e.code}"]`);
    if (key) {
        userInput(key);
    }
});

const calcDisplay = container.querySelector(".calculation");
const resultDisplay = container.querySelector(".result");

const OPERATORS_DISPLAY = {
    "plus": "+",
    "minus": "-",
    "times": "*",
    "over": "/",
    "equal": "=",
}

const ERROR_MESSAGE = "nice try";

const calculator = {
    currentOperand: null,
    firstOperand: null,
    secondOperand: null,
    ans: null,
    activeOperator: "",

    // Append input operand in currentOperand
    inputOperand(operand) {
        if (this.ans != null) {
            this.clear();
        }
        this.currentOperand = (this.currentOperand === null) ? operand : this.currentOperand + operand;
    },

    // When a operator is input :
    // - If currentOperand is empty : 
    //      - If there is a previous evaluation (ans is not empty) : store it in the firstOperand and reset ans
    //      - If the operator is not "equal", reset secondOperand and ans (otherwise it will evaluate later)
    // - Else :
    // - If firstOperand is empty : store currentOperand in firstOperand, and reset currentOperand
    // - If firstOperand is not empty : store currentOperand in secondOperand, and reset currentOperand
    // After either of these cases, if the operator is the "equal" input, evaluate ; otherwise change activeOperator
    inputOperator(operator) {
        if (this.currentOperand === null) {
            if (this.ans) {
                this.firstOperand = this.ans;
                this.ans = null;
            } else {
                this.firstOperand = "0";
            }
            if (operator !== "equal") {
                this.secondOperand = null;
                this.ans = null;
            }
        } else {
            if (this.firstOperand === null) {
                this.firstOperand = this.currentOperand;
                this.currentOperand = null;
            } else {
                this.secondOperand = this.currentOperand;
                this.currentOperand = null;
            }
        }
        if (operator === "equal") {
            this.evaluate();
        } else {
            this.activeOperator = operator;
        }
    },

    // Evaluate the current operation, store it in ans, and reset the currentOperand
    // - If both operands have a value, operate normally
    // - If only firstOperand has a value, store it in ans, and reset the activeOperator
    evaluate() {
        if (this.firstOperand && this.secondOperand) {
            this.ans = operate(this.activeOperator, +this.firstOperand, +this.secondOperand).toString();
        } else if (this.firstOperand && !this.secondOperand) {
            this.activeOperator = "";
            this.ans = this.firstOperand;
        }
        this.currentOperand = null;
    },

    toggleSign() {
        if (this.currentOperand) {
            this.currentOperand = (-1 * +this.currentOperand).toString();
        } if (this.ans) {
            this.ans = (-1 * +this.ans).toString();
        }
    },

    inputFloatingPoint() {
        if (this.currentOperand === null) {
            this.currentOperand = "0";
        }
        if (this.currentOperand.indexOf(".") === -1) {
            this.currentOperand += ".";
        }
    },

    clear() {
        this.currentOperand = null;
        this.firstOperand = null;
        this.secondOperand = null;
        this.activeOperator = "";
        this.ans = null;
    },

    backspace() {
        if (this.currentOperand !== null) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        if (this.currentOperand === "") {
            this.currentOperand = null;
        }
    },

    // The display has 2 lines, the main one, and a secodary, smaller one above it
    // The secondary line displays the running operation
    //      The running operation is a concatenation of 4 parts :
    //          1. The first operand or the current operand or "0" (if everything is empty)
    //          2. The active operation if it exists
    //          3. The second operand or the current operand or nothing
    //          4. The equal sign or nothing
    // The main one displays the evaluation
    updateDisplay() {
        let runningOperation = "";
        runningOperation += toPrecisionString(this.firstOperand, 12) || this.currentOperand || "0";
        runningOperation += (this.activeOperator) ? ` ${OPERATORS_DISPLAY[this.activeOperator]} ` : "";
        runningOperation += (this.firstOperand !== null) ? toPrecisionString(this.secondOperand, 12) || this.currentOperand || "" : "";
        runningOperation += (this.ans) ? " =" : "";

        calcDisplay.textContent = runningOperation;
        resultDisplay.textContent = (this.ans) ? toPrecisionString(this.ans, 12) : "";
    },
}

calculator.clear();
calculator.updateDisplay();


