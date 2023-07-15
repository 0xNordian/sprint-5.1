export async function fetchPosts() {
  const cacheBuster = new Date().getTime();
  const url = `https://icanhazdadjoke.com/?cacheBuster=${cacheBuster}`;

  return fetch(url, {
      method: 'GET',
      headers: {
          Accept: 'application/json',
      },
  })
  .then(res => res.json())
  .then(data => data);
}