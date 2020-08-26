/* eslint-disable camelcase */
// https://github.com/login/oauth/authorize?client_id=Iv1.99f15ede5dd3a067&redirect_url=http%3A%2F%2Flocalhost%3A8000&scope=read%3Auser&state=123

const code = 'e551805fc812ae012a7d';
const state = '123';

const client_secret = 'xxx';
const client_id = 'Iv1.99f15ede5dd3a067';
const redirect_uri = encodeURIComponent('http://localhost:8000');

const params = `code=${code}&state=${state}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&client_id=${client_id}`;

{
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `https://github.com/login/oauth/access_token?${params}`, true);
  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
    }
  });
  xhr.send(null);
}

// access_token=xxx
// &expires_in=28800
// &refresh_token=r1.7c8046aa29a8ed09908c181ed79cba865a1d9e22a9724fe3929a273ad90f9e4db2e67979a1595342
// &refresh_token_expires_in=15897600
// &scope=&token_type=bearer
{
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.github.com/user', true);
  xhr.setRequestHeader('Authorization', 'token xxx');
  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
    }
  });
  xhr.send(null);
}
