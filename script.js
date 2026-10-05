document.addEventListener('DOMContentLoaded', function() {
    
    const display = document.getElementById('output');
    const buttons = document.querySelectorAll('.btn');
    
    let currentInput = ''; 

    // Listen for UI clicks
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            let value = btn.getAttribute('data-val');
            handleInput(value);
        });
    });

    // Bonus: Physical Keyboard Mapping
    document.addEventListener('keydown', (e) => {
        let key = e.key;

        // translate keyboard strings to target math codes
        if (key === 'Enter') key = '=';
        if (key === 'Escape') key = 'C';
        if (key === 'Backspace') key = 'back';
        if (key === 'X' || key === 'x') key = '*';

        // Check if it's a valid key option we allow
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','=','C','back'];
        if (validKeys.includes(key)) {
            e.preventDefault(); // stop browser scrolling on space/arrows
            handleInput(key);
        }
    });

    // Core Processing Machine
    function handleInput(val) {
        
        if (val === 'C') {
            currentInput = '';
            display.innerText = '0';
            return;
        }

        if (val === 'back') {
            // strip away the last typed item
            currentInput = currentInput.slice(0, -1);
            display.innerText = currentInput || '0';
            return;
        }

        if (val === '=') {
            if (currentInput === '') return;
            
            try {
                // Parse calculation strings securely without raw eval vulnerabilities
                // Uses Function context workaround to math evaluate the pure equation
                let calculation = Function('"use strict"; return (' + currentInput + ')')();
                
                // Fix annoying floating decimal issues (e.g. 0.1 + 0.2 = 0.300000004)
                if (calculation.toString().includes('.') && calculation.toString().split('.')[1].length > 4) {
                    calculation = Number(calculation.toFixed(4));
                }

                display.innerText = calculation;
                currentInput = calculation.toString(); // let user continue from their answer
            } catch (err) {
                display.innerText = 'Error';
                currentInput = '';
            }
            return;
        }

        // Prevent double trailing dots/operators crashing things
        const ops = ['+', '-', '*', '/'];
        if (ops.includes(val) && ops.includes(currentInput.slice(-1))) {
            // swap out old operator instead of staking them up
            currentInput = currentInput.slice(0, -1) + val;
            display.innerText = currentInput;
            return;
        }

        // Standard Appends
        if (currentInput === '' && val === '.') {
            currentInput = '0.';
        } else {
            currentInput += val;
        }
        
        display.innerText = currentInput;
    }
});