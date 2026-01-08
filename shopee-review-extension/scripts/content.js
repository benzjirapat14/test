// ========================================
// Shopee Review Content Script
// ========================================

console.log('Shopee Review Extension: Content script loaded');

// ========================================
// Listen for messages from side panel
// ========================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);

  if (request.action === 'getReviews') {
    getUnrepliedReviews().then(reviews => {
      sendResponse({ success: true, reviews });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'sendReply') {
    sendReplyToReview(request.reviewId, request.replyText).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  }
});

// ========================================
// Get Unreplied Reviews
// ========================================
async function getUnrepliedReviews() {
  console.log('Getting unreplied reviews...');

  // Wait for page to load
  await waitForElement('.shopee-table', 10000);

  const reviews = [];

  // Method 1: Try to find reviews from table rows
  const reviewRows = document.querySelectorAll('.shopee-table tbody tr');

  console.log(`Found ${reviewRows.length} review rows`);

  reviewRows.forEach((row, index) => {
    try {
      // Check if review has been replied
      const replyStatus = row.querySelector('[class*="reply"]');
      const hasReply = row.textContent.includes('ตอบแล้ว') ||
                       row.textContent.includes('Replied') ||
                       row.querySelector('.shopee-tag--success');

      if (hasReply) {
        console.log(`Review ${index} already has reply, skipping`);
        return;
      }

      // Extract review data
      const reviewData = extractReviewData(row, index);

      if (reviewData) {
        reviews.push(reviewData);
      }
    } catch (error) {
      console.error(`Error processing review ${index}:`, error);
    }
  });

  // Method 2: If no reviews found, try alternative selectors
  if (reviews.length === 0) {
    console.log('No reviews found with Method 1, trying alternative method...');

    const alternativeReviews = document.querySelectorAll('[class*="review-item"], [class*="ReviewItem"]');

    alternativeReviews.forEach((item, index) => {
      try {
        const reviewData = extractReviewDataAlternative(item, index);
        if (reviewData) {
          reviews.push(reviewData);
        }
      } catch (error) {
        console.error(`Error processing alternative review ${index}:`, error);
      }
    });
  }

  console.log(`Total unreplied reviews found: ${reviews.length}`);

  return reviews;
}

// ========================================
// Extract Review Data from Table Row
// ========================================
function extractReviewData(row, index) {
  try {
    // Get review text
    const textElement = row.querySelector('[class*="content"], [class*="comment"], td:nth-child(3)');
    const text = textElement ? textElement.textContent.trim() : '';

    if (!text) {
      console.log(`Review ${index} has no text, skipping`);
      return null;
    }

    // Get username
    const usernameElement = row.querySelector('[class*="username"], [class*="buyer"]');
    const username = usernameElement ? usernameElement.textContent.trim() : 'ผู้ใช้ไม่ระบุชื่อ';

    // Get rating (count stars)
    const stars = row.querySelectorAll('[class*="star"][class*="fill"], .shopee-svg-icon--active');
    const rating = stars.length || 5;

    // Get date
    const dateElement = row.querySelector('[class*="date"], [class*="time"]');
    const date = dateElement ? dateElement.textContent.trim() : '';

    // Get product name
    const productElement = row.querySelector('[class*="product"], [class*="item"]');
    const product = productElement ? productElement.textContent.trim() : '';

    // Get images
    const images = [];
    const imageElements = row.querySelectorAll('img[src*="my-test-11"]');
    imageElements.forEach(img => {
      if (img.src && !img.src.includes('avatar')) {
        images.push(img.src);
      }
    });

    // Create unique ID from index and timestamp
    const id = `review-${index}-${Date.now()}`;

    return {
      id,
      username,
      text,
      rating,
      date,
      product,
      images,
      element: row // Store reference to DOM element
    };
  } catch (error) {
    console.error('Error extracting review data:', error);
    return null;
  }
}

// ========================================
// Extract Review Data (Alternative Method)
// ========================================
function extractReviewDataAlternative(item, index) {
  try {
    const text = item.textContent.trim();

    if (!text || text.length < 5) {
      return null;
    }

    return {
      id: `review-alt-${index}-${Date.now()}`,
      username: 'ผู้ใช้',
      text: text,
      rating: 5,
      date: new Date().toLocaleDateString('th-TH'),
      product: '',
      images: [],
      element: item
    };
  } catch (error) {
    console.error('Error extracting alternative review data:', error);
    return null;
  }
}

// ========================================
// Send Reply to Review
// ========================================
async function sendReplyToReview(reviewId, replyText) {
  console.log(`Sending reply to review ${reviewId}:`, replyText);

  try {
    // Method 1: Find reply button and click it
    const replyButton = await findReplyButton(reviewId);

    if (replyButton) {
      console.log('Found reply button, clicking...');
      replyButton.click();

      // Wait for reply textarea to appear
      await sleep(1000);

      // Find textarea and fill in reply
      const textarea = await findReplyTextarea();

      if (textarea) {
        console.log('Found reply textarea, filling in text...');

        // Set value
        textarea.value = replyText;

        // Trigger input events
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));

        // Wait a bit
        await sleep(500);

        // Find and click submit button
        const submitButton = await findSubmitButton();

        if (submitButton) {
          console.log('Found submit button, clicking...');
          submitButton.click();

          // Wait for submission
          await sleep(1500);

          console.log('Reply sent successfully!');
          return;
        } else {
          throw new Error('ไม่พบปุ่มส่งคำตอบ - กรุณาส่งด้วยตนเอง');
        }
      } else {
        throw new Error('ไม่พบช่องพิมพ์คำตอบ - กรุณาตรวจสอบหน้าเว็บ');
      }
    } else {
      throw new Error('ไม่พบปุ่มตอบกลับ - กรุณาตรวจสอบว่าอยู่ในหน้าจัดการรีวิว');
    }
  } catch (error) {
    console.error('Error sending reply:', error);
    throw error;
  }
}

// ========================================
// Find Reply Button
// ========================================
async function findReplyButton(reviewId) {
  // Try to find by review ID stored in data
  const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);

  if (reviewElement) {
    const button = reviewElement.querySelector('button[class*="reply"], button:contains("ตอบกลับ")');
    if (button) return button;
  }

  // Alternative: Find first unreplied review button
  const allReplyButtons = document.querySelectorAll('button');

  for (const button of allReplyButtons) {
    const text = button.textContent.trim();
    if (text.includes('ตอบกลับ') || text.includes('Reply') || text.includes('ตอบ')) {
      // Check if this is not in a replied review
      const parent = button.closest('tr, [class*="review"]');
      if (parent && !parent.textContent.includes('ตอบแล้ว')) {
        return button;
      }
    }
  }

  // Last resort: Find any button with reply-related text
  const buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find(btn => {
    const text = btn.textContent.toLowerCase();
    return text.includes('reply') || text.includes('ตอบ');
  });
}

// ========================================
// Find Reply Textarea
// ========================================
async function findReplyTextarea() {
  await waitForElement('textarea', 5000);

  // Try to find visible textarea
  const textareas = document.querySelectorAll('textarea');

  for (const textarea of textareas) {
    if (isVisible(textarea)) {
      return textarea;
    }
  }

  // Return first textarea if none are clearly visible
  return textareas[0];
}

// ========================================
// Find Submit Button
// ========================================
async function findSubmitButton() {
  const buttons = document.querySelectorAll('button');

  for (const button of buttons) {
    const text = button.textContent.trim().toLowerCase();
    if (text.includes('ส่ง') ||
        text.includes('submit') ||
        text.includes('confirm') ||
        text.includes('ยืนยัน')) {

      if (isVisible(button)) {
        return button;
      }
    }
  }

  return null;
}

// ========================================
// Utility Functions
// ========================================
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElement = () => {
      const element = document.querySelector(selector);

      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkElement, 100);
      }
    };

    checkElement();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isVisible(element) {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return style.display !== 'none' &&
         style.visibility !== 'hidden' &&
         style.opacity !== '0' &&
         element.offsetWidth > 0 &&
         element.offsetHeight > 0;
}

// ========================================
// Initialize
// ========================================
console.log('Shopee Review Extension: Content script initialized');
