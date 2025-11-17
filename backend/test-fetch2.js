try {
  const response = await fetch('http://127.0.0.1:5000/', {
    method: 'GET',
    timeout: 5000
  });
  
  const data = await response.json();
  console.log('SUCCESS:', JSON.stringify(data, null, 2));
  process.exit(0);
} catch (error) {
  console.error('ERROR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
