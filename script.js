// M-138 Cipher Strips Data - Authentic historical strips
const M138_STRIPS = {
    1: "AIDLGCENXPMKVRJWUBFQYZSOHT",
    2: "WVOYFIMGXBSNZPJCQKDAUHRLET",
    3: "VYJZNSFOHRMETUBQAGLWDICPXK",
    4: "MCSFRUABDVWZPGHLKQYONTXIJE",
    5: "EXJNTSBWRUHFQCVKDLIYOMPGZA",
    6: "FJUPNTVZRSEOCAYGDIWXKBQHLM",
    7: "LBAJGQMUYDPVKSHTCOEWRNXZFI",
    8: "GLDBVTKXZHIYNAOUQPRCJWSFME",
    9: "KIOEZBFASHLTXVRWQUCGDMYPNJ",
    10: "PSTQYFUXIVWAERZMBJNKCODGLH",
    11: "HBVARYMWSNKGJLOUTPQDEIXCZF",
    12: "HMJQXNDOKCYSAZWUEPLVITFBRG",
    13: "AFWDRHJYLISEKQBGTOUVXCPZNM",
    14: "ICZWERJOPMFNQUGTBHLYXVDKSA",
    15: "GUILVBAMJKYROXETHWNFPCZQDS",
    16: "EFXRQGABYWTSDVNOPJZHIUMLKC",
    17: "RHFTUPCIMAVWZNDKYXJESGQOBL",
    18: "ZGXAEPIQTFOWCSDLUVRJKNMBHY",
    19: "RLHUXWMVZYOBCENKIJDSAFQGTP",
    20: "YQOWTGPVBJEKSLURXHMAFCZDIN",
    21: "RMEUNLASZWVQJIYKPBXGFHDCOT",
    22: "DZQFMIJRAGCXNOEUPBHVSWYTLK",
    23: "XQTLUDJEARNZFMCHIVWOPYBKSG",
    24: "YDUISVNWJXFQMCZRPAHKELGBTO",
    25: "IJYLTBEDXSQMFGPWKVRHOACUZN"
};

// Helper function to generate valid random strips
function generateValidStrip() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (let i = alphabet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
    }
    return alphabet.join('');
}

// Global variables
let selectedStrips = [];  // Changed to array to maintain order
let selectedStripsDecrypt = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeStripSelection();
    initializeOffsetDial();
    initializeOffsetDialDecrypt();
    initializeEncryption();
    initializeDecryption();
    initializeCopyKey();
    initializePWA();
    
    // Handle orientation changes on mobile
    window.addEventListener('resize', handleResize);
});

// Handle window resize events
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-center animations if they exist
        const animationContainers = document.querySelectorAll('.strip-animation');
        animationContainers.forEach(container => {
            if (container.innerHTML) {
                // Trigger a reset to recalculate positions
                const resetBtn = container.closest('.animation-container').querySelector('button[id*="reset"]');
                if (resetBtn) {
                    resetBtn.click();
                }
            }
        });
    }, 250);
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Strip selection for encryption and decryption
function initializeStripSelection() {
    // Initialize encryption strip selection
    initializeStripSelectionForMode('stripSelection', 'selectedCount', 'randomStrips', selectedStrips);
    
    // Initialize decryption strip selection
    initializeStripSelectionForMode('stripSelectionDecrypt', 'selectedCountDecrypt', 'randomStripsDecrypt', selectedStripsDecrypt);
}

function initializeStripSelectionForMode(selectionId, countId, randomBtnId, stripArray) {
    const stripSelection = document.getElementById(selectionId);
    const selectedCount = document.getElementById(countId);
    const randomStripsBtn = document.getElementById(randomBtnId);
    const orderedStrips = document.getElementById(selectionId === 'stripSelection' ? 'orderedStrips' : 'orderedStripsDecrypt');

    // Create strip checkboxes for strips 1-25
    for (let i = 1; i <= 25; i++) {
        const stripDiv = document.createElement('div');
        stripDiv.className = 'strip-checkbox';
        stripDiv.textContent = i;
        stripDiv.dataset.strip = i;
        
        stripDiv.addEventListener('click', () => {
            const stripNum = parseInt(stripDiv.dataset.strip);
            
            // Check if strip is already used
            if (stripArray.includes(stripNum)) {
                return;
            }
            
            // Add to ordered list if not at 25 limit
            if (stripArray.length < 25) {
                stripArray.push(stripNum);
                stripDiv.classList.add('used');
                updateOrderedDisplay(orderedStrips, stripArray, stripDiv);
                selectedCount.textContent = stripArray.length;
            }
        });
        
        stripSelection.appendChild(stripDiv);
    }

    // Update ordered display function
    function updateOrderedDisplay(container, array, sourceDiv = null) {
        container.innerHTML = '';
        
        array.forEach((stripNum, index) => {
            const orderedDiv = document.createElement('div');
            orderedDiv.className = 'ordered-strip';
            orderedDiv.textContent = stripNum;
            orderedDiv.dataset.index = index;
            
            // Add remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                array.splice(index, 1);
                
                // Update available strips
                const availableStrip = stripSelection.querySelector(`[data-strip="${stripNum}"]`);
                if (availableStrip) {
                    availableStrip.classList.remove('used');
                }
                
                updateOrderedDisplay(container, array);
                selectedCount.textContent = array.length;
            };
            
            orderedDiv.appendChild(removeBtn);
            container.appendChild(orderedDiv);
        });
    }

    // Random strip selection
    randomStripsBtn.addEventListener('click', () => {
        // Clear current selection
        stripArray.length = 0;
        stripSelection.querySelectorAll('.strip-checkbox').forEach(cb => cb.classList.remove('used'));
        
        // Create random order of all 25 strips
        const availableStrips = Array.from({length: 25}, (_, i) => i + 1);
        
        // Fisher-Yates shuffle
        for (let i = availableStrips.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableStrips[i], availableStrips[j]] = [availableStrips[j], availableStrips[i]];
        }
        
        // Add all 25 in random order
        availableStrips.forEach(stripNum => {
            stripArray.push(stripNum);
            stripSelection.querySelector(`[data-strip="${stripNum}"]`).classList.add('used');
        });
        
        updateOrderedDisplay(orderedStrips, stripArray);
        selectedCount.textContent = stripArray.length;
    });
    
    // Sequential strip selection (1-25 in order)
    const sequentialStripsBtn = document.getElementById(selectionId === 'stripSelection' ? 'sequentialStrips' : 'sequentialStripsDecrypt');
    if (sequentialStripsBtn) {
        sequentialStripsBtn.addEventListener('click', () => {
            // Clear current selection
            stripArray.length = 0;
            stripSelection.querySelectorAll('.strip-checkbox').forEach(cb => cb.classList.remove('used'));
            
            // Add strips 1-25 in sequential order
            for (let i = 1; i <= 25; i++) {
                stripArray.push(i);
                stripSelection.querySelector(`[data-strip="${i}"]`).classList.add('used');
            }
            
            updateOrderedDisplay(orderedStrips, stripArray);
            selectedCount.textContent = stripArray.length;
        });
    }
}

// Offset Dial functionality
function initializeOffsetDial() {
    const canvas = document.getElementById('offsetDial');
    const ctx = canvas.getContext('2d');
    const offsetInput = document.getElementById('offset');
    const dialValue = document.getElementById('dialValue');
    
    let isDragging = false;
    
    function drawDial(value) {
        // Adjust canvas size for mobile
        if (isMobile() && canvas.width !== 120) {
            canvas.width = 120;
            canvas.height = 120;
        }
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = isMobile() ? 45 : 60;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw progress arc
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (value / 25) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // Draw tick marks
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 25; i++) {
            const angle = -Math.PI / 2 + (i / 25) * 2 * Math.PI;
            const x1 = centerX + Math.cos(angle) * (radius - 5);
            const y1 = centerY + Math.sin(angle) * (radius - 5);
            const x2 = centerX + Math.cos(angle) * (radius + 5);
            const y2 = centerY + Math.sin(angle) * (radius + 5);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Draw handle
        const handleAngle = startAngle + (value / 25) * 2 * Math.PI;
        const handleX = centerX + Math.cos(handleAngle) * radius;
        const handleY = centerY + Math.sin(handleAngle) * radius;
        
        ctx.beginPath();
        ctx.arc(handleX, handleY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#0066cc';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function updateValue(value) {
        offsetInput.value = value;
        dialValue.textContent = value;
        drawDial(value);
    }
    
    function getValueFromMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;
        
        const value = Math.round((angle / (2 * Math.PI)) * 25);
        return Math.min(25, Math.max(0, value));
    }
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateValue(getValueFromMouse(e));
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateValue(getValueFromMouse(e));
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isDragging) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }
    });
    
    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Initial draw
    drawDial(0);
}

// Offset Dial functionality for Decryption
function initializeOffsetDialDecrypt() {
    const canvas = document.getElementById('offsetDialDecrypt');
    const ctx = canvas.getContext('2d');
    const offsetInput = document.getElementById('offsetDecrypt');
    const dialValue = document.getElementById('dialValueDecrypt');
    
    let isDragging = false;
    
    function drawDial(value) {
        // Adjust canvas size for mobile
        if (isMobile() && canvas.width !== 120) {
            canvas.width = 120;
            canvas.height = 120;
        }
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = isMobile() ? 45 : 60;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw progress arc
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (value / 25) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // Draw tick marks
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 25; i++) {
            const angle = -Math.PI / 2 + (i / 25) * 2 * Math.PI;
            const x1 = centerX + Math.cos(angle) * (radius - 5);
            const y1 = centerY + Math.sin(angle) * (radius - 5);
            const x2 = centerX + Math.cos(angle) * (radius + 5);
            const y2 = centerY + Math.sin(angle) * (radius + 5);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Draw handle
        const handleAngle = startAngle + (value / 25) * 2 * Math.PI;
        const handleX = centerX + Math.cos(handleAngle) * radius;
        const handleY = centerY + Math.sin(handleAngle) * radius;
        
        ctx.beginPath();
        ctx.arc(handleX, handleY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#0066cc';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function updateValue(value) {
        offsetInput.value = value;
        dialValue.textContent = value;
        drawDial(value);
    }
    
    function getValueFromMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;
        
        const value = Math.round((angle / (2 * Math.PI)) * 25);
        return Math.min(25, Math.max(0, value));
    }
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateValue(getValueFromMouse(e));
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateValue(getValueFromMouse(e));
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isDragging) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }
    });
    
    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Listen for copy offset event
    canvas.addEventListener('copyOffset', (e) => {
        updateValue(e.offsetValue);
    });
    
    // Initial draw
    drawDial(0);
}

// Copy Key functionality
function initializeCopyKey() {
    const copyBtn = document.getElementById('copyFromEncryption');
    
    copyBtn.addEventListener('click', () => {
        // Copy strips
        selectedStripsDecrypt.length = 0;
        selectedStripsDecrypt.push(...selectedStrips);
        
        // Update UI for strips
        const stripSelectionDecrypt = document.getElementById('stripSelectionDecrypt');
        const orderedStripsDecrypt = document.getElementById('orderedStripsDecrypt');
        const selectedCountDecrypt = document.getElementById('selectedCountDecrypt');
        
        // Clear and update available strips
        stripSelectionDecrypt.querySelectorAll('.strip-checkbox').forEach(cb => {
            const stripNum = parseInt(cb.dataset.strip);
            if (selectedStripsDecrypt.includes(stripNum)) {
                cb.classList.add('used');
            } else {
                cb.classList.remove('used');
            }
        });
        
        // Update ordered display
        updateOrderedDisplayForDecrypt();
        selectedCountDecrypt.textContent = selectedStripsDecrypt.length;
        
        // Copy offset
        const offsetValue = parseInt(document.getElementById('offset').value);
        document.getElementById('offsetDecrypt').value = offsetValue;
        document.getElementById('dialValueDecrypt').textContent = offsetValue;
        
        // Redraw dial
        const canvas = document.getElementById('offsetDialDecrypt');
        const event = new Event('copyOffset');
        event.offsetValue = offsetValue;
        canvas.dispatchEvent(event);
    });
}

// Helper function to update ordered display for decryption
function updateOrderedDisplayForDecrypt() {
    const orderedStripsDecrypt = document.getElementById('orderedStripsDecrypt');
    const stripSelectionDecrypt = document.getElementById('stripSelectionDecrypt');
    const selectedCountDecrypt = document.getElementById('selectedCountDecrypt');
    
    orderedStripsDecrypt.innerHTML = '';
    
    selectedStripsDecrypt.forEach((stripNum, index) => {
        const orderedDiv = document.createElement('div');
        orderedDiv.className = 'ordered-strip';
        orderedDiv.textContent = stripNum;
        orderedDiv.dataset.index = index;
        
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            selectedStripsDecrypt.splice(index, 1);
            
            // Update available strips
            const availableStrip = stripSelectionDecrypt.querySelector(`[data-strip="${stripNum}"]`);
            if (availableStrip) {
                availableStrip.classList.remove('used');
            }
            
            updateOrderedDisplayForDecrypt();
            selectedCountDecrypt.textContent = selectedStripsDecrypt.length;
        };
        
        orderedDiv.appendChild(removeBtn);
        orderedStripsDecrypt.appendChild(orderedDiv);
    });
}

// Encryption functionality
function initializeEncryption() {
    const encryptBtn = document.getElementById('encryptBtn');
    
    encryptBtn.addEventListener('click', () => {
        const plaintext = document.getElementById('plaintext').value.toUpperCase().replace(/[^A-Z]/g, '');
        const offset = parseInt(document.getElementById('offset').value) || 0;
        
        if (selectedStrips.length !== 25) {
            alert('Please select exactly 25 strips!');
            return;
        }
        
        if (!plaintext) {
            alert('Please enter plaintext!');
            return;
        }
        
        const stripsArray = [...selectedStrips];  // Already an array
        const ciphertext = encrypt(plaintext, stripsArray, offset);
        document.getElementById('ciphertext').value = ciphertext;
        
        // Show Step 3
        document.getElementById('step3Container').style.display = 'block';
        
        // Show and setup animation
        setupAnimation(plaintext, stripsArray, offset);
        
        // Scroll to Step 3
        document.getElementById('step3Container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    // Initialize animation controls
    initializeAnimationControls();
}

// Core encryption function
function encrypt(plaintext, strips, offset) {
    let result = '';
    
    // For each position in the plaintext
    for (let i = 0; i < plaintext.length; i++) {
        const char = plaintext[i];
        const stripIndex = i % strips.length;
        const stripNum = strips[stripIndex];
        const baseStrip = M138_STRIPS[stripNum];
        
        // Find where the plaintext character appears in this strip
        const alignmentPos = baseStrip.indexOf(char);
        if (alignmentPos !== -1) {
            // In M-138, we align the strip so the plaintext char is at position 0
            // Then read from position 'offset'
            // This is equivalent to reading from (alignmentPos + offset) with wraparound
            const cipherPos = (alignmentPos + offset) % 26;
            result += baseStrip[cipherPos];
        } else {
            // Character not found in strip
            result += '?';
        }
    }
    
    return result;
}

// Decryption functionality
function initializeDecryption() {
    const decryptBtn = document.getElementById('decryptBtn');
    
    decryptBtn.addEventListener('click', () => {
        const ciphertext = document.getElementById('ciphertext-input').value.toUpperCase().replace(/[^A-Z]/g, '');
        const offset = parseInt(document.getElementById('offsetDecrypt').value) || 0;
        
        if (selectedStripsDecrypt.length !== 25) {
            alert('Please select exactly 25 strips!');
            return;
        }
        
        if (!ciphertext) {
            alert('Please enter ciphertext!');
            return;
        }
        
        const stripsArray = [...selectedStripsDecrypt];  // Already an array
        const plaintext = decrypt(ciphertext, stripsArray, offset);
        document.getElementById('plaintext-output').value = plaintext;
        
        // Show Step 3
        document.getElementById('step3ContainerDecrypt').style.display = 'block';
        
        // Show and setup animation for decryption
        setupDecryptAnimation(ciphertext, plaintext, stripsArray, offset);
        
        // Scroll to Step 3
        document.getElementById('step3ContainerDecrypt').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    // Initialize animation controls for decryption
    initializeDecryptAnimationControls();
}




// Helper functions
function decrypt(ciphertext, strips, offset) {
    let result = '';
    
    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i];
        const stripIndex = i % strips.length;
        const stripNum = strips[stripIndex];
        const baseStrip = M138_STRIPS[stripNum];
        
        // In M-138 decryption, we need to find which character, when aligned
        // to position 0, would show our cipher character at position 'offset'
        let found = false;
        
        // Try each position as a potential alignment
        for (let alignPos = 0; alignPos < 26; alignPos++) {
            // If we align at this position, what's at offset?
            const checkPos = (alignPos + offset) % 26;
            if (baseStrip[checkPos] === char) {
                // This alignment produces our cipher character
                result += baseStrip[alignPos];
                found = true;
                break;
            }
        }
        
        if (!found) {
            // Character not found in strip
            console.warn(`Decryption failed at position ${i}: could not find '${char}' in strip ${stripNum} at offset ${offset}`);
            result += '?';
        }
    }
    
    return result;
}

function generateRandomStrips() {
    // Create random order of all 25 strips
    const strips = Array.from({length: 25}, (_, i) => i + 1);
    
    // Fisher-Yates shuffle
    for (let i = strips.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [strips[i], strips[j]] = [strips[j], strips[i]];
    }
    
    return strips;
}



// PWA functionality
function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
    
    // Install button
    let deferredPrompt;
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.textContent = 'Install App';
    document.body.appendChild(installButton);
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'block';
    });
    
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            installButton.style.display = 'none';
        }
    });
}

// Animation functionality
let animationInterval = null;
let currentAnimationStep = 0;
let animatedPlaintext = '';
let animatedStrips = [];
let animatedOffset = 0;
let scrollPosition = 0;

// Mobile detection
function isMobile() {
    return window.innerWidth <= 768;
}

function setupAnimation(plaintext, strips, offset) {
    const animationDiv = document.getElementById('stripAnimation');
    
    
    animationDiv.innerHTML = '';
    
    // Store animation data
    animatedPlaintext = plaintext;
    animatedStrips = strips;
    animatedOffset = offset;
    scrollPosition = 0;
    
    // Create scrollable wrapper
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'scroll-wrapper';
    scrollWrapper.style.position = 'relative';
    scrollWrapper.style.overflowX = 'auto';
    
    // Create inner container for strips
    const innerContainer = document.createElement('div');
    innerContainer.className = 'strips-container';
    innerContainer.style.display = 'inline-block';
    innerContainer.style.minWidth = '100%';
    
    // Create all strips but only show visible ones initially
    const totalChars = plaintext.length;
    
    for (let i = 0; i < totalChars; i++) {
        const stripIndex = i % strips.length;
        const stripNum = strips[stripIndex];
        const baseStrip = M138_STRIPS[stripNum];
        const strip = baseStrip + baseStrip; // Double for wraparound
        const plaintextChar = plaintext[i];
        
        const stripDiv = document.createElement('div');
        stripDiv.className = 'animated-strip';
        stripDiv.dataset.index = i;
        stripDiv.style.display = i < 10 ? 'flex' : 'none'; // Initially show only first 10
        
        // Strip label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'strip-label';
        labelDiv.textContent = `Strip ${stripNum}:`;
        stripDiv.appendChild(labelDiv);
        
        // Strip content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'strip-content';
        
        // Find alignment position in the base strip
        const alignPos = baseStrip.indexOf(plaintextChar);
        
        // Create character cells - show 52 characters (doubled strip)
        for (let j = 0; j < 52; j++) {
            const charDiv = document.createElement('div');
            charDiv.className = 'strip-char';
            charDiv.textContent = strip[j];
            charDiv.dataset.pos = j;
            contentDiv.appendChild(charDiv);
        }
        
        // Store alignment info
        contentDiv.dataset.alignPos = alignPos;
        contentDiv.dataset.offset = offset;
        contentDiv.dataset.animated = 'false';
        
        // Apply initial transform to center the plaintext character under P indicator
        const charWidth = isMobile() ? 23 : 30;
        const stripLabelWidth = isMobile() ? 50 : 80;
        const viewportWidth = animationDiv.clientWidth || 800;
        const centerPosition = (viewportWidth / 2) - (offset * charWidth / 2) - stripLabelWidth;
        const leftShift = isMobile() ? -48 : -96; // -48px (0.5 inch) on mobile, -96px (1 inch) on desktop
        const initialTranslateX = centerPosition - (alignPos * charWidth) + leftShift;
        contentDiv.style.transform = `translateX(${initialTranslateX}px)`;
        
        stripDiv.appendChild(contentDiv);
        innerContainer.appendChild(stripDiv);
    }
    
    scrollWrapper.appendChild(innerContainer);
    animationDiv.appendChild(scrollWrapper);
    
    // Add column indicators to the wrapper
    const indicatorContainer = document.createElement('div');
    indicatorContainer.style.position = 'sticky';
    indicatorContainer.style.left = '0';
    indicatorContainer.style.top = '0';
    indicatorContainer.style.height = '40px';
    indicatorContainer.style.width = '100%';
    indicatorContainer.style.pointerEvents = 'none';
    indicatorContainer.style.display = 'flex';
    indicatorContainer.style.justifyContent = 'center';
    indicatorContainer.style.paddingLeft = '80px'; // Account for strip labels
    
    // Create indicator group centered in viewport
    const centerGroup = document.createElement('div');
    centerGroup.style.position = 'absolute';
    const viewportWidth = animationDiv.clientWidth || 800;
    const stripLabelWidth = isMobile() ? 50 : 80;
    const charWidth = isMobile() ? 23 : 30;
    const centerPosition = (viewportWidth / 2) - (offset * charWidth / 2);
    centerGroup.style.left = `${centerPosition}px`;
    centerGroup.style.width = '100%';
    
    const plaintextIndicator = document.createElement('div');
    plaintextIndicator.className = 'column-indicator plaintext-indicator';
    plaintextIndicator.textContent = isMobile() ? 'P' : '↓ P';
    plaintextIndicator.style.left = '0px';
    plaintextIndicator.style.position = 'absolute';
    centerGroup.appendChild(plaintextIndicator);
    
    const cipherIndicator = document.createElement('div');
    cipherIndicator.className = 'column-indicator cipher-indicator';
    cipherIndicator.textContent = isMobile() ? 'C' : '↓ C';
    cipherIndicator.style.left = `${offset * charWidth}px`;
    cipherIndicator.style.position = 'absolute';
    centerGroup.appendChild(cipherIndicator);
    
    indicatorContainer.appendChild(centerGroup);
    
    animationDiv.insertBefore(indicatorContainer, scrollWrapper);
    
    // Add scroll listener
    scrollWrapper.addEventListener('scroll', handleScroll);
    
    // Reset animation
    currentAnimationStep = 0;
    
    // Check and animate initially visible strips
    setTimeout(() => {
        const initialEvent = { target: scrollWrapper };
        handleScroll(initialEvent);
    }, 100);
}

function handleScroll(event) {
    const scrollLeft = event.target.scrollLeft || 0;
    const stripWidth = isMobile() ? 50 : 80; // Width of strip label
    const charWidth = isMobile() ? 23 : 30; // Width of each character cell
    const viewportWidth = event.target.clientWidth || 800;
    
    
    // Calculate which strips should be visible based on viewport with buffer
    const bufferSize = isMobile() ? 3 : 5; // Reduced buffer on mobile for performance
    const startChar = Math.max(0, Math.floor((scrollLeft - stripWidth) / charWidth) - bufferSize);
    const endChar = Math.min(Math.ceil((scrollLeft + viewportWidth) / charWidth) + bufferSize, animatedPlaintext.length);
    
    // Update visible strips and animate when they reach center
    const strips = document.querySelectorAll('.animated-strip');
    
    strips.forEach((strip, index) => {
        if (index >= startChar && index < endChar) {
            strip.style.display = 'flex';
            const content = strip.querySelector('.strip-content');
            
            if (content.dataset.animated === 'false') {
                // Animate immediately for debugging
                animateStripInstantly(strip, index);
            }
        } else {
            strip.style.display = 'none';
        }
    });
}

function initializeAnimationControls() {
    const resetBtn = document.getElementById('resetAnimation');
    
    resetBtn.addEventListener('click', () => {
        resetAnimation();
    });
}

function runAnimationStep() {
    const visibleStrips = document.querySelectorAll('.animated-strip[style*="flex"]');
    
    // Animate each visible strip that hasn't been animated yet
    visibleStrips.forEach((strip, index) => {
        const content = strip.querySelector('.strip-content');
        if (content.dataset.animated === 'false') {
            animateStrip(strip, parseInt(strip.dataset.index));
        }
    });
}

function animateStripInstantly(strip, index) {
    const content = strip.querySelector('.strip-content');
    const alignPos = parseInt(content.dataset.alignPos);
    const offset = parseInt(content.dataset.offset);
    
    // Skip if alignPos is invalid (character not found in strip)
    if (alignPos < 0 || isNaN(alignPos)) {
        console.warn(`Invalid alignPos for strip ${index}: ${alignPos}`);
        return;
    }
    
    // Mark as animated
    content.dataset.animated = 'true';
    
    // Step 1: Highlight plaintext position first
    const plaintextCell = content.children[alignPos];
    if (plaintextCell && plaintextCell.classList.contains('strip-char')) {
        plaintextCell.classList.add('plaintext-highlight');
    }
    
    // Step 2: Highlight cipher position after a delay
    setTimeout(() => {
        const cipherPos = alignPos + offset;
        const cipherCell = content.children[cipherPos];
        if (cipherCell && cipherCell.classList.contains('strip-char')) {
            cipherCell.classList.add('cipher-highlight');
        }
    }, 500);
}

function resetAnimation() {
    // Reset all strips to initial aligned state
    const strips = document.querySelectorAll('.animated-strip');
    strips.forEach((strip, index) => {
        const content = strip.querySelector('.strip-content');
        const alignPos = parseInt(content.dataset.alignPos);
        const charWidth = isMobile() ? 23 : 30;
        const stripLabelWidth = isMobile() ? 50 : 80;
        
        // Reset to initial centered position
        const viewportWidth = strip.parentElement.parentElement.clientWidth || 800;
        const offset = parseInt(content.dataset.offset);
        const centerPosition = (viewportWidth / 2) - (offset * charWidth / 2) - stripLabelWidth;
        const leftShift = isMobile() ? -48 : -96; // -48px on mobile, -96px on desktop
        const initialTranslateX = centerPosition - (alignPos * charWidth) + leftShift;
        content.style.transform = `translateX(${initialTranslateX}px)`;
        content.style.transition = 'transform 0.3s ease';
        content.dataset.animated = 'false';
        
        // Reset visibility
        strip.style.display = index < 10 ? 'flex' : 'none';
    });
    
    resetHighlights();
    
    // Reset scroll position
    const scrollWrapper = document.querySelector('.scroll-wrapper');
    if (scrollWrapper) {
        scrollWrapper.scrollLeft = 0;
    }
}

function resetHighlights() {
    document.querySelectorAll('.strip-char').forEach(char => {
        char.classList.remove('plaintext-highlight', 'cipher-highlight');
    });
}

// Decryption animation functionality
function setupDecryptAnimation(ciphertext, plaintext, strips, offset) {
    const animationDiv = document.getElementById('stripAnimationDecrypt');
    
    animationDiv.innerHTML = '';
    
    // Store animation data
    animatedPlaintext = plaintext;
    animatedStrips = strips;
    animatedOffset = offset;
    scrollPosition = 0;
    
    // Create scrollable wrapper
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'scroll-wrapper';
    scrollWrapper.style.position = 'relative';
    scrollWrapper.style.overflowX = 'auto';
    
    // Create inner container for strips
    const innerContainer = document.createElement('div');
    innerContainer.className = 'strips-container';
    innerContainer.style.display = 'inline-block';
    innerContainer.style.minWidth = '100%';
    
    // Create all strips but only show visible ones initially
    const totalChars = ciphertext.length;
    
    for (let i = 0; i < totalChars; i++) {
        const stripIndex = i % strips.length;
        const stripNum = strips[stripIndex];
        const baseStrip = M138_STRIPS[stripNum];
        const strip = baseStrip + baseStrip; // Double for wraparound
        const ciphertextChar = ciphertext[i];
        
        const stripDiv = document.createElement('div');
        stripDiv.className = 'animated-strip';
        stripDiv.dataset.index = i;
        stripDiv.style.display = i < 10 ? 'flex' : 'none'; // Initially show only first 10
        
        // Strip label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'strip-label';
        labelDiv.textContent = `Strip ${stripNum}:`;
        stripDiv.appendChild(labelDiv);
        
        // Strip content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'strip-content';
        
        // Find where ciphertext char appears at offset position
        let alignPos = -1;
        for (let j = 0; j < 26; j++) {
            if (strip[j + offset] === ciphertextChar) {
                alignPos = j;
                break;
            }
        }
        
        // Create character cells - show 52 characters (doubled strip)
        for (let j = 0; j < 52; j++) {
            const charDiv = document.createElement('div');
            charDiv.className = 'strip-char';
            charDiv.textContent = strip[j];
            charDiv.dataset.pos = j;
            contentDiv.appendChild(charDiv);
        }
        
        // Store alignment info
        contentDiv.dataset.alignPos = alignPos;
        contentDiv.dataset.offset = offset;
        contentDiv.dataset.animated = 'false';
        
        // Apply initial transform to center the cipher character under C indicator
        const charWidth = isMobile() ? 23 : 30;
        const stripLabelWidth = isMobile() ? 50 : 80;
        const viewportWidth = animationDiv.clientWidth || 800;
        const centerPosition = (viewportWidth / 2) - stripLabelWidth;
        const cipherPos = alignPos + offset;
        const leftShift = isMobile() ? -48 : -96; // -48px on mobile, -96px on desktop
        const initialTranslateX = centerPosition - (alignPos * charWidth) + leftShift;
        contentDiv.style.transform = `translateX(${initialTranslateX}px)`;
        
        stripDiv.appendChild(contentDiv);
        innerContainer.appendChild(stripDiv);
    }
    
    scrollWrapper.appendChild(innerContainer);
    animationDiv.appendChild(scrollWrapper);
    
    // Add column indicators to the wrapper
    const indicatorContainer = document.createElement('div');
    indicatorContainer.style.position = 'sticky';
    indicatorContainer.style.left = '0';
    indicatorContainer.style.top = '0';
    indicatorContainer.style.height = '40px';
    indicatorContainer.style.width = '100%';
    indicatorContainer.style.pointerEvents = 'none';
    indicatorContainer.style.display = 'flex';
    indicatorContainer.style.justifyContent = 'center';
    indicatorContainer.style.paddingLeft = '80px'; // Account for strip labels
    
    // Create indicator group centered in viewport
    const centerGroup = document.createElement('div');
    centerGroup.style.position = 'absolute';
    const viewportWidth = animationDiv.clientWidth || 800;
    const charWidth = isMobile() ? 23 : 30;
    const centerPosition = (viewportWidth / 2) - (offset * charWidth / 2);
    centerGroup.style.left = `${centerPosition}px`;
    centerGroup.style.width = '100%';
    
    const cipherIndicator = document.createElement('div');
    cipherIndicator.className = 'column-indicator cipher-indicator';
    cipherIndicator.textContent = isMobile() ? 'C' : '↓ C';
    cipherIndicator.style.left = `${offset * charWidth}px`;
    cipherIndicator.style.position = 'absolute';
    centerGroup.appendChild(cipherIndicator);
    
    const plaintextIndicator = document.createElement('div');
    plaintextIndicator.className = 'column-indicator plaintext-indicator';
    plaintextIndicator.textContent = isMobile() ? 'P' : '↓ P';
    plaintextIndicator.style.left = '0px';
    plaintextIndicator.style.position = 'absolute';
    centerGroup.appendChild(plaintextIndicator);
    
    indicatorContainer.appendChild(centerGroup);
    
    animationDiv.insertBefore(indicatorContainer, scrollWrapper);
    
    // Add scroll listener
    scrollWrapper.addEventListener('scroll', handleDecryptScroll);
    
    // Reset animation
    currentAnimationStep = 0;
    
    // Check and animate initially visible strips
    setTimeout(() => {
        const initialEvent = { target: scrollWrapper };
        handleDecryptScroll(initialEvent);
    }, 100);
}

function handleDecryptScroll(event) {
    const scrollLeft = event.target.scrollLeft;
    const stripWidth = isMobile() ? 50 : 80; // Width of strip label
    const charWidth = isMobile() ? 23 : 30; // Width of each character cell
    const viewportWidth = event.target.clientWidth;
    
    // Calculate which strips should be visible based on viewport with buffer
    const bufferSize = isMobile() ? 3 : 5; // Reduced buffer on mobile
    const startChar = Math.max(0, Math.floor((scrollLeft - stripWidth) / charWidth) - bufferSize);
    const endChar = Math.min(Math.ceil((scrollLeft + viewportWidth) / charWidth) + bufferSize, animatedPlaintext.length);
    
    // Update visible strips and animate when they reach center
    const strips = event.target.closest('.animation-container').querySelectorAll('.animated-strip');
    strips.forEach((strip, index) => {
        if (index >= startChar && index < endChar) {
            strip.style.display = 'flex';
            const content = strip.querySelector('.strip-content');
            
            if (content.dataset.animated === 'false') {
                // Animate immediately for better mobile performance
                animateDecryptStripInstantly(strip, index);
            }
        } else {
            strip.style.display = 'none';
        }
    });
}

function animateDecryptStripInstantly(strip, index) {
    const content = strip.querySelector('.strip-content');
    const alignPos = parseInt(content.dataset.alignPos);
    const offset = parseInt(content.dataset.offset);
    
    // Skip if alignPos is invalid (character not found in strip)
    if (alignPos < 0 || isNaN(alignPos)) {
        console.warn(`Invalid alignPos for decrypt strip ${index}: ${alignPos}`);
        return;
    }
    
    // Mark as animated
    content.dataset.animated = 'true';
    
    // Step 1: Highlight cipher position first
    // The cipher character is at position (alignPos + offset) in the doubled strip
    const cipherPos = alignPos + offset;
    const cipherCell = content.children[cipherPos];
    if (cipherCell && cipherCell.classList.contains('strip-char')) {
        cipherCell.classList.add('cipher-highlight');
    }
    
    // Step 2: Highlight plaintext position after a delay
    setTimeout(() => {
        const plaintextCell = content.children[alignPos];
        if (plaintextCell && plaintextCell.classList.contains('strip-char')) {
            plaintextCell.classList.add('plaintext-highlight');
        }
    }, 500); // Delay to show the progression
}

function initializeDecryptAnimationControls() {
    const resetBtn = document.getElementById('resetAnimationDecrypt');
    
    resetBtn.addEventListener('click', () => {
        resetDecryptAnimation();
    });
}

function resetDecryptAnimation() {
    // Reset all strips to initial aligned state
    const container = document.getElementById('animationContainerDecrypt');
    const strips = container.querySelectorAll('.animated-strip');
    strips.forEach((strip, index) => {
        const content = strip.querySelector('.strip-content');
        const alignPos = parseInt(content.dataset.alignPos);
        const offset = parseInt(content.dataset.offset);
        const charWidth = 30;
        
        // Reset to initial centered position
        const viewportWidth = strip.parentElement.parentElement.clientWidth || 800;
        const centerPosition = (viewportWidth / 2) - 80;
        const initialTranslateX = centerPosition - (alignPos * charWidth) - 96; // -96 to shift left 1 inch
        content.style.transform = `translateX(${initialTranslateX}px)`;
        content.style.transition = 'transform 0.3s ease';
        content.dataset.animated = 'false';
        
        // Reset visibility
        strip.style.display = index < 10 ? 'flex' : 'none';
    });
    
    // Reset highlights
    container.querySelectorAll('.strip-char').forEach(char => {
        char.classList.remove('plaintext-highlight', 'cipher-highlight');
    });
    
    // Reset scroll position
    const scrollWrapper = container.querySelector('.scroll-wrapper');
    if (scrollWrapper) {
        scrollWrapper.scrollLeft = 0;
    }
}