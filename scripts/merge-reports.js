#!/usr/bin/env node

/**
 * Merge Mochawesome Reports Script
 * @description Merges multiple mochawesome JSON reports into a single HTML report
 * @usage node scripts/merge-reports.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Input directories to search for reports
  inputDirs: [
    'cypress/reports/mochawesome',
    'cypress/reports/downloaded',
  ],
  // Output directory for merged report
  outputDir: 'cypress/reports/combined',
  // Merged JSON filename
  mergedJsonFile: 'merged-report.json',
  // Report options
  reportOptions: {
    reportDir: 'cypress/reports/combined',
    reportFilename: 'index',
    reportTitle: 'Cypress Test Report',
    reportPageTitle: 'Cypress Test Results',
    inline: true,
    inlineAssets: true,
    charts: true,
    code: true,
    autoOpen: false,
    overwrite: true,
    timestamp: 'longDate',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showSkipped: true,
    showHooks: 'failed',
    saveJson: true,
    saveHtml: true,
  },
};

/**
 * Find all JSON report files in given directories
 * @param {string[]} dirs - Directories to search
 * @returns {string[]} Array of JSON file paths
 */
function findJsonReports(dirs) {
  const jsonFiles = [];

  dirs.forEach((dir) => {
    const absoluteDir = path.resolve(process.cwd(), dir);

    if (!fs.existsSync(absoluteDir)) {
      console.log(`Directory not found: ${absoluteDir}`);
      return;
    }

    // Recursively find JSON files
    const findJsonInDir = (directory) => {
      const items = fs.readdirSync(directory);

      items.forEach((item) => {
        const itemPath = path.join(directory, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          findJsonInDir(itemPath);
        } else if (item.endsWith('.json') && !item.includes('merged')) {
          jsonFiles.push(itemPath);
        }
      });
    };

    findJsonInDir(absoluteDir);
  });

  return jsonFiles;
}

/**
 * Ensure output directory exists
 * @param {string} dir - Directory path
 */
function ensureDir(dir) {
  const absoluteDir = path.resolve(process.cwd(), dir);

  if (!fs.existsSync(absoluteDir)) {
    fs.mkdirSync(absoluteDir, { recursive: true });
    console.log(`Created directory: ${absoluteDir}`);
  }
}

/**
 * Clean output directory
 * @param {string} dir - Directory path
 */
function cleanDir(dir) {
  const absoluteDir = path.resolve(process.cwd(), dir);

  if (fs.existsSync(absoluteDir)) {
    fs.rmSync(absoluteDir, { recursive: true, force: true });
    console.log(`Cleaned directory: ${absoluteDir}`);
  }
}

/**
 * Merge JSON reports using mochawesome-merge
 * @param {string[]} jsonFiles - Array of JSON file paths
 * @param {string} outputFile - Output file path
 */
function mergeReports(jsonFiles, outputFile) {
  if (jsonFiles.length === 0) {
    console.log('No JSON reports found to merge.');
    return false;
  }

  console.log(`Found ${jsonFiles.length} JSON report(s) to merge:`);
  jsonFiles.forEach((file) => console.log(`  - ${file}`));

  try {
    // Create a glob pattern or list files
    const fileList = jsonFiles.join(' ');

    // Run mochawesome-merge
    const command = `npx mochawesome-merge ${fileList} > "${outputFile}"`;
    console.log(`\nMerging reports...`);
    execSync(command, { stdio: 'pipe' });

    console.log(`Merged report saved to: ${outputFile}`);
    return true;
  } catch (error) {
    console.error('Error merging reports:', error.message);
    return false;
  }
}

/**
 * Generate HTML report from merged JSON
 * @param {string} jsonFile - Path to merged JSON file
 * @param {Object} options - Report generator options
 */
function generateHtmlReport(jsonFile, options) {
  if (!fs.existsSync(jsonFile)) {
    console.log('Merged JSON file not found. Skipping HTML generation.');
    return false;
  }

  try {
    // Build marge command options
    const optionsArgs = Object.entries(options)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? `--${key}` : `--no-${key}`;
        }
        return `--${key} "${value}"`;
      })
      .join(' ');

    const command = `npx marge "${jsonFile}" ${optionsArgs}`;
    console.log(`\nGenerating HTML report...`);
    execSync(command, { stdio: 'pipe' });

    console.log(`HTML report generated in: ${options.reportDir}`);
    return true;
  } catch (error) {
    console.error('Error generating HTML report:', error.message);
    return false;
  }
}

/**
 * Copy assets (screenshots, videos) to report directory
 * @param {string} outputDir - Output directory
 */
function copyAssets(outputDir) {
  const assetDirs = [
    { src: 'cypress/screenshots', dest: path.join(outputDir, 'screenshots') },
    { src: 'cypress/videos', dest: path.join(outputDir, 'videos') },
  ];

  assetDirs.forEach(({ src, dest }) => {
    const srcPath = path.resolve(process.cwd(), src);

    if (fs.existsSync(srcPath)) {
      ensureDir(dest);

      try {
        execSync(`cp -r "${srcPath}"/* "${dest}"/ 2>/dev/null || true`, { stdio: 'pipe' });
        console.log(`Copied assets from ${src} to ${dest}`);
      } catch (error) {
        // Ignore copy errors (e.g., empty directories)
      }
    }
  });
}

/**
 * Generate summary statistics
 * @param {string} jsonFile - Path to merged JSON file
 */
function generateSummary(jsonFile) {
  if (!fs.existsSync(jsonFile)) {
    return;
  }

  try {
    const report = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const stats = report.stats;

    console.log('\n' + '='.repeat(50));
    console.log('TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests:    ${stats.tests}`);
    console.log(`Passed:         ${stats.passes} (${((stats.passes / stats.tests) * 100).toFixed(1)}%)`);
    console.log(`Failed:         ${stats.failures}`);
    console.log(`Pending:        ${stats.pending}`);
    console.log(`Skipped:        ${stats.skipped || 0}`);
    console.log(`Duration:       ${(stats.duration / 1000).toFixed(2)}s`);
    console.log(`Start Time:     ${stats.start}`);
    console.log(`End Time:       ${stats.end}`);
    console.log('='.repeat(50));

    // Return exit code based on failures
    return stats.failures === 0 ? 0 : 1;
  } catch (error) {
    console.error('Error generating summary:', error.message);
    return 1;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('Cypress Report Merger');
  console.log('='.repeat(50));
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Output directory: ${CONFIG.outputDir}`);
  console.log('');

  // Prepare output directory
  cleanDir(CONFIG.outputDir);
  ensureDir(CONFIG.outputDir);

  // Find all JSON reports
  const jsonFiles = findJsonReports(CONFIG.inputDirs);

  if (jsonFiles.length === 0) {
    console.log('\nNo reports found. Creating empty report...');

    // Create minimal empty report
    const emptyReport = {
      stats: {
        tests: 0,
        passes: 0,
        failures: 0,
        pending: 0,
        skipped: 0,
        duration: 0,
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
      results: [],
    };

    const outputFile = path.join(CONFIG.outputDir, CONFIG.mergedJsonFile);
    fs.writeFileSync(outputFile, JSON.stringify(emptyReport, null, 2));
    console.log('Empty report created.');
    process.exit(0);
  }

  // Merge reports
  const outputFile = path.join(CONFIG.outputDir, CONFIG.mergedJsonFile);
  const mergeSuccess = mergeReports(jsonFiles, outputFile);

  if (!mergeSuccess) {
    console.error('\nFailed to merge reports.');
    process.exit(1);
  }

  // Generate HTML report
  generateHtmlReport(outputFile, CONFIG.reportOptions);

  // Copy assets
  copyAssets(CONFIG.outputDir);

  // Generate and display summary
  const exitCode = generateSummary(outputFile);

  console.log('\nReport generation complete!');
  console.log(`View report: ${path.resolve(CONFIG.outputDir, 'index.html')}`);

  process.exit(exitCode);
}

// Run main function
main();
