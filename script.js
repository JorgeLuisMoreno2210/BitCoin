document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initLiveExchangeRates();
    initPlansSliderCenter();
    initPlanSelectionModal();
    initScrollAnimations();
});

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initLiveExchangeRates() {
    updateTimestamps();

    // Seleccionamos las filas de la tabla de monedas
    const currencyRows = document.querySelectorAll('.currency-table-container tr');
    
    // Actualiza ligeramente los valores cada 5 segundos para dar sensación de "Tiempo Real"
    setInterval(() => {
        currencyRows.forEach(row => {
            const priceCell = row.querySelector('.table__right');
            if (!priceCell) return;

            const trendSpan = priceCell.querySelector('span');
            const currentText = priceCell.childNodes[0].nodeValue.trim();
            let currentValue = parseFloat(currentText.replace('$', '').trim());

            if (!isNaN(currentValue)) {
                const delta = (Math.random() * 0.06 - 0.03);
                const newValue = Math.max(0.01, currentValue + delta).toFixed(2);
                
                priceCell.childNodes[0].nodeValue = `$ ${newValue} `;

                if (trendSpan) {
                    if (delta >= 0) {
                        trendSpan.classList.remove('down');
                        trendSpan.classList.add('rise');
                    } else {
                        trendSpan.classList.remove('rise');
                        trendSpan.classList.add('down');
                    }
                }
            }
        });
        updateTimestamps();
    }, 5000);
}

function updateTimestamps() {
    const now = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const formattedDate = `${day} ${month} ${hours}:${minutes}`;

    const currencyDateEl = document.querySelector('.currency-table-date p');
    const comissionDateEl = document.querySelector('.comission-table-date p');

    if (currencyDateEl) {
        currencyDateEl.innerHTML = `<b>Actualizado:</b> ${formattedDate}`;
    }
    if (comissionDateEl) {
        comissionDateEl.innerHTML = `<b>Actualizado:</b> ${formattedDate}`;
    }
}


function initPlansSliderCenter() {
    const slider = document.querySelector('.plans-container-slider');
    const recommendedCard = document.querySelector('.plans-container-card');

    if (slider && recommendedCard) {
        const scrollPosition = recommendedCard.offsetLeft - (slider.clientWidth / 2) + (recommendedCard.clientWidth / 2);
        slider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}


function initPlanSelectionModal() {
    const planButtons = document.querySelectorAll('.plan-card-calltoaction');

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'batata-modal';
    Object.assign(modalOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(32, 30, 28, 0.8)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        padding: '20px'
    });

    modalOverlay.innerHTML = `
        <div style="background: #faf8f7; padding: 30px; border-radius: 15px; max-width: 360px; width: 100%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif;">
            <span style="display: inline-block; background: #ffe9d5; color: #f7931a; font-weight: bold; padding: 5px 12px; border-radius: 20px; font-size: 1.2rem; margin-bottom: 15px;">Batatabit Suscripción</span>
            <h3 id="modal-plan-title" style="font-size: 2.2rem; color: #201e1c; margin-bottom: 10px;">Plan</h3>
            <p id="modal-plan-price" style="font-size: 3.6rem; font-weight: bold; color: #f7931a; margin-bottom: 10px;">$0</p>
            <p id="modal-plan-desc" style="font-size: 1.4rem; color: #757575; margin-bottom: 20px;">Descripción</p>
            <input type="email" id="modal-email" placeholder="Ingresa tu correo electrónico" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #bababa; border-radius: 6px; font-size: 1.4rem;">
            <div style="display: flex; gap: 10px;">
                <button id="modal-cancel" style="flex: 1; padding: 12px; border: 1px solid #bababa; background: #fff; border-radius: 6px; font-size: 1.4rem; font-weight: bold; cursor: pointer;">Cancelar</button>
                <button id="modal-confirm" style="flex: 1; padding: 12px; border: none; background: #f7931a; color: #fff; border-radius: 6px; font-size: 1.4rem; font-weight: bold; cursor: pointer;">Continuar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const titleEl = document.getElementById('modal-plan-title');
    const priceEl = document.getElementById('modal-plan-price');
    const descEl = document.getElementById('modal-plan-desc');
    const emailInput = document.getElementById('modal-email');

    planButtons.forEach(button => {
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            const card = button.closest('article');
            const title = card.querySelector('h3')?.textContent || 'Plan Batatabit';
            const price = card.querySelector('p[class*="price"]')?.textContent || '';
            const saving = card.querySelector('p[class*="saving"]')?.textContent || '';

            titleEl.textContent = title;
            priceEl.textContent = price;
            descEl.textContent = saving;
            emailInput.value = '';
            modalOverlay.style.display = 'flex';
        });
    });

    document.getElementById('modal-cancel').addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    });

    document.getElementById('modal-confirm').addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email || !email.includes('@')) {
            emailInput.style.borderColor = 'red';
            return;
        }
        emailInput.style.borderColor = '#bababa';
        alert(`¡Excelente! Hemos enviado los detalles de tu ${titleEl.textContent} a ${email}.`);
        modalOverlay.style.display = 'none';
    });
}


function initScrollAnimations() {
    const cards = document.querySelectorAll('.product-cards-container article');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}