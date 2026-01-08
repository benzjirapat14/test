// ========================================
// State Management
// ========================================
let currentReviews = [];
let currentReviewIndex = 0;
let repliedCount = 0;
let templates = [];

// ========================================
// DOM Elements
// ========================================
const elements = {
  pendingCount: document.getElementById('pendingCount'),
  repliedCount: document.getElementById('repliedCount'),
  currentReview: document.getElementById('currentReview'),
  templateSelect: document.getElementById('templateSelect'),
  replyText: document.getElementById('replyText'),
  charCount: document.getElementById('charCount'),
  loadReviewsBtn: document.getElementById('loadReviewsBtn'),
  sendReplyBtn: document.getElementById('sendReplyBtn'),
  skipBtn: document.getElementById('skipBtn'),
  statusMessage: document.getElementById('statusMessage'),
  manageTemplatesBtn: document.getElementById('manageTemplatesBtn'),
  templateModal: document.getElementById('templateModal'),
  templateList: document.getElementById('templateList'),
  newTemplateName: document.getElementById('newTemplateName'),
  newTemplateText: document.getElementById('newTemplateText'),
  addTemplateBtn: document.getElementById('addTemplateBtn'),
};

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  loadTemplates();
  loadStats();
  setupEventListeners();
});

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
  // Load Reviews Button
  elements.loadReviewsBtn.addEventListener('click', loadReviews);

  // Send Reply Button
  elements.sendReplyBtn.addEventListener('click', sendReply);

  // Skip Button
  elements.skipBtn.addEventListener('click', skipReview);

  // Template Selection
  elements.templateSelect.addEventListener('change', (e) => {
    const selectedTemplate = templates.find(t => t.id === e.target.value);
    if (selectedTemplate) {
      elements.replyText.value = selectedTemplate.text;
      updateCharCount();
    }
  });

  // Reply Text Character Count
  elements.replyText.addEventListener('input', updateCharCount);

  // Manage Templates Button
  elements.manageTemplatesBtn.addEventListener('click', openTemplateModal);

  // Add Template Button
  elements.addTemplateBtn.addEventListener('click', addTemplate);

  // Modal Close
  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', closeTemplateModal);

  // Click outside modal to close
  window.addEventListener('click', (e) => {
    if (e.target === elements.templateModal) {
      closeTemplateModal();
    }
  });
}

// ========================================
// Load Reviews from Shopee Page
// ========================================
async function loadReviews() {
  try {
    showStatus('กำลังโหลดรีวิว...', 'info');
    elements.loadReviewsBtn.disabled = true;

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if on Shopee seller page
    if (!tab.url.includes('seller.shopee.co.th')) {
      showStatus('กรุณาเปิดหน้า Shopee Seller Centre > จัดการรีวิว', 'error');
      elements.loadReviewsBtn.disabled = false;
      return;
    }

    // Send message to content script to get reviews
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getReviews' });

    if (response && response.success) {
      currentReviews = response.reviews || [];
      currentReviewIndex = 0;

      if (currentReviews.length === 0) {
        showStatus('ไม่พบรีวิวที่ยังไม่ได้ตอบกลับ', 'info');
        elements.pendingCount.textContent = '0';
      } else {
        elements.pendingCount.textContent = currentReviews.length;
        showStatus(`โหลดรีวิวสำเร็จ! พบ ${currentReviews.length} รีวิว`, 'success');
        displayCurrentReview();
        elements.sendReplyBtn.disabled = false;
        elements.skipBtn.disabled = false;
      }
    } else {
      throw new Error(response?.error || 'ไม่สามารถโหลดรีวิวได้');
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
    showStatus('เกิดข้อผิดพลาด: ' + error.message, 'error');
  } finally {
    elements.loadReviewsBtn.disabled = false;
  }
}

// ========================================
// Display Current Review
// ========================================
function displayCurrentReview() {
  if (currentReviewIndex >= currentReviews.length) {
    elements.currentReview.innerHTML = `
      <p class="empty-message">✅ ตอบรีวิวครบทุกรายการแล้ว!</p>
    `;
    elements.sendReplyBtn.disabled = true;
    elements.skipBtn.disabled = true;
    elements.replyText.value = '';
    return;
  }

  const review = currentReviews[currentReviewIndex];

  // Create stars HTML
  const starsHTML = '⭐'.repeat(review.rating || 5);

  // Create images HTML if available
  let imagesHTML = '';
  if (review.images && review.images.length > 0) {
    imagesHTML = `
      <div class="review-images">
        ${review.images.map(img => `<img src="${img}" class="review-image" alt="Review image">`).join('')}
      </div>
    `;
  }

  elements.currentReview.innerHTML = `
    <div class="review-header">
      <div class="review-avatar">${(review.username || 'U')[0].toUpperCase()}</div>
      <div class="review-info">
        <div class="review-username">${review.username || 'ผู้ใช้ไม่ระบุชื่อ'}</div>
        <div class="review-date">${review.date || '-'}</div>
      </div>
      <div class="review-rating">${starsHTML}</div>
    </div>
    ${review.product ? `<div class="review-product">📦 ${review.product}</div>` : ''}
    <div class="review-text">${review.text || 'ไม่มีข้อความรีวิว'}</div>
    ${imagesHTML}
  `;

  // Update pending count
  elements.pendingCount.textContent = currentReviews.length - currentReviewIndex;
}

// ========================================
// Send Reply
// ========================================
async function sendReply() {
  const replyText = elements.replyText.value.trim();

  if (!replyText) {
    showStatus('กรุณาพิมพ์ข้อความตอบกลับ', 'error');
    return;
  }

  if (replyText.length > 500) {
    showStatus('ข้อความยาวเกิน 500 ตัวอักษร', 'error');
    return;
  }

  try {
    elements.sendReplyBtn.disabled = true;
    showStatus('กำลังส่งคำตอบ...', 'info');

    const currentReview = currentReviews[currentReviewIndex];

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send message to content script to reply
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'sendReply',
      reviewId: currentReview.id,
      replyText: replyText
    });

    if (response && response.success) {
      repliedCount++;
      elements.repliedCount.textContent = repliedCount;
      showStatus('✅ ส่งคำตอบสำเร็จ!', 'success');

      // Clear reply text
      elements.replyText.value = '';
      updateCharCount();

      // Move to next review
      setTimeout(() => {
        nextReview();
      }, 1000);
    } else {
      throw new Error(response?.error || 'ไม่สามารถส่งคำตอบได้');
    }
  } catch (error) {
    console.error('Error sending reply:', error);
    showStatus('เกิดข้อผิดพลาด: ' + error.message, 'error');
    elements.sendReplyBtn.disabled = false;
  }
}

// ========================================
// Skip Review
// ========================================
function skipReview() {
  showStatus('ข้ามรีวิวนี้แล้ว', 'info');
  elements.replyText.value = '';
  updateCharCount();
  nextReview();
}

// ========================================
// Next Review
// ========================================
function nextReview() {
  currentReviewIndex++;
  displayCurrentReview();
  elements.sendReplyBtn.disabled = false;

  // If no more reviews, disable buttons
  if (currentReviewIndex >= currentReviews.length) {
    elements.sendReplyBtn.disabled = true;
    elements.skipBtn.disabled = true;
  }
}

// ========================================
// Character Count
// ========================================
function updateCharCount() {
  const count = elements.replyText.value.length;
  elements.charCount.textContent = count;

  if (count > 500) {
    elements.charCount.style.color = '#e74c3c';
  } else {
    elements.charCount.style.color = '#999';
  }
}

// ========================================
// Templates Management
// ========================================
async function loadTemplates() {
  try {
    const result = await chrome.storage.local.get(['templates']);
    templates = result.templates || getDefaultTemplates();

    // Save default templates if none exist
    if (!result.templates) {
      await chrome.storage.local.set({ templates });
    }

    updateTemplateSelect();
  } catch (error) {
    console.error('Error loading templates:', error);
    templates = getDefaultTemplates();
  }
}

function getDefaultTemplates() {
  return [
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
}

function updateTemplateSelect() {
  elements.templateSelect.innerHTML = '<option value="">-- เลือก Template --</option>';

  templates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.id;
    option.textContent = template.name;
    elements.templateSelect.appendChild(option);
  });
}

function updateTemplateList() {
  elements.templateList.innerHTML = '';

  if (templates.length === 0) {
    elements.templateList.innerHTML = '<p style="color: #999; text-align: center;">ยังไม่มี Template</p>';
    return;
  }

  templates.forEach(template => {
    const item = document.createElement('div');
    item.className = 'template-item';
    item.innerHTML = `
      <div class="template-content">
        <div class="template-name">${template.name}</div>
        <div class="template-text-preview">${template.text}</div>
      </div>
      <button class="btn btn-danger" data-id="${template.id}">ลบ</button>
    `;

    // Add delete button event
    const deleteBtn = item.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => deleteTemplate(template.id));

    elements.templateList.appendChild(item);
  });
}

async function addTemplate() {
  const name = elements.newTemplateName.value.trim();
  const text = elements.newTemplateText.value.trim();

  if (!name || !text) {
    showStatus('กรุณากรอกชื่อและข้อความ Template', 'error');
    return;
  }

  const newTemplate = {
    id: 'template-' + Date.now(),
    name: name,
    text: text
  };

  templates.push(newTemplate);

  try {
    await chrome.storage.local.set({ templates });
    updateTemplateSelect();
    updateTemplateList();

    // Clear inputs
    elements.newTemplateName.value = '';
    elements.newTemplateText.value = '';

    showStatus('เพิ่ม Template สำเร็จ!', 'success');
  } catch (error) {
    console.error('Error saving template:', error);
    showStatus('เกิดข้อผิดพลาดในการบันทึก Template', 'error');
  }
}

async function deleteTemplate(id) {
  if (!confirm('ต้องการลบ Template นี้หรือไม่?')) {
    return;
  }

  templates = templates.filter(t => t.id !== id);

  try {
    await chrome.storage.local.set({ templates });
    updateTemplateSelect();
    updateTemplateList();
    showStatus('ลบ Template สำเร็จ!', 'success');
  } catch (error) {
    console.error('Error deleting template:', error);
    showStatus('เกิดข้อผิดพลาดในการลบ Template', 'error');
  }
}

// ========================================
// Modal Functions
// ========================================
function openTemplateModal() {
  elements.templateModal.classList.add('show');
  updateTemplateList();
}

function closeTemplateModal() {
  elements.templateModal.classList.remove('show');
}

// ========================================
// Status Message
// ========================================
function showStatus(message, type = 'info') {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message show ${type}`;

  setTimeout(() => {
    elements.statusMessage.classList.remove('show');
  }, 3000);
}

// ========================================
// Load Stats
// ========================================
async function loadStats() {
  try {
    const result = await chrome.storage.local.get(['repliedCount']);
    repliedCount = result.repliedCount || 0;
    elements.repliedCount.textContent = repliedCount;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Save stats periodically
setInterval(async () => {
  try {
    await chrome.storage.local.set({ repliedCount });
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}, 5000);
