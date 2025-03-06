import axios from 'axios';
import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec);

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

declare global {
  // eslint-disable-next-line no-var
  var testResources: {
    apiProcess?: any;
    app?: any;
    apiUrl?: string;
    port?: number;
  };
}
global.testResources = {};

async function waitForServer(url: string, retries = 30, interval = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(url);
      return true;
    } catch (error) {
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  throw new Error(`Server at ${url} did not become available after ${retries} attempts`);
}


async function startApiServer() {
  // Dynamically allocate a port
  const PORT = process.env.TEST_PORT || 3000;
  process.env.PORT = PORT.toString();
  global.testResources.port = Number(PORT);
  
  // Store the API URL in global for tests to use
  global.testResources.apiUrl = `http://localhost:${PORT}`;
  
  return new Promise<void>((resolve, reject) => {
    console.log('🚀 Starting API server...');
    
    // Use spawn instead of exec to get better control over the process
    const apiProcess = spawn('npx', ['nx', 'serve', 'my-express-api', `--port=${PORT}`, '--watch=false'], {
      stdio: 'pipe',
      detached: false,
      env: { ...process.env }
    });
    
    global.testResources.apiProcess = apiProcess;
    
    let output = '';
    
    apiProcess.stdout.on('data', (data) => {
      const message = data.toString();
      output += message;
      console.log(`API: ${message.trim()}`);
      
      // Look for indicators that the server is ready
      if (message.includes('Listening at') || message.includes('Server is running')) {
        // Server is ready, perform health check to confirm
        waitForServer(`${global.testResources.apiUrl}/health`)
          .then(() => {
            console.log(`✅ API server is up and running at ${global.testResources.apiUrl}`);
            resolve();
          })
          .catch((err) => {
            console.error('Health check failed:', err.message);
            reject(err);
          });
      }
    });
    
    apiProcess.stderr.on('data', (data) => {
      console.error(`API Error: ${data.toString().trim()}`);
    });
    
    apiProcess.on('error', (err) => {
      console.error('Failed to start API process:', err);
      reject(err);
    });
    
    apiProcess.on('close', (code) => {
      if (code !== 0 && !output.includes('Listening at')) {
        console.error(`API process exited with code ${code}`);
        reject(new Error(`API process exited with code ${code}`));
      }
    });
    
    // Set a timeout in case we never detect the server starting
    setTimeout(() => {
      // If we haven't resolved by now, assume server is running
      // even if we didn't catch the exact startup message
      waitForServer(`${global.testResources.apiUrl}/health`)
        .then(() => {
          console.log(`✅ API server is up and running at ${global.testResources.apiUrl}`);
          resolve();
        })
        .catch(() => {
          console.log('Assuming API server is running without health endpoint...');
          resolve();
        });
    }, 10000);
  });
}

module.exports = async function () {
  try {
    
    // Start the API server
    await startApiServer();
    
    // You can add more setup tasks here:
    // - Seed test data
    // - Set up test users
    // - Initialize other services
    
    console.log('✅ Global setup complete');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    process.exit(1);
  }
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
