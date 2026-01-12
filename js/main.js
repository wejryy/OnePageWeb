document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    loadStances();
    loadClan();
    loadArmor();
    loadItems();
    loadLocations();
    loadLocations();
    loadLegends();
    loadTechniques();
    setupContactForm();
    setupParallax();
    setupParallax();
    setupModals();
}

function setupModals() {
    const navLinks = document.querySelectorAll('.nav-link');
    const closeBtns = document.querySelectorAll('.close-btn');
    const overlays = document.querySelectorAll('.modal-overlay');

    // Open Modals
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-view');
            if (viewId === 'hero') {
                closeAllModals(); // "Home" just closes everything
            } else {
                openModal(viewId);
            }
        });
    });

    // Close Modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Click outside to close
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openModal(viewId) {
    closeAllModals(); // Close others first
    const modal = document.getElementById(viewId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = ''; // Restore scrolling
}

async function loadLegends() {
    const data = await fetchData('data/legends.json');
    const container = document.getElementById('legends-grid');
    if (!container) return;

    container.innerHTML = data.map(cls => `
        <div class="card legend-card" style="border: 1px solid #c0392b; box-shadow: 0 0 15px rgba(192, 57, 43, 0.2);">
            <h3 style="color: #e74c3c;">${cls.class}</h3>
            <span class="badge" style="background: #c0392b; color: #fff;">${cls.role}</span>
            <p style="margin-top: 0.5rem; font-weight: bold; color: #fff;">Ult: ${cls.ultimate}</p>
            <p style="margin-top: 0.5rem; font-size: 0.9rem;">${cls.description}</p>
        </div>
    `).join('');
}

function setupParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > window.innerHeight) return;
        const scaleValue = 1 + (scrollY * 0.0005);
        heroBg.style.transform = `scale(${scaleValue})`;
    });
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error("Fetch failed: ", e);
        return [];
    }
}

async function loadStances() {
    const data = await fetchData('data/stances.json');
    const container = document.getElementById('stances-grid');
    if (!container) return;

    container.innerHTML = data.map(stance => `
        <div class="card stance-card">
            <h3>${stance.name}</h3>
            <p><strong>Effective Against:</strong> ${stance.effective_against}</p>
            <p>${stance.description}</p>
        </div>
    `).join('');
}

async function loadClan() {
    const data = await fetchData('data/clan.json');
    const listContainer = document.getElementById('character-list');
    const displayContainer = document.getElementById('character-display');

    if (!listContainer || !displayContainer) return;

    // Render List
    listContainer.innerHTML = data.map((char, index) => `
        <button class="char-btn" data-index="${index}">
            ${char.name}
        </button>
    `).join('');

    const buttons = listContainer.querySelectorAll('.char-btn');

    // Click Handler
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Render Details
            const index = btn.getAttribute('data-index');
            renderCharacterDetail(data[index], displayContainer);
        });
    });

    // Select first by default if data exists
    if (data.length > 0 && buttons[0]) {
        buttons[0].click();
    }
}

function renderCharacterDetail(char, container) {
    // Fade out first
    container.classList.remove('active');

    setTimeout(() => {
        container.innerHTML = `
            <div class="char-detail-card">
                <img src="${char.image}" alt="${char.name}" class="char-img">
                <div class="char-info">
                    <h2 style="font-size: 2.5rem; margin-bottom: 0;">${char.name}</h2>
                    <span class="char-title">${char.title}</span>
                    <p style="margin-top: 1.5rem; font-size: 1.1rem; line-height: 1.8;">${char.description}</p>
                </div>
            </div>
        `;
        // Fade in
        container.classList.add('active');
    }, 200);
}

async function loadArmor() {
    const data = await fetchData('data/armor.json');
    const container = document.getElementById('armor-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!container) return;

    // Initial Render
    renderArmor(data, container);

    // Setup Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const filteredData = filterValue === 'all'
                ? data
                : data.filter(item => item.type === filterValue);

            renderArmor(filteredData, container);
        });
    });
}

function renderArmor(items, container) {
    container.innerHTML = items.map(armor => `
        <div class="card armor-card" style="border-top: 3px solid var(--color-gold);">
            <h3>${armor.name}</h3>
            <span class="badge">${armor.type}</span>
            <p><em>${armor.perk}</em></p>
            <p>${armor.description}</p>
        </div>
    `).join('');
}

async function loadItems() {
    const data = await fetchData('data/items.json');
    const container = document.getElementById('items-grid');
    const filterBtns = document.querySelectorAll('.filter-btn-items');

    if (!container) return;

    // Initial Render
    renderItems(data, container);

    // Setup Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const filteredData = filterValue === 'all'
                ? data
                : data.filter(item => item.type === filterValue);

            renderItems(filteredData, container);
        });
    });
}

function renderItems(items, container) {
    container.innerHTML = items.map(item => `
        <div class="card item-card" style="border-bottom: 2px solid ${getRarityColor(item.rarity)};">
            <h4>${item.name}</h4>
            <span class="badge" style="font-size: 0.7rem; background: ${getRarityColor(item.rarity)}; color: #000;">${item.type}</span>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">${item.description}</p>
        </div>
    `).join('');
}

function getRarityColor(rarity) {
    switch (rarity) {
        case 'Common': return '#bdc3c7'; // Grey
        case 'Rare': return '#3498db'; // Blue
        case 'Legendary': return '#d4af37'; // Gold
        default: return '#e0e0e0';
    }
}

async function loadLocations() {
    const data = await fetchData('data/locations.json');
    const container = document.getElementById('locations-list');
    if (!container) return;

    container.classList.add('grid', 'grid-2');
    container.style.listStyle = 'none';

    container.innerHTML = data.map(loc => `
        <div class="card location-card" style="border-left: 3px solid var(--color-accent); padding: 1.5rem;">
            <h3 style="color: var(--color-gold);">${loc.name}</h3>
            <span class="badge" style="display:inline-block; margin-bottom: 0.5rem; background: var(--color-accent); color: white;">${loc.type}</span>
            <p><strong>Region:</strong> ${loc.region}</p>
            <p style="margin-top: 0.5rem; font-style: italic;">"${loc.description}"</p>
        </div>
    `).join('');
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulation of fetch to PHP backend
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log('Form submitted:', data);
        alert('Message sent to the winds (simulated)!');
        form.reset();
    });
}

async function loadTechniques() {
    const data = await fetchData('data/techniques.json');
    const container = document.getElementById('techniques-container');
    const filterBtns = document.querySelectorAll('.filter-btn-tech');

    if (!container) return;

    // Initial Render (Samurai)
    renderTechniques(data, container, 'Samurai');

    // Setup Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            renderTechniques(data, container, category);
        });
    });
}

function renderTechniques(data, container, category) {
    const filteredGroups = data.filter(group => group.category === category);

    container.innerHTML = filteredGroups.map(group => `
        <div class="tech-group" style="margin-bottom: 3rem;">
            <h3 style="color: var(--color-gold); border-bottom: 1px solid var(--color-ink); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">${group.partition}</h3>
            <div class="grid grid-3">
                ${group.techniques.map(tech => `
                    <div class="card tech-card" style="position: relative;">
                        <h4 style="font-size: 1.1rem;">${tech.name}</h4>
                        <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem;">Cost: ${tech.cost}</p>
                        <p style="font-size: 0.95rem;">${tech.description}</p>
                        <div style="position: absolute; top: 10px; right: 10px; width: 10px; height: 10px; background: var(--color-accent); border-radius: 50%;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}
