const movieContainer = document.getElementById("movieContainer");

async function getData() {
    const response = await fetch('data/movies.json');
    const data = await response.json();

    return data;
}

function renderMovies(movies) {

    movieContainer.innerHTML = '';

    movies.forEach(movie => {

        const article = document.createElement('article');
        article.classList.add("movie-card");

        // let texto = "<img src= " + movie.poster + " alt=" + movie.title + " class='movie-card__image'>"

        article.innerHTML =
            `<img src="${movie.poster}" alt="${movie.title}" class="movie-card__image">
            <div class="movie-card__content">
                <h4 class="movie-card__title">${movie.title}</h4>
                <p class="movie-card__description">${movie.shortDescription}</p>
                <div class="movie-card__meta">
                    <span class="movie-card__duration">${movie.duration} min</span>
                    <span class="movie-card__genre">${movie.genre}</span>
                    <span class="movie-card__genre">${palabra()}</span>
                </div>
            <button class="movie-card__button">Ver detalles</button>
        </div>`;

        movieContainer.appendChild(article);
        /*console.log(`Renderizando película: ${movie.title}`); */
    });

    function palabra() {
        return "Hola Mundo";
    }

}


async function init() {
    const data = await getData();
    renderMovies(data.movies);

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init)