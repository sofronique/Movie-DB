let discCurPage = 1
let topRatedCurPage = 1


const auth = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1N2JkYWM1NTRiMDJkZjk3NGRiY2U2Mjc4OTkxNTIyNiIsIm5iZiI6MTc2NDU4MjkyNC45MDcsInN1YiI6IjY5MmQ2NjBjZWQzYTc0MTRiMjUxMjA3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QGZRk0OO3jSpOUS9MZDU3PFr9yClbO-Tpr4-yabOYCU'
    }
}

addEventListener('DOMContentLoaded', () => {
    getAndShowDiscPosters()
    search()
    showGenres()

    //Lyssna efter scroll
    addEventListener('scroll', () => {
        //Kolla om scrollen är just nu nära botten
        if (
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 1
        ) {
            //Kolla om det är top rated eller discovery filmer som visas och visa mer av dem
            if (document.querySelectorAll('.disc_poster')?.length !== 0) {
                showMoreDiscPosters()
            } else if (document.querySelectorAll('.topRated_poster')?.length !== 0) {
                showMoreTopRated()
            }
        }
    })
})



function search() {
    //lyssnar efter varje bokstav i textfältet och uppdaterar filmerna.
    //text är en array av bokstäver som läggs ihopp till ett ord
    document.querySelector('#text').addEventListener('input', e => {
        let text = []
        for (i = 0; i < e.target.value.length; i++) {
            text[i] = e.target.value
        }

        fetch('https://api.themoviedb.org/3/search/movie?query=' + text, auth)
            .then(response => response.json())
            .then(result => {
                //Rensa film flödet innan sökresultatet visas
                document.querySelector('#discover').innerHTML = ''

                //Visa sökresultat
                for (let i = 0; i < result.results.length; i++) {
                    let img_path =
                        `https://image.tmdb.org/t/p/w500` + result.results[i].poster_path
                    let movie_id = result.results[i].id

                    document.querySelector('#discover').innerHTML += `<a onclick="getMovieInfo(${movie_id})"> <img src="${img_path}" alt="" class="search_poster" </a>`
                }

                //Visa discovery igen om textfältet är tomt
                if (e.target.value === '') {
                    getAndShowDiscPosters()
                    while (document.querySelectorAll('.search_poster').length !== 0) {
                        document.querySelector('.search_poster')?.remove()
                    }
                }
            })
    })
}

function getAndShowTopRatedPosters() {
    //fetchar dem högst rateade filmerna och visar dem
    fetch(
        'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=' +
        topRatedCurPage,
        auth
    )
        .then(response => response.json())
        .then(result => {
            //Tar bort alla tidigare film bilder
            while (document.querySelectorAll('img').length !== 0) {
                document.querySelector('img')?.remove()
            }

            //Visa top rated filmer
            for (let i = 0; i < result.results.length; i++) {
                let img_path =
                    `https://image.tmdb.org/t/p/w500` + result.results[i].poster_path
                let movie_id = result.results[i].id

                document.querySelector(
                    '#discover'
                ).innerHTML += `<a onclick="getMovieInfo(${movie_id})"><img src="${img_path}" alt="" class="topRated_poster" </a>`
            }
        })
}

function getAndShowDiscPosters() {
    fetch('https://api.themoviedb.org/3/discover/movie?page=' + discCurPage, auth)
        .then(response => response.json())
        .then(result => {
            for (let i = 0; i < result.results.length; i++) {
                let img_path =
                    `https://image.tmdb.org/t/p/w500` + result.results[i].poster_path
                let movie_id = result.results[i].id

                document.querySelector(
                    '#discover'
                ).innerHTML += `<a onclick="getMovieInfo(${movie_id})"><img src="${img_path}" alt="" class="disc_poster" </a>`
            }
        })
}

function showMoreDiscPosters() {
    //Ökar nuvarande sidan variabeln och fetchar nästa sida
    discCurPage++
    fetch('https://api.themoviedb.org/3/discover/movie?page=' + discCurPage, auth)
        .then(response => response.json())
        .then(result => {
            for (let i = 0; i < result.results.length; i++) {
                let img_path =
                    `https://image.tmdb.org/t/p/w500` + result.results[i].poster_path
                let movie_id = result.results[i].id

                document.querySelector(
                    '#discover'
                ).innerHTML += `<a onclick="getMovieInfo(${movie_id})"><img src="${img_path}" alt="" class="disc_poster" </a>`
            }
        })
}

function showMoreTopRated() {
    //Ökar nuvarande sidan variabeln och fetchar nästa sida
    topRatedCurPage++
    fetch(
        'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=' +
        topRatedCurPage,
        auth
    )
        .then(response => response.json())
        .then(result => {
            for (let i = 0; i < result.results.length; i++) {
                let img_path =
                    `https://image.tmdb.org/t/p/w500` + result.results[i].poster_path
                let movie_id = result.results[i].id

                document.querySelector(
                    '#discover'
                ).innerHTML += `<a onclick="getMovieInfo(${movie_id})"><img src="${img_path}" alt="" class="topRated_poster" </a>`
            }
        })
}

function getMovieInfo(movie_id) {
    //fetcha en specifik film
    fetch('https://api.themoviedb.org/3/movie/' + movie_id, auth)
        .then(response => response.json())
        .then(result => {
            //spara resultat objektet i en variabel som sedan blir sparad i localStorage
            const res = JSON.stringify(result)
            localStorage.setItem('movie', res)
            //Byter sida till info.html
            window.location.href = 'info.html'
        })
}

function showGenres() {
    //Fetchar listan av alla genre
    fetch('https://api.themoviedb.org/3/genre/movie/list', auth)
        .then(response => response.json())
        .then(result => {
            //Loopar genom alla genre
            for (let i = 0; i < result.genres.length; i++) {
                //skapar ett list element med genre idn kopplat för varje genre
                document
                    .querySelector('#genreList')
                    .appendChild(document.createElement('li'))
                document
                    .querySelectorAll('li')
                [i].setAttribute('id', result.genres[i].id)
            }

            //gör varje film klickbar med en funktion som körs varje gång man klickar på en film
            for (let i = 0; i < document.querySelectorAll('li').length - 1; i++) {
                document.querySelectorAll('li')[
                    i
                ].innerHTML += `<a onclick="showGenreMovies(${result.genres[i].id})">${result.genres[i].name}</a>`
            }
        })
}

function showGenreMovies(genreID) {
    //rensa elementet av alla filmer
    document.querySelector('#discover').innerHTML = ''

    //loopa och fetcha 50 sidor av film data
    for (let p = 1; p < 50; p++) {
        fetch('https://api.themoviedb.org/3/discover/movie?page=' + p, auth)
            .then(response => response.json())
            .then(result => {
                //Loopa genom antal resultat objekt
                for (let i = 0; i < result.results.length; i++) {
                    //loopa genom antal genre idn i dessa resultat objekt
                    for (let j = 0; j < result.results[i].genre_ids.length; j++) {
                        if (genreID === result.results[i].genre_ids[j]) {
                            let img_path =
                                `https://image.tmdb.org/t/p/w500` +
                                result.results[i].poster_path
                            let movie_id = result.results[i].id

                            document.querySelector(
                                '#discover'
                            ).innerHTML += `<a onclick="getMovieInfo(${movie_id})"> <img src="${img_path}" alt="" class="genre_poster" </a>`
                        }
                    }
                }
            })
    }
}
