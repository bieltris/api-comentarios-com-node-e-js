
const popUpsAbertos = [];
export let lastDeleteCommentClicked = null;

export function togglePopUp(target) {
    const popUpId = target.dataset.popUpId;

    if(target.classList.contains('delete-comment')) {
        lastDeleteCommentClicked = target;
    }

    if (!popUpsAbertos.includes(popUpId)) {
        openPopUp(target, popUpId);
        popUpsAbertos.push(popUpId);
    } else {
        closePopUp(target);
        popUpsAbertos
    }
}


function openPopUp(btn, popUpId) {
    const popUp = document.getElementById(popUpId);
    if (!popUp) {
        console.error(`Elemento do pop-up com ID "${popUpId}" não foi encontrado.`);
        return;
    }

    const rect = btn.getBoundingClientRect();

    document.body.appendChild(popUp);
    popUp.style.visibility = 'hidden';

    const popUpHeight = popUp.offsetHeight;
    const popUpWidth = popUp.offsetWidth;
    let popUpTop = rect.top + window.scrollY - popUpHeight - 10;
    let popUpLeft = rect.left + window.scrollX;

    if (popUpTop < window.scrollY) {
        popUpTop = rect.bottom + window.scrollY + 10;
    }

    if ((popUpLeft + popUpWidth) > window.innerWidth) {
        popUpLeft = rect.right + window.scrollX - popUpWidth;
    }

    if (popUpLeft < 0) {

        popUpLeft = 0;
    }


    popUp.style.top = `${popUpTop}px`;
    popUp.style.left = `${popUpLeft}px`;

    popUp.style.visibility = 'visible';

    popUp.classList.add('is-open');
}

export function closePopUp(target) {
    let popUpId = target.dataset.popUpId;
    if(!popUpId) {
        popUpId = target.closest('.pop-up').id;
    }
    const popUp = document.getElementById(popUpId);
    if (!popUp) {
        console.error(`Elemento do pop-up com ID "${popUpId}" não foi encontrado.`);
        return;
    }
    const popUpDiv = document.querySelector('.pop-ups');
    const index = popUpsAbertos.indexOf(popUpId);
    popUpsAbertos[index] = false;
    popUp.classList.add('is-closed');
    popUp.addEventListener('animationend', function close() {
        popUp.classList.remove('is-closed');
        popUp.removeEventListener('animationend', close);
    popUpDiv.appendChild(popUp);
    })
}
