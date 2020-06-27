// https://cors-anywhere.herokuapp.com/

const baseEndpoint = 'https://api.themoviedb.org/3';
const apiKey = ' [ ADD YOUR API KEY ]';

async function tvDb({search = ''}){
    try{
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${baseEndpoint}/search/tv/${apiKey}&query=${search}`);
        const data = await response.json();
        // console.log(data);
            return data;
    } catch (err) {
        handleError(err);
    }
}

const search = document.querySelector('#search');
const resultList = document.querySelector('.result-list');
const resultImg = document.querySelector('.result-img');
const resultTimer = document.querySelector('.result-timer');
const hoursPerDay = document.querySelector('.result-hours-per-day');

search.addEventListener('input', async function(){

    // Create the result list if the there are mopre than 2 character in the search input
    if (search.value.length > 2) {
        const tvShow = await tvDb({search: search.value});
        resultList.innerHTML = 
        ` 
        <li data-id='${tvShow.results[0].id}' data-name='${tvShow.results[0].name}' data-poster='${tvShow.results[0].poster_path}'>${tvShow.results[0].name}
        ${ tvShow.results[0].backdrop_path != null ? `<img src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tvShow.results[0].backdrop_path}" data-id="${tvShow.results[0].id}" data-poster="${tvShow.results[0].poster_path}" data-name="${tvShow.results[0].name}"></img>` :  `` } </li>
        
        <li data-id='${tvShow.results[1].id}' data-name='${tvShow.results[1].name}' data-poster='${tvShow.results[1].poster_path}'>${tvShow.results[1].name}
        ${ tvShow.results[1].backdrop_path != null ? `<img src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tvShow.results[1].backdrop_path}" data-id="${tvShow.results[1].id}" data-poster="${tvShow.results[1].poster_path}" data-name="${tvShow.results[1].name}"></img>` :  `` } </li>
        
        <li data-id='${tvShow.results[2].id}' data-name='${tvShow.results[2].name}' data-poster='${tvShow.results[2].poster_path}'>${tvShow.results[2].name}
        ${ tvShow.results[2].backdrop_path != null ? `<img src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tvShow.results[2].backdrop_path}" data-id="${tvShow.results[2].id}" data-poster="${tvShow.results[2].poster_path}" data-name="${tvShow.results[2].name}"></img>` :  `` } </li>
        
        <li data-id='${tvShow.results[3].id}' data-name='${tvShow.results[3].name}' data-poster='${tvShow.results[3].poster_path}'>${tvShow.results[3].name}
        ${ tvShow.results[3].backdrop_path != null ? `<img src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tvShow.results[3].backdrop_path}" data-id="${tvShow.results[3].id}" data-poster="${tvShow.results[3].poster_path}" data-name="${tvShow.results[3].name}"></img>` :  `` } </li>`;
    } else if (search.value.length == 0){
        // Clear the result list if the search input empty
        resultList.children[3].remove();
        resultList.children[2].remove();
        resultList.children[1].remove();
        resultList.children[0].remove();
    }

});

resultList.addEventListener('click', async function(e) {
    // search.removeAttribute("autofocus");
    
    // TV Show counter
    const response = await fetch(`${baseEndpoint}/tv/${e.target.dataset.id}${apiKey}`);
    const data = await response.json();

    // TV Show poster
    resultImg.innerHTML = `<p>${e.target.dataset.name}<br>
    <span class="result-season">${data.number_of_seasons} Seasons (${data.number_of_episodes} Episodes)</span></p>
    <img src='https://image.tmdb.org/t/p/w300_and_h450_bestv2${e.target.dataset.poster}' alt='${e.target.dataset.name}'></img>`;

    // Clear the result list after click on the selected tv show
    search.value = '';
    resultList.children[3].remove();
    resultList.children[2].remove();
    resultList.children[1].remove();
    resultList.children[0].remove();

    // Update the counter based of watch time
    hoursPerDay.innerHTML = `<p>I watch <input type="number" id="watch-time" name="watch-time" maxlength="2" min="1" max="24" placeholder="24" autocomplete="off" autofocus> hours / day</p>`;
    
    const watchTime = document.querySelector('#watch-time');

    watchTime.addEventListener('input', function(){
        oneDayInMinutes = watchTime.value * 60;
        counter(oneDayInMinutes);
    })
    
    // Counter
    
    let oneDayInMinutes = 1440;

    function counter(oneDayInMinutes){    
        let totalTime = 0;
        let days = 0;
        let hours = 0;
        let minutes = 0;    
        // Total in minutes
        totalTime = data.number_of_episodes * data.episode_run_time[0];

        // Day (1 day is 1440 minutes)
        if (totalTime > oneDayInMinutes) {
            days = Math.floor(totalTime / oneDayInMinutes);
        }

        // Hours
        if (days >= 0) {
            hours = Math.floor( (totalTime-(days * oneDayInMinutes)) / 60 );  
        }

        // Minutes
        if (hours >= 0) {
            minutes = Math.floor( (totalTime-(days * oneDayInMinutes)) - (60 * hours) );
        }

        resultTimer.innerHTML = `<p>${days} Days ${hours} Hours ${minutes} Minutes</p>`;

    }
    counter(oneDayInMinutes);

});


