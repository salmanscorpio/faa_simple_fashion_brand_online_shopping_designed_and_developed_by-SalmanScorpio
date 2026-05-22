/**
 * FAA Luxury Web Architecture Engine
 * State Management & Dynamic Catalog Delivery Systems
 */

const FaaEngine = {
    products: [
        { id: 1, name: "Monolith Asymmetric Blazer", price: 340, category: "Apparel", tag: "New", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" },
        { id: 2, name: "Obsidian Silk Trench", price: 520, category: "Apparel", tag: "Trending", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80" },
        { id: 3, name: "Alabaster Sculpted Boot", price: 410, category: "Footwear", tag: "New", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80" },
        { id: 4, name: "Faa Signature Eclipse Glasses", price: 180, category: "Accessories", tag: "Trending", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80" },
        { id: 5, name: "Structured Minimalist Tote", price: 290, category: "Accessories", tag: "Classic", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80" },
        { id: 6, name: "Raw Denim Cargo Trouser", price: 260, category: "Apparel", tag: "Classic", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" }
    ],

    cart: JSON.parse(localStorage.getItem('faa_premium_cart')) || [],

    init: function() {
        this.updateCartUI();

        if (document.getElementById('catalog-grid-target')) {
            this.renderCatalog(this.products);
            this.bindFilters();
        }
        if (document.getElementById('product-view-target')) {
            this.renderDetailedProduct();
        }
        if (document.getElementById('cart-view-target')) {
            this.renderCart();
        }
    },

    updateCartUI: function() {
        const globalBadges = document.querySelectorAll('.cart-badge');
        const count = this.cart.reduce((acc, item) => acc + item.qty, 0);
        globalBadges.forEach(badge => badge.textContent = count);
    },

    renderCatalog: function(items) {
        const container = document.getElementById('catalog-grid-target');
        container.innerHTML = '';

        if(items.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5 opacity-50">No designs match your filter selection.</div>`;
            return;
        }

        items.forEach(product => {
            container.innerHTML += `
                <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                    <div class="product-card card h-100">
                        <div class="img-container" onclick="window.location.href='product.html?id=${product.id}'" style="cursor:pointer;">
                            <img src="${product.img}" class="card-img-top" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="card-body p-4 d-flex justify-content-between align-items-start">
                            <div>
                                <p class="text-uppercase tracking-wider text-muted small mb-1">${product.category}</p>
                                <h3 class="product-meta-title" onclick="window.location.href='product.html?id=${product.id}'" style="cursor:pointer;">${product.name}</h3>
                            </div>
                            <span class="product-price-tag">$${product.price}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    },

    bindFilters: function() {
        const filters = document.querySelectorAll('.filter-list-item');
        filters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                e.target.parentNode.querySelector('.active')?.classList.remove('active');
                e.target.classList.add('active');

                const key = e.target.dataset.filterKey;
                const value = e.target.dataset.filterValue;

                if(value === 'all') {
                    this.renderCatalog(this.products);
                } else {
                    const filtered = this.products.filter(p => p[key].toLowerCase() === value.toLowerCase());
                    this.renderCatalog(filtered);
                }
            });
        });
    },

    renderDetailedProduct: function() {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id')) || 1;
        const product = this.products.find(p => p.id === id);

        if (!product) return;

        document.getElementById('product-view-target').innerHTML = `
            <div class="col-lg-6 mb-4 animate__animated animate__fadeIn">
                <div class="border border-secondary border-opacity-10">
                    <img src="${product.img}" class="img-fluid w-100" alt="${product.name}">
                </div>
            </div>
            <div class="col-lg-6 ps-lg-5 d-flex flex-column justify-content-center animate__animated animate__fadeIn" style="animation-delay: 0.2s">
                <span class="text-uppercase tracking-widest text-warning small mb-2">${product.category}</span>
                <h1 class="display-4 mb-3">${product.name}</h1>
                <p class="h3 text-warning font-serif mb-4">$${product.price}</p>
                <p class="text-muted mb-5 lh-base">
                    An uncompromising approach to structural tailoring. Built from sustainable premium fiber components curated specially under the engineering eyes of Faa. Perfect fit-to-body lines profile.
                </p>
                
                <div class="mb-4">
                    <label class="text-uppercase small tracking-wider text-muted d-block mb-2">Configuration Size</label>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-light rounded-0 px-3 py-2 active">S</button>
                        <button type="button" class="btn btn-outline-light rounded-0 px-3 py-2">M</button>
                        <button type="button" class="btn btn-outline-light rounded-0 px-3 py-2">L</button>
                    </div>
                </div>

                <button class="btn btn-faa w-100 py-3 mt-4" id="execute-cart-addition">Acquire Design</button>
            </div>
        `;

        document.getElementById('execute-cart-addition').addEventListener('click', () => {
            this.addToCart(product.id);
        });
    },

    addToCart: function(id) {
        const item = this.products.find(p => p.id === id);
        const target = this.cart.find(c => c.id === id);

        if(target) {
            target.qty += 1;
        } else {
            this.cart.push({ ...item, qty: 1 });
        }
        localStorage.setItem('faa_premium_cart', JSON.stringify(this.cart));
        this.updateCartUI();
        alert(`${item.name} assigned to your collection vault safely.`);
    },

    renderCart: function() {
        const target = document.getElementById('cart-view-target');
        if(this.cart.length === 0) {
            target.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h2 class="mb-4">Your collection pipeline is currently vacant.</h2>
                    <a href="shop.html" class="btn btn-faa">Discover Lineages</a>
                </div>`;
            return;
        }

        let total = 0;
        let html = `<div class="col-lg-8">`;
        
        this.cart.forEach(item => {
            total += (item.price * item.qty);
            html += `
                <div class="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-20 py-4">
                    <div class="d-flex align-items-center">
                        <img src="${item.img}" style="width: 70px; height: 90px; object-fit:cover;" class="me-4" alt="">
                        <div>
                            <h4 class="h5 mb-1">${item.name}</h4>
                            <p class="small text-muted mb-0">Quantity Vector: ${item.qty}</p>
                        </div>
                    </div>
                    <div class="text-end">
                        <p class="mb-2 text-warning">$${item.price * item.qty}</p>
                        <button class="btn btn-sm text-danger text-uppercase small p-0 bg-transparent border-0" onclick="FaaEngine.purge(${item.id})">Release</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        html += `
            <div class="col-lg-4 ps-lg-5 mt-5 mt-lg-0">
                <div class="p-4 bg-surface border border-secondary border-opacity-10">
                    <h3 class="h4 mb-4 text-uppercase tracking-wider">Settlement Value</h3>
                    <div class="d-flex justify-content-between mb-4">
                        <span>Total Balance</span>
                        <span class="text-warning h4 mb-0">$${total}</span>
                    </div>
                    <button class="btn btn-faa w-100" onclick="alert('Rerouting payment execution safely via Secure Checkout Layer.')">Complete Transaction</button>
                </div>
            </div>
        `;
        target.innerHTML = html;
    },

    purge: function(id) {
        this.cart = this.cart.filter(c => c.id !== id);
        localStorage.setItem('faa_premium_cart', JSON.stringify(this.cart));
        this.updateCartUI();
        this.renderCart();
    }
};

document.addEventListener('DOMContentLoaded', () => FaaEngine.init());