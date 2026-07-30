const { execSync } = require('child_process');
try {
  const result = execSync('npx jest src/pages/dashboard/DashboardPage.test.tsx --watchAll=false --runInBand');
  console.log(result.toString());
} catch (e) {
  console.log(e.stdout.toString());
  console.log(e.stderr.toString());
}
