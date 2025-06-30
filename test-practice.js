// Test file to verify Progress component logic
const testScores = [8.5, 7.8, 9.2, 8.1, 7.9, 8.3];

console.log('Testing Progress component values:');
testScores.forEach(score => {
  const progressValue = score * 10;
  console.log(`Score: ${score}/10 -> Progress: ${progressValue}/100`);
  
  // Check for overflow
  if (progressValue > 100) {
    console.error(`OVERFLOW DETECTED: ${progressValue} > 100`);
  } else if (progressValue < 0) {
    console.error(`UNDERFLOW DETECTED: ${progressValue} < 0`);
  } else {
    console.log(`✓ Valid progress value: ${progressValue}`);
  }
});

// Test with max attribute
console.log('\nTesting with max attribute:');
testScores.forEach(score => {
  const progressValue = score * 10;
  const max = 100;
  const percentage = (progressValue / max) * 100;
  console.log(`Score: ${score}/10 -> Progress: ${progressValue}/${max} (${percentage}%)`);
}); 