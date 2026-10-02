const products = [
    {
        id: 'lounge-sofa',
        name: 'The Lounge Sofa',
        category: 'Living',
        filter: 'living',
        description: 'Deep, generous seating for slow afternoons.',
        price: 1250000,
        tag: 'Bestseller',
        image: 'sofa.jpg',
        alt: 'Blue contemporary sofa in a bright living room'
    },
    {
        id: 'accent-chair',
        name: 'Living Room',
        category: 'Living',
        filter: 'living',
        description: 'A comfortable corner, with a little character.',
        price: 485000,
        tag: 'Made to order',
        image: 'real.jpg',
        alt: 'Upholstered accent chair with a clean modern silhouette'
    },
    {
        id: 'dining-table',
        name: 'The Gather Table',
        category: 'Dining',
        filter: 'dining',
        description: 'A lasting centrepiece for meals together.',
        price: 890000,
        tag: 'Solid wood',
        image: 'dinning.jpg',
        alt: 'Warm timber dining table set for a shared meal'
    },
    {
        id: 'dining-chair',
        name: 'The Everyday Seat-out',
        category: 'Lounge',
        filter: 'dining',
        description: 'Comfortable seat-out.',
        price: 420000,
        tag: 'Available for order',
        image: 'lounge.jpg',
        alt: 'Modern dining chairs arranged around a wood table'
    },
    {
        id: 'dining-chair',
        name: 'Comfy set-up',
        category: 'Lounge',
        filter: 'dining',
        description: 'Thoughtful lines and all-day comfort.',
        price: 250000,
        tag: 'Set of 2 available',
        image: 'chair1.jpg',
        alt: 'Modern dining chairs arranged around a wood table'
    },
        {
        id: 'bed-frame',
        name: 'Masters bed',
        category: 'Bedroom',
        filter: 'bedroom',
        description: 'Useful storage with a quieter presence.',
        price: 640000,
        tag: 'Crafted locally',
        image: 'bedroom2.jpg',
        alt: 'Refined timber sideboard in a softly lit interior'
    },
    {
        id: 'bed-frame',
        name: 'The Rest Bed Frame',
        category: 'Bedroom',
        filter: 'bedroom',
        description: 'A calm, considered start to every morning.',
        price: 950000,
        tag: 'Made to order',
        image: 'bedroom1.jpg',
        alt: 'Serene bedroom with a softly upholstered bed'
    },
    {
        id: 'sideboard',
        name: 'The Haven Sideboard',
        category: 'Storage',
        filter: 'storage',
        description: 'Useful storage with a quieter presence.',
        price: 450000,
        tag: 'Crafted locally',
        image: 'walldrop.jpg',
        alt: 'Refined timber sideboard in a softly lit interior'
    },
    {
        id: 'sideboard',
        name: 'Comfy Workspace Setup',
        category: 'Storage',
        filter: 'storage',
        description: 'Useful storage with a quieter presence.',
        price: 480000,
        tag: 'Crafted locally',
        image: 'workspace.jpg',
        alt: 'Refined timber sideboard in a softly lit interior'
     }

];

const productGrid = document.querySelector('#productGrid');
const priceFormatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
});

function renderProducts(filter = 'all') {
    const visibleProducts = products.filter(product => filter === 'all' || product.filter === filter);

    productGrid.innerHTML = visibleProducts.map(product => `
        <article class="product-card">
            <div class="product-visual">
                <img src="${product.image}" alt="${product.alt}" loading="lazy" onerror="this.onerror=null;this.src='new.jpg'">
                <span class="product-tag">${product.tag}</span>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-bottom">
                    <p class="product-price"><small>Starting from</small>${priceFormatter.format(product.price)}</p>
                    <button class="enquire-button" type="button" data-enquire="${product.id}">Enquire <span aria-hidden="true">↗</span></button>
                </div>
            </div>
        </article>
    `).join('');
}

if (productGrid) {
    renderProducts();

    document.querySelector('.filter-bar')?.addEventListener('click', event => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;

        document.querySelectorAll('.filter-button').forEach(filterButton => {
            const selected = filterButton === button;
            filterButton.classList.toggle('active', selected);
            filterButton.setAttribute('aria-pressed', String(selected));
        });
        renderProducts(button.dataset.filter);
    });

    productGrid.addEventListener('click', event => {
        const button = event.target.closest('[data-enquire]');
        if (!button) return;

        const product = products.find(item => item.id === button.dataset.enquire);
        if (!product) return;

        document.querySelector('#productInterest').value = `${product.name} (${priceFormatter.format(product.price)} starting price)`;
        document.querySelector('#message').value = `Hello DeX, I would like to know more about ${product.name}.`;
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('#name').focus({ preventScroll: true });
    });
}

const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

navigationLinks.forEach(link => {
    link.addEventListener('click', event => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        history.replaceState(null, '', link.getAttribute('href'));
    });
});

const sectionObserver = new IntersectionObserver(entries => {
    const visibleSection = entries.filter(entry => entry.isIntersecting).sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
    if (!visibleSection) return;

    navigationLinks.forEach(link => {
        const active = link.hash === `#${visibleSection.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .2, .5] });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

document.querySelectorAll('form[action*="formspree.io"]').forEach(form => {
    form.addEventListener('submit', async event => {
        event.preventDefault();

        const submitButton = form.querySelector('[type="submit"]');
        const status = form.querySelector('[role="status"]');
        const originalButtonText = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }
        if (status) status.textContent = 'Sending your message...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) throw new Error('Form submission failed');

            form.reset();
            if (status) status.textContent = 'Thanks for your message. We will be in touch soon.';
        } catch {
            if (status) status.textContent = 'Your message could not be sent. Please try again or email info@dexluxury.com.';
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});
