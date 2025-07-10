// constants/blockConstants.js

const BLOCK_OPTIONS = {
  types: ['title', 'line'],
  
  title: {
    fontSize: ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "48px"],
    fontWeight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    textAlign: ["left", "center", "right", "justify"],
    marginRange: { min: 0, max: 200 }
  },
  
  line: {
    width: ["25%", "50%", "75%", "100%"],
    style: ["solid", "dashed", "dotted"],
    heightRange: { min: 1, max: 20 },
    marginRange: { min: 0, max: 200 }
  },
  
  languages: ["en", "ru", "kz", "qaz"]
};

module.exports = {
  BLOCK_OPTIONS
};