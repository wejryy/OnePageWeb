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
    setupContactForm();
    setupParallax();
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
        // Limit the effect to viewport height to save performance
        if (scrollY > window.innerHeight) return;

        // Scale calculation: 1 + (scrollY / 1000) -> gentle zoom
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
    const container = document.getElementById('clan-grid');
    if (!container) return;

    container.innerHTML = data.map(char => `
        <div class="card clan-card">
            <h3>${char.name}</h3>
            <h4>${char.title}</h4>
            <p>${char.description}</p>
        </div>
    `).join('');
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
