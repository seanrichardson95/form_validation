const errorMessages = {
  first: "Do not leave this empty",
  last: "Do not leave this empty",
  email: "Do not leave this empty. Format is: example@example.com",
  password: "Do not leave this empty. Must be at least 10 characters",
  phone: "Format is 111-222-3333",
  form: "Fix errors before submitting this form"
}

function createErrorMessage(elementName) {
  let errorMessage = document.createElement('span');
  errorMessage.textContent = errorMessages[elementName];
  return errorMessage;
}

function urlEncodedForm(form) {
  let data = new FormData(form);
  let urlString = '';
  let ccString = 'cc=';
  for (let pair of data.entries()) {
    if (pair[0].slice(0, 2) !== 'cc' && pair[1].length > 0) {
      urlString += `${pair[0]}=${encodeURI(pair[1])}&`;
    } else {
      ccString += pair[1];
    }
  }

  if (ccString !== 'cc=') { // if there is a CC string...
    return urlString + ccString;
  } else { // if not CC string, get rid of last &
    return urlString.slice(0, -1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('input[name="first"]');
  const last = document.querySelector('input[name="last"]');
  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');
  const phone = document.querySelector('input[name="phone"]');
  const fieldset = document.querySelector('fieldset');
  const form = document.querySelector('form');
  const first3CCs = [...document.getElementsByClassName('cc')].slice(0, 3);

  fieldset.addEventListener('focusout', (e) => {
    let input = e.target;
    if (e.currentTarget === input) return;
    if (input.validationMessage !== "") {
      input.classList.add('invalid');

      if (input.nextElementSibling.tagName !== 'SPAN') {
        let errorMessage = createErrorMessage([input.name])
        input.insertAdjacentElement('afterend', errorMessage);
      }
    } else if (input.nextElementSibling && input.nextElementSibling.tagName === 'SPAN') {
      input.nextElementSibling.remove();
    }

    if (form.firstElementChild.tagName === 'SPAN') {
      if (form.checkValidity()) form.firstElementChild.remove()
    }
  });

  fieldset.addEventListener('focusin', (e) => {
    let input = e.target;
    if (e.currentTarget === input || input.tagName === 'BUTTON') return;
    input.classList.remove('invalid');
    if (input.nextElementSibling && input.nextElementSibling.tagName === 'SPAN') input.nextElementSibling.remove();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      if (form.firstElementChild.tagName !== 'SPAN') {
        let errorMessage = createErrorMessage('form');
        form.insertAdjacentElement('afterbegin', errorMessage)
      }
    } else {
      let serializedForm = document.createElement('div');
      let heading = document.createElement('h2');
      heading.textContent = 'Serialized Form';
      serializedForm.appendChild(heading);
      let serializedFormBody = document.createElement('p');
      serializedFormBody.textContent = urlEncodedForm(form);
      serializedForm.appendChild(serializedFormBody);
      document.body.appendChild(serializedForm);
      // create url query string
      // add it to the paragraph text content in #serialized
      // concat 4 credit card inputs into a single value before adding it to the request body string
      // render the form data as text in the block element I created earlier
    }
  });

  fieldset.addEventListener('keypress', (e) => {
    let input = e.target;
    if (input.name === 'first' || input.name === 'last') {
      e.preventDefault()
      if (/[a-zA-Z'\s]/.test(e.key)) input.value += e.key;
    } else if ([...input.classList].includes('cc')) {
      e.preventDefault();
      if (/\d/.test(e.key)) input.value += e.key;
      if (input.value.length === 4 && input.name !== 'cc4') {
        let currentCCNum = input.name.slice(-1);
        let nextNum = String(Number(currentCCNum) + 1);
        let nextCCInput = document.querySelector(`input[name=cc${nextNum}]`);
        nextCCInput.focus()
      }
    } else if (input.name === 'phone') {
      e.preventDefault();
      if (input.value.length === 3 || input.value.length === 7) {
        if (/-/.test(e.key)) input.value += e.key;
      } else if (/\d/.test(e.key)) {
        input.value += e.key;
      }
    }
  })
})
