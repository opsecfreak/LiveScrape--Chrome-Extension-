// FIX: Declare chrome as any to resolve "Cannot find name 'chrome'" errors
// in environments where @types/chrome is not installed.
declare const chrome: any;

import { Customer, isCustomer } from '../types';

// Regular expressions for finding contact information
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

// --- Highlighting Feature ---
const HIGHLIGHT_CLASS = 'customer-extractor-highlight-a1b2c3'; // Unique class to avoid conflicts
const HIGHLIGHT_STYLE_ID = 'customer-extractor-style-a1b2c3'; // Unique ID for the style tag

/**
 * Injects CSS styles into the document head to create the highlight effect.
 */
const injectHighlightStyles = () => {
    if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = HIGHLIGHT_STYLE_ID;
    style.innerHTML = `
        @keyframes customerExtractorFadeInOut {
            0% { background-color: rgba(255, 255, 0, 0); outline: 2px solid rgba(255, 165, 0, 0); }
            10% { background-color: rgba(255, 255, 0, 0.5); outline: 2px solid rgba(255, 165, 0, 1); }
            90% { background-color: rgba(255, 255, 0, 0.5); outline: 2px solid rgba(255, 165, 0, 1); }
            100% { background-color: rgba(255, 255, 0, 0); outline: 2px solid rgba(255, 165, 0, 0); }
        }
        .${HIGHLIGHT_CLASS} {
            animation: customerExtractorFadeInOut 3s ease-in-out;
            border-radius: 3px;
            box-shadow: 0 0 0 2px transparent; 
        }
    `;
    document.head.appendChild(style);
};

/**
 * Removes the injected CSS styles from the document head.
 */
const removeHighlightStyles = () => {
    const styleElement = document.getElementById(HIGHLIGHT_STYLE_ID);
    if (styleElement) {
        styleElement.remove();
    }
};

/**
 * Temporarily highlights an HTML element by adding the animation class.
 * The class is removed after the animation completes to keep the DOM clean.
 * @param element The HTML element to highlight.
 */
const highlightElement = (element: HTMLElement) => {
    element.classList.add(HIGHLIGHT_CLASS);
    setTimeout(() => {
        element.classList.remove(HIGHLIGHT_CLASS);
    }, 3000); // Must match the animation duration
};

/**
 * Immediately removes all highlight classes from any elements on the page.
 */
const removeAllHighlights = () => {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
        el.classList.remove(HIGHLIGHT_CLASS);
    });
};
// --- End Highlighting Feature ---

let observer: MutationObserver | null = null;
let debounceTimeout: number;

const scanPageForContacts = async () => {
    console.log('Scanning page for contacts...');

    const { customers: storedCustomers = [] } = await chrome.storage.local.get('customers');
    const existingEmails = new Set(storedCustomers.map((c: Customer) => c.email));
    
    const newCustomers: Customer[] = [];

    // FIX: Define array of excluded tags to prevent TypeScript error "Property 'includes' does not exist on type 'never'".
    const EXCLUDED_TAGS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEAD', 'TITLE'];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            if (node.parentElement && EXCLUDED_TAGS.includes(node.parentElement.tagName)) {
                return NodeFilter.FILTER_REJECT;
            }
            if (!node.nodeValue?.trim()) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.nodeValue || '';
        const emails = text.match(EMAIL_REGEX);

        if (emails) {
            for (const email of emails) {
                if (!existingEmails.has(email)) {
                    const parentElement = node.parentElement;

                    if (parentElement instanceof HTMLElement) {
                        highlightElement(parentElement);

                        const contextElement = parentElement.closest('li, tr, div[class*="item"], div[class*="card"]') || parentElement;
                        
                        if (contextElement instanceof HTMLElement) {
                            const contextText = contextElement.innerText;
                        
                            let name = 'Unknown';
                            const NAME_REGEX = /\b([A-Z][a-z']{1,}(?:\s[A-Z][a-z']{1,}|\s[A-Z]\.?){1,})\b/g;
                            
                            const potentialNames = contextText.match(NAME_REGEX) || [];
                            
                            if (potentialNames.length > 0) {
                                const emailIndex = contextText.indexOf(email);
                                const nameCandidates = potentialNames.filter(pName => {
                                    const nameIndex = contextText.indexOf(pName);
                                    return Math.abs(emailIndex - nameIndex) < 250 && !pName.includes('@');
                                });

                                if (nameCandidates.length > 0) {
                                    name = nameCandidates.reduce((closest, current) => {
                                        const closestIndex = contextText.indexOf(closest);
                                        const currentIndex = contextText.indexOf(current);
                                        if (Math.abs(emailIndex - currentIndex) < Math.abs(emailIndex - closestIndex)) {
                                            return current;
                                        }
                                        return closest;
                                    });
                                }
                            }

                            const phoneMatch = contextText.match(PHONE_REGEX);

                            const customerToValidate = {
                                id: email,
                                email,
                                name: name.trim(),
                                phone: phoneMatch ? phoneMatch[0].trim() : undefined,
                            };
                            
                            if (isCustomer(customerToValidate)) {
                                newCustomers.push(customerToValidate);
                                existingEmails.add(email); 
                            }
                        }
                    }
                }
            }
        }
    }

    if (newCustomers.length > 0) {
        const updatedCustomers = [...storedCustomers, ...newCustomers];
        await chrome.storage.local.set({ customers: updatedCustomers });
    }
};

const startObserver = () => {
    if (observer) return;

    injectHighlightStyles();
    scanPageForContacts();

    observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(() => {
            const hasSignificantChanges = mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0);
            if (hasSignificantChanges) {
                scanPageForContacts();
            }
        }, 1000);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log('Mutation observer started.');
};

const stopObserver = () => {
    if (observer) {
        observer.disconnect();
        observer = null;
        console.log('Mutation observer stopped.');
    }
    removeAllHighlights();
    removeHighlightStyles();
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_SCAN') {
        startObserver();
        sendResponse({ status: 'Scanning started' });
    } else if (message.type === 'STOP_SCAN') {
        stopObserver();
        sendResponse({ status: 'Scanning stopped' });
    }
    return true;
});