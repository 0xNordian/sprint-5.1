import { fetchPosts } from './apiClient';
import { report, setReport } from './reportAcudits';

const jokeBtn = document.querySelector('.acudit-btn') as HTMLButtonElement;
const jokeRating = document.querySelector('.jokeRating') as HTMLDivElement;
const joke = document.querySelector('.typewrite') as HTMLAnchorElement;

let isJokeRating = false;
let isJoke = false;
let btnStatus: -1 | 0 | 1;
let currentJoke: string;
btnStatus = -1;
//console.log("btnStatus: ", btnStatus)


jokeBtn.addEventListener('click', async () => {
    if (!isJokeRating) {
        jokeRating.style.display = 'flex';
        isJokeRating = true;
    }

    if (!isJoke) {
        joke.style.display = 'flex';
        isJoke = true;
    }

    btnStatus === -1 ? btnStatus = 0 : btnStatus = 1;
    try {
        //console.log("btnStatus: ", btnStatus)
        fetchPosts();
        const data = await fetchPosts();
        currentJoke = data.joke;
        //console.log("Fetched data: ", data)
        const jokeDiv = document.querySelector('.typewrite');
        jokeDiv!.innerHTML = data.joke;

        // Pass the joke text to the report function
        if(btnStatus === 1){
            setReport();
        }
    } catch (error) {
        console.error('Error: ', error)
    }
});

function score(dataRating: string){
    switch(dataRating){
        case 'bad':
            report(currentJoke, 1)
            break;
        case 'mid':
            report(currentJoke, 2)
            break;
        case 'good':
            report(currentJoke, 3)
            break;
    }

}

jokeRating.addEventListener('click', function (event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
        const rating = target.getAttribute('data-rating');
        if(rating){
            return score(rating);
        }
    }
});