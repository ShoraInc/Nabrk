// test-faq-api.js
import faqBlocksApi from './api/faqBlocksApi';

console.log('=== FAQ API TEST ===');
console.log('faqBlocksApi:', faqBlocksApi);
console.log('Methods:', Object.keys(faqBlocksApi));
console.log('createFaqBlock type:', typeof faqBlocksApi.createFaqBlock);
console.log('updateFaqBlock type:', typeof faqBlocksApi.updateFaqBlock);

// Тест создания блока
const testCreateFaqBlock = async () => {
  try {
    console.log('Testing createFaqBlock...');
    const result = await faqBlocksApi.createFaqBlock('test-page', {
      type: 'faq',
      data: {
        translations: {
          ru: 'Тестовый вопрос'
        },
        settings: {
          isExpanded: false,
          animation: 'slide'
        }
      }
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Экспортируем для тестирования
window.testFaqApi = {
  faqBlocksApi,
  testCreateFaqBlock
};

export default faqBlocksApi;