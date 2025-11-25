import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Models directory for backend
const BACKEND_MODEL_DIR = path.join(__dirname, '../../models');
// Models directory for frontend (public folder)
const FRONTEND_MODEL_DIR = path.join(__dirname, '../../public/models');

// Complete list of face-api.js models - using correct file names from manifest
const MODELS = [
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json',
    name: 'ssd_mobilenetv1_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1',
    name: 'ssd_mobilenetv1_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard2',
    name: 'ssd_mobilenetv1_model-shard2'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
    name: 'face_landmark_68_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
    name: 'face_landmark_68_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json',
    name: 'face_recognition_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1',
    name: 'face_recognition_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2',
    name: 'face_recognition_model-shard2'
  }
];

async function downloadFile(url, filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${path.basename(filePath)} (already exists)`);
    return;
  }

  console.log(`⬇️  Downloading ${path.basename(filePath)}...`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ Downloaded ${path.basename(filePath)}`);
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded ${path.basename(filePath)}`);
          resolve();
        });
      } else {
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

async function downloadModelsToDirectory(modelDir) {
  console.log(`\n📦 Downloading models to: ${path.resolve(modelDir)}\n`);
  
  for (const model of MODELS) {
    const filePath = path.join(modelDir, model.name);
    try {
      await downloadFile(model.url, filePath);
    } catch (error) {
      console.error(`❌ Error downloading ${model.name}:`, error.message);
      // Continue with other models
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting face-api.js model download...\n');
    
    // Download to backend models directory
    await downloadModelsToDirectory(BACKEND_MODEL_DIR);
    
    // Download to frontend public/models directory
    await downloadModelsToDirectory(FRONTEND_MODEL_DIR);
    
    console.log('\n✅ All models downloaded successfully!');
    console.log(`\nBackend models: ${path.resolve(BACKEND_MODEL_DIR)}`);
    console.log(`Frontend models: ${path.resolve(FRONTEND_MODEL_DIR)}`);
    console.log('\n💡 Make sure to serve the public/models directory in your frontend!');
  } catch (error) {
    console.error('❌ Error downloading models:', error);
    process.exit(1);
  }
}

main();
