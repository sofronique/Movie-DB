addEventListener('DOMContentLoaded', e => {
    e.preventDefault()
    const movie = JSON.parse(localStorage.getItem('movie'))

    document.querySelector('#poster').setAttribute('src', `https://image.tmdb.org/t/p/w500` + movie.poster_path)
    document.querySelector('#title').textContent = movie.title
    document.querySelector('#desc').textContent = movie.overview
    document.querySelector('#date').textContent = 'Release Date   - ' + movie.release_date

    let rating = movie.vote_average

    //Runda rating till 1 decimal
    rating = Math.round(rating * 10) / 10
    document.querySelector('#rating').textContent = rating + '/10'
})
