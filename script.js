const connectWalletBtn = document.getElementById('connectWallet');
const walletInfo = document.querySelector('.wallet-info');
const mintBtn = document.getElementById('mintBtn');
const whitelistBtn = document.getElementById('whitelistBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const trendingGrid = document.getElementById('trendingGrid');
const artistGrid = document.getElementById('artistGrid');
const nftGrid = document.getElementById('nftGrid');

const sampleNFTs = [
    {
        id: 1,
        title: "Summer Vibes",
        artist: "DJ Crypto",
        price: 0.5,
        genre: "electronic",
        image: "/home/fadhil/MUZIKI/folders/summer.jpeg",
        likes: 156,
        dateCreated: "2024-03-15"
    },
    {
        id: 2,
        title: "Rock Anthem",
        artist: "CryptoRocker",
        price: 1.2,
        genre: "rock",
        image: "/home/fadhil/MUZIKI/folders/rocker.jpeg",
        likes: 89,
        dateCreated: "2024-03-16"
    },
    {
        id: 3,
        title: "Jazz Night",
        artist: "NFT Jazz",
        price: 0.8,
        genre: "jazz",
        image: "folders/nftjazz.jpeg",
        likes: 234,
        dateCreated: "2024-03-17"
    }
];

const sampleArtists = [
    {
        name: "DJ Crypto",
        followers: "10.5K",
        nfts: 12,
        image: "/home/fadhil/MUZIKI/folders/dj.jpeg",
        verified: true
    },
    {
        name: "CryptoRocker",
        followers: "8.2K",
        nfts: 8,
        image: "/home/fadhil/MUZIKI/folders/rock.jpeg",
        verified: true
    },
    {
        name: "NFT Jazz",
        followers: "5.7K",
        nfts: 5,
        image: "/home/fadhil/MUZIKI/folders/nftjazz.jpeg",
        verified: false
    }
];

async function connectWallet() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            connectWalletBtn.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
            walletInfo.style.display = 'block';
            
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });
            
            const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
            document.getElementById('walletBalance').textContent = `${ethBalance} ETH`;
            
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    connectWallet();
                }
            });
            
            return account;
        } else {
            throw new Error('Please install MetaMask');
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + error.message);
    }
}

function disconnectWallet() {
    connectWalletBtn.textContent = 'Connect Wallet';
    walletInfo.style.display = 'none';
    document.getElementById('walletBalance').textContent = '0 ETH';
}

function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function createNFTCard(nft) {
    return `
        <div class="nft-card" data-id="${nft.id}">
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.title}">
                <div class="nft-overlay">
                    <button class="btn btn-play"><i class="fas fa-play"></i></button>
                    <button class="btn btn-like" data-likes="${nft.likes}">
                        <i class="far fa-heart"></i> ${nft.likes}
                    </button>
                </div>
            </div>
            <div class="nft-info">
                <h3>${nft.title}</h3>
                <p>By ${nft.artist}</p>
                <div class="nft-price">
                    <span class="eth-price">${nft.price} ETH</span>
                    <button class="btn btn-buy">Buy Now</button>
                </div>
            </div>
        </div>
    `;
}

function createArtistCard(artist) {
    return `
        <div class="artist-card">
            <div class="artist-image">
                <img src="${artist.image}" alt="${artist.name}">
                ${artist.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i></span>' : ''}
            </div>
            <h3>${artist.name}</h3>
            <p><i class="fas fa-users"></i> ${artist.followers} followers</p>
            <p><i class="fas fa-music"></i> ${artist.nfts} NFTs</p>
            <button class="btn btn-follow">Follow</button>
        </div>
    `;
}

function initMarketplace() {
    if (trendingGrid) {
        trendingGrid.innerHTML = sampleNFTs
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 4)
            .map(nft => createNFTCard(nft))
            .join('');
    }
    
    if (artistGrid) {
        artistGrid.innerHTML = sampleArtists
            .map(artist => createArtistCard(artist))
            .join('');
    }
    
    if (nftGrid) {
        nftGrid.innerHTML = sampleNFTs
            .map(nft => createNFTCard(nft))
            .join('');
    }

    initNFTCardListeners();
}

function initNFTCardListeners() {
    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentLikes = parseInt(this.dataset.likes);
            this.dataset.likes = currentLikes + 1;
            this.innerHTML = `<i class="fas fa-heart"></i> ${currentLikes + 1}`;
            this.classList.add('liked');
        });
    });

    document.querySelectorAll('.btn-play').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Audio player functionality would go here');
        });
    });

    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', async function() {
            const account = await connectWallet();
            if (account) {
                alert('Purchase functionality would go here');
            }
        });
    });
}

async function mintNFT(event) {
    event.preventDefault();
    
    try {
        const account = await connectWallet();
        if (!account) return;
        
        mintBtn.disabled = true;
        mintBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Minting...';
        
        const title = document.getElementById('songTitle').value;
        const description = document.getElementById('description').value;
        const genre = document.getElementById('genre').value;
        const price = document.getElementById('price').value;
        const royalty = document.getElementById('royalty').value;
        const musicFile = document.getElementById('musicFile').files[0];
        const coverArt = document.getElementById('coverArt').files[0];
        
        if (!title || !description || !genre || !price || !royalty || !musicFile || !coverArt) {
            throw new Error('Please fill in all fields and upload required files');
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('NFT minted successfully!');
        
        document.querySelector('.whitelist-form').reset();
        document.querySelectorAll('.upload-icon').forEach(icon => {
            icon.innerHTML = `<i class="fas fa-upload"></i><span>Upload File</span>`;
        });
        
    } catch (error) {
        console.error('Error minting NFT:', error);
        alert('Error minting NFT: ' + error.message);
    } finally {
        mintBtn.disabled = false;
        mintBtn.innerHTML = 'Mint NFT';
    }
}

async function registerWhitelist(event) {
    event.preventDefault();
    
    try {
        const account = await connectWallet();
        if (!account) return;
        
        const email = document.getElementById('email').value;
        const discord = document.getElementById('discord').value;
        const twitter = document.getElementById('twitter').value;
        
        if (!email || !discord || !twitter) {
            throw new Error('Please fill in all fields');
        }
        
        whitelistBtn.disabled = true;
        whitelistBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert('Registration successful! Welcome to the whitelist.');
        document.querySelector('.whitelist-form').reset();
        
    } catch (error) {
        console.error('Error registering for whitelist:', error);
        alert('Error registering for whitelist: ' + error.message);
    } finally {
        whitelistBtn.disabled = false;
        whitelistBtn.innerHTML = 'Join Whitelist';
    }
}

function initFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const parent = this.parentElement;
                const icon = parent.querySelector('.upload-icon');
                icon.innerHTML = `<i class="fas fa-check"></i><span>${file.name}</span>`;
            }
        });
    });
}

function filterNFTs() {
    const searchTerm = searchInput?.value.toLowerCase();
    const selectedGenre = genreFilter?.value;
    const selectedPrice = priceFilter?.value;
    const sortValue = sortBy?.value;

    let filteredNFTs = [...sampleNFTs];

    if (searchTerm) {
        filteredNFTs = filteredNFTs.filter(nft => 
            nft.title.toLowerCase().includes(searchTerm) ||
            nft.artist.toLowerCase().includes(searchTerm)
        );
    }

    if (selectedGenre) {
        filteredNFTs = filteredNFTs.filter(nft => nft.genre === selectedGenre);
    }

    if (selectedPrice) {
        const [min, max] = selectedPrice.split('-');
        filteredNFTs = filteredNFTs.filter(nft => {
            if (max === '+') {
                return nft.price >= parseFloat(min);
            } else {
                return nft.price >= parseFloat(min) && nft.price <= parseFloat(max);
            }
        });
    }

    switch (sortValue) {
        case 'recent':
            filteredNFTs.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            break;
        case 'popular':
            filteredNFTs.sort((a, b) => b.likes - a.likes);
            break;
        case 'price-low':
            filteredNFTs.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredNFTs.sort((a, b) => b.price - a.price);
            break;
    }

    if (nftGrid) {
        nftGrid.innerHTML = filteredNFTs.map(nft => createNFTCard(nft)).join('');
        initNFTCardListeners();
    }
}

function handleNewsletterSubscription(event) {
    event.preventDefault();
    const emailInput = document.querySelector('.newsletter-form input');
    const email = emailInput.value;
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    alert('Thank you for subscribing to our newsletter!');
    emailInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    connectWalletBtn?.addEventListener('click', connectWallet);
    mintBtn?.addEventListener('click', mintNFT);
    whitelistBtn?.addEventListener('click', registerWhitelist);
    
    initTabs();
    initMarketplace();
    initFileUploads();
    
    const searchInput = document.getElementById('searchNFT');
    const genreFilter = document.getElementById('genreFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortBy = document.getElementById('sortBy');
    
    searchInput?.addEventListener('input', filterNFTs);
    genreFilter?.addEventListener('change', filterNFTs);
    priceFilter?.addEventListener('change', filterNFTs);
    sortBy?.addEventListener('change', filterNFTs);
    
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', handleNewsletterSubscription);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

window.addEventListener('load', () => {
    document.body.classList.remove('loading');
});

window.addEventListener('resize', () => {
    // Responsive adjustments if needed
});