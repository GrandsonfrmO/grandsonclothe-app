async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'papicamara22@gmail.com',
        password: 'gabriel612223341'
      })
    });
    const data = await response.json();
    console.log('Login response:', data);
    console.log('Status:', response.status);
    console.log('Set-Cookie:', response.headers.get('set-cookie'));
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

testLogin();
