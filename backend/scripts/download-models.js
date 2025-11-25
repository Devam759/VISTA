const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

const MODEL_DIR = path.join(__dirname, '../../public/models');
const MODELS = [
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json'
];

async function downloadFile(url, filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  console.log(`Downloading ${url} to ${filePath}`);
  
  const response = await new Promise((resolve, reject) => {
    const req = https.get(url, resolve);
    req.on('error', reject);
  });
  
  if (response.statusCode !== 200) {
    throw new Error(`Failed to download ${url}: ${response.statusCode}`);
  }
  
  await pipeline(response, fs.createWriteStream(filePath));
  console.log(`✅ Downloaded ${path.basename(filePath)}`);
}

async function main() {
  try {
    console.log('Starting model download...');
    
    for (const modelUrl of MODELS) {
      const fileName = path.basename(modelUrl);
      const filePath = path.join(MODEL_DIR, fileName);
      await downloadFile(modelUrl, filePath);
    }
    
    console.log('\n✅ All models downloaded successfully!');
    console.log(`Models saved to: ${path.resolve(MODEL_DIR)}`);
  } catch (error) {
    console.error('❌ Error downloading models:', error);
    process.exit(1);
  }
}

main();
