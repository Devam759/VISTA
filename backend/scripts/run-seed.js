import seedDatabase from './seedDatabase.js';

console.log('🚀 Starting seed wrapper...');
seedDatabase()
    .then(() => {
        console.log('✅ Seed wrapper finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seed wrapper failed:', error);
        process.exit(1);
    });
