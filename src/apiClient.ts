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

export async function fetchPosts2() {
  const url = `https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random`;

  return fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-RapidAPI-Key': '5c938e8bd6msh0d99635cbe087a3p1c5d37jsnfd83bb08cff3',
        'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
      },
  })
  .then(res => res.json())
  .then(data => data);
}