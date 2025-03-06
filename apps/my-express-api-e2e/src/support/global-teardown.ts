/* eslint-disable */
import { exec } from 'child_process'
import { promisify } from 'util'
import treeKill from 'tree-kill';
const treeKillAsync = promisify(treeKill);

const execAsync = promisify(exec);
module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  try {
    
    // Stop API server (if started programmatically)
    if (global.testResources.apiProcess) {
      try {
        // Properly kill the process and its children
        await treeKillAsync(global.testResources.apiProcess.pid);
        console.log('Stopped API server process');
      } catch (error) {
        console.error('Failed to kill API process:', error);
      }
    } else {
      // If using nx serve, find and kill the process
      try {
        await execAsync('npx nx reset');
        console.log('Stopped Nx processes');
      } catch (error) {
        console.error('Failed to stop Nx processes:', error);
      }
    }
    
    // Add other cleanup tasks here
    
    console.log('✅ Global teardown complete');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    process.exit(1);
  }
};
