// update-db-enum.js
const sequelize = require("./db");

async function updateEnum() {
  try {
    console.log("Updating Blocks table enum...");
    
    // Добавляем 'faq' в enum для поля type
    await sequelize.query(`
      ALTER TYPE "enum_Blocks_type" ADD VALUE 'faq';
    `);
    
    console.log("✅ Successfully added 'faq' to enum");
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("✅ 'faq' value already exists in enum");
    } else {
      console.error("❌ Error updating enum:", error.message);
    }
  } finally {
    await sequelize.close();
  }
}

updateEnum();

