// bing.js
const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置项
const BING_API_CONFIG = {
  hostname: 'www.bing.com',
  port: 443,
  path: '/HPImageArchive.aspx?format=js&idx=0&n=8',
  method: 'GET',
  timeout: 5000
};

const OUTPUT_DIR = './assets/json';
const OUTPUT_FILE = 'images.json';
const OUTPUT_PATH = path.join(OUTPUT_DIR, OUTPUT_FILE);

function updateBingImages() {
  console.log('Starting to fetch Bing images...');

  const req = https.request(BING_API_CONFIG, (res) => {
    // 检查 HTTP 状态码
    if (res.statusCode !== 200) {
      console.error(`❌ Bing API request failed: ${res.statusCode}`);
      process.exit(1);
    }

    let body = [];
    res.on('data', (chunk) => body.push(chunk));

    res.on('end', () => {
      try {
        // 解析响应
        const data = JSON.parse(Buffer.concat(body).toString());
        
        // 验证数据
        if (!data.images || !Array.isArray(data.images)) {
          throw new Error('Invalid API response structure');
        }

        // 提取 URL
        const imgUrls = data.images.map(img => img.url);
        const jsonpStr = `getBingImages(${JSON.stringify(imgUrls)});`;

        // 确保目录存在并写入文件
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        fs.writeFile(OUTPUT_PATH, jsonpStr, 'utf8', (err) => {
          if (err) {
            console.error('❌ Error writing file:', err);
            process.exit(1);
          }
          // 添加这行，打印实际写入的内容
          console.log('📝 Attempting to write:', jsonpStr);
          console.log('✅ JSON data saved successfully:', OUTPUT_PATH);
        });

      } catch (error) {
        console.error('❌ Error processing response:', error);
        process.exit(1);
      }
    });
  });

  // 处理请求错误和超时
  req.on('error', (error) => {
    console.error('❌ Request error:', error);
    process.exit(1);
  });

  req.setTimeout(BING_API_CONFIG.timeout, () => {
    req.destroy();
    console.error('❌ Request timeout');
    process.exit(1);
  });

  req.end();
}

// 执行
updateBingImages();