const model = document.querySelector('.model');
const openModel = document.querySelector('.open-model');
const iconClose = document.querySelector('.fa-times');
const btnClose = document.querySelector('.btn-close button');

function toggleClass() {
    model.classList.toggle('hidden');
}

openModel.addEventListener('click', toggleClass);
iconClose.addEventListener('click', toggleClass);
btnClose.addEventListener('click', toggleClass);
model.addEventListener('click', (e) => {
    if(e.target == model) toggleClass();
});

