//constructor function
function Validator(options) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        let errorMessage;
        let errorElement = getParent(inputElement, options.form_group).querySelector(options.form_message);

        //lấy ra các rules của selector
        let rules = selectorRules[rule.selector];

        //lặp qua các rules và kiểm tra
        //Nếu có lỗi dừng kiểm tra
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
            
                default:
                    errorMessage = rules[i](inputElement.value);
                    break;
            }
            //console.log(errorMessage);
            if(errorMessage) break;
        }


        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.form_group).classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.form_group).classList.remove('invalid');
        }

        return !errorMessage;
    }

    //lấy element của form cần validate
    const formElement = document.querySelector(options.form);
    
    formElement.onsubmit = (e) => {
        e.preventDefault();

        let isFormValid = true;

        options.rules.forEach(rule => {
            let inputElement = formElement.querySelector(rule.selector);
            let isValid = validate(inputElement, rule);

            if (!isValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Trường hợp submit với javascript
            if (typeof options.onSubmit == 'function') {
                const enableInput = formElement.querySelectorAll('[name]');

                const formValue = Array.from(enableInput).reduce((values, input) => {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value;
                            break;
                        case 'checkbox':
                            // if(!input.matches(':checked')) {
                            //     values[input.name] = '';
                            //     return values;
                            // }
                            if(!Array.isArray(values[input.name])){
                                values[input.name] = [];
                            }
                            if (input.matches(':checked')) {
                                values[input.name].push(input.value);
                            }
                            if(values[input.name].length == 0) {
                                values[input.name] = '';
                            }
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                            break;
                    }
                    return values;
                }, {});

                options.onSubmit(formValue)
            }
            // Trường hợp submit với hành vi mặc định
            else {
                formElement.submit();
            }
        }
    }

    //Lặp qua mỗi rule và xử lý sự kiện
    options.rules.forEach(rule => {
        
        //Lưu lại các rules cho mỗi input
        if (Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test);
        } else {
            selectorRules[rule.selector] = [rule.test];
        }

        let inputElements = formElement.querySelectorAll(rule.selector);

        Array.from(inputElements).forEach(inputElement => {
            let errorElement = getParent(inputElement, options.form_group).querySelector(options.form_message);
    
            // Xử lý trường hợp blur khỏi input
            inputElement.onblur = () => {
                validate(inputElement, rule);
            }
            
            //xử lý trường hợp khi user nhập vào input
            inputElement.oninput = () => {
                errorElement.innerHTML = '';
                getParent(inputElement, options.form_group).classList.remove('invalid');
            }

            inputElement.onclick = () => {
                errorElement.innerHTML = '';
                getParent(inputElement, options.form_group).classList.remove('invalid');
            }
        });
    });
}

Validator.isRequired = (selector, message) => {
    return {
        selector,
        test(value) {
            return value ? undefined : message || 'Vui lòng nhập trường này';
        }
    };
}

Validator.isEmail = (selector, message) => {
    return {
        selector,
        test(value) {
            const regax = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regax.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}

Validator.minLength = (selector, min, message) => {
    return {
        selector,
        test(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    };
}

Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector,
        test(value) {
            return value === getConfirmValue() ? undefined : message || `Giá trị trị nhập vào không chính xác`;
        }
    };
}