const counter = document.querySelector('.counter');
const counterInput = document.querySelector('#counter__input');
const counterBtnUp = document.querySelector('.counter__btn--up');
const counterBtnDown = document.querySelector('.counter__btn--down');

let count = Number.parseInt(counterInput.value, 10); // получение значения


// увеличение значения 
counterBtnUp.addEventListener('click', (e) => {
  e.preventDefault();

  count++;

  if (count === 1) {
    counterBtnDown.setAttribute("disabled", "");
  }
  else {
    counterBtnDown.removeAttribute("disabled", "");
  }

  if (count === 10) {
    counterBtnUp.setAttribute("disabled", "");
  }
  else {
    counterBtnUp.removeAttribute("disabled", "");
  }

  counterInput.value = count;

});


// уменьшение значения
counterBtnDown.addEventListener('click', (e) => {
  e.preventDefault();

  count--;

  if (count === 1) {
    counterBtnDown.setAttribute("disabled", "");
  } else {
    
  }

  if (count === 10) {
    counterBtnUp.setAttribute("disabled", "");
  }
  else {
    counterBtnUp.removeAttribute("disabled", "");
  }

  counterInput.value = count;
});