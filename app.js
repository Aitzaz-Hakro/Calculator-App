let currentInput = '';
let currentOperation = null;
let previousInput = '';
const display = document.getElementById('display');

function updateDisplay() {
    display.textContent = currentInput || '0';
}

function appendNumber(number) {
    // Prevent multiple zeros at the beginning
    if (currentInput === '0' && number === '0') return;
    
    // Replace single zero with new number
    if (currentInput === '0' && number !== '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    // Don't add decimal if already exists
    if (currentInput.includes('.')) return;
    
    // Add a leading zero if starting with decimal
    if (currentInput === '') {
        currentInput = '0';
    }
    
    currentInput += '.';
    updateDisplay();
}

function appendOperator(operator) {
    // If we have a pending operation, calculate it first
    if (currentOperation !== null && currentInput !== '') {
        calculate();
    }
    
    // Store the current number and operation
    previousInput = currentInput;
    currentOperation = operator;
    currentInput = '';
}

function calculate() {
    if (previousInput === '' || currentInput === '') return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (currentOperation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle errors and large numbers
    if (!isFinite(result)) {
        currentInput = 'Error';
    } else {
        // Format the result to avoid extremely long decimals
        currentInput = result.toString();
        if (currentInput.includes('.') && currentInput.split('.')[1].length > 10) {
            currentInput = result.toFixed(10).replace(/\.?0+$/, '');
        }
    }
    
    currentOperation = null;
    previousInput = '';
    updateDisplay();
}

function clearEntry() {
    currentInput = '';
    updateDisplay();
}

function clearAll() {
    currentInput = '';
    previousInput = '';
    currentOperation = null;
    updateDisplay();
}

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === 'Backspace') {
        clearEntry();
    }
});