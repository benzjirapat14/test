// ========================================
// Background Service Worker
// ========================================

console.log('Shopee Review Extension: Background service worker loaded');

// ========================================
// Open Side Panel when extension icon is clicked
// ========================================
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked, opening side panel...');

  try {
    // Open the side panel for the current tab
    await chrome.sidePanel.open({ tabId: tab.id });
    console.log('Side panel opened successfully');
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});

// ========================================
// Enable side panel on Shopee seller pages
// ========================================
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if on Shopee seller page
    if (tab.url.includes('seller.shopee.co.th')) {
      console.log('Shopee seller page detected, enabling side panel...');

      try {
        // Enable side panel for this tab
        await chrome.sidePanel.setOptions({
          tabId: tabId,
          enabled: true
        });
      } catch (error) {
        console.error('Error enabling side panel:', error);
      }
    }
  }
});

// ========================================
// Listen for messages from content script or side panel
// ========================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  // Handle any background tasks here if needed

  return true;
});

// ========================================
// Initialize default templates on install
// ========================================
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed/updated:', details);

  if (details.reason === 'install') {
    console.log('First time installation, setting up defaults...');

    // Set default templates
    const defaultTemplates = [
      {
        id: 'template-1',
        name: 'ขอบคุณลูกค้า (5 ดาว)',
        text: 'ขอบคุณมากๆ ค่ะที่อุดหนุนร้านของเรา 🙏💖\nดีใจมากที่คุณพอใจกับสินค้านะคะ\nหวังว่าจะได้รับใช้อีกนะคะ 😊'
      },
      {
        id: 'template-2',
        name: 'ขอบคุณ + ส่วนลด',
        text: 'ขอบคุณที่อุดหนุนร้านเราค่ะ 🙏\nดีใจมากที่ลูกค้าชอบสินค้า\nรอเจอกันใหม่นะคะ มีโปรโมชั่นดีๆ รออยู่เสมอค่า 💝'
      },
      {
        id: 'template-3',
        name: 'ขออภัย (รีวิวไม่ดี)',
        text: 'ขออภัยมากๆ ค่ะสำหรับความไม่สะดวก 🙏\nทางร้านจะนำไปปรับปรุงให้ดีขึ้นค่ะ\nหากมีปัญหาอื่นๆ สามารถแจ้งทางร้านได้เลยนะคะ'
      },
      {
        id: 'template-4',
        name: 'ตอบสั้นๆ',
        text: 'ขอบคุณมากค่ะ 🙏💖'
      }
    ];

    try {
      await chrome.storage.local.set({
        templates: defaultTemplates,
        repliedCount: 0
      });
      console.log('Default templates and stats initialized');
    } catch (error) {
      console.error('Error initializing defaults:', error);
    }
  }
});

// ========================================
// Handle extension errors
// ========================================
self.addEventListener('error', (event) => {
  console.error('Background worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Background service worker initialized successfully');
