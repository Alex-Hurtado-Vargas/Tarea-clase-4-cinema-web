const movieContainer = document.getElementById("movieContainer");
const genreContainer = document.getElementById("genreContainer");

async function getData() {
    const response = await fetch("data/movies.json");

    if (!response.ok) {
        throw new Error("No se pudo cargar el archivo movies.json");
    }

    const data = await response.json();

    return data;
}

function renderMovies(movies) {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        const article = document.createElement("article");
        article.classList.add("movie-card");

        article.innerHTML = `
            <img 
                src="${movie.poster}" 
                alt="${movie.title}" 
                class="movie-card__image"
            >

            <div class="movie-card__content">
                <h4 class="movie-card__title">${movie.title}</h4>

                <p class="movie-card__description">
                    ${movie.shortDescription}
                </p>

                <div class="movie-card__meta">
                    <span class="movie-card__genre">
                        ${movie.genre}
                    </span>

                    <span class="movie-card__duration">
                        ${movie.duration} min
                    </span>
                </div>

                <button 
                    class="movie-card__button" 
                    data-movie-id="${movie.id}">
                    Ver detalles
                </button>
            </div>
        `;

        movieContainer.appendChild(article);
    });

    addButtonAction();
}

function renderGenres(genres) {
    genreContainer.innerHTML = "";

    const allLink = document.createElement("a");

    allLink.href = "#";
    allLink.textContent = "Todas las películas";
    allLink.dataset.genre = "Todos";

    genreContainer.appendChild(allLink);

    genres.forEach(genre => {
        const link = document.createElement("a");

        link.href = "#";
        link.textContent = genre;
        link.dataset.genre = genre;

        genreContainer.appendChild(link);
    });
}

function filterByGenre(movies) {
    const genreButtons = genreContainer.querySelectorAll("a");

    genreButtons.forEach(genreButton => {
        genreButton.addEventListener("click", event => {
            event.preventDefault();

            const selectedGenre = genreButton.dataset.genre;

            if (selectedGenre === "Todos") {
                renderMovies(movies);
                return;
            }

            const filteredMovies = movies.filter(movie =>
                movie.genre
                    .split("/")
                    .map(genre => genre.trim())
                    .includes(selectedGenre)
            );

            renderMovies(filteredMovies);
        });
    });
}

function addButtonAction() {
    $(".movie-card__button").click(function () {
        const movieId = $(this).data("movie-id");

        console.log(`Película seleccionada: ${movieId}`);
    });
}

async function init() {
    try {
        const data = await getData();

        renderGenres(data.genres);
        renderMovies(data.movies);
        filterByGenre(data.movies);

        $("#year").text(new Date().getFullYear());
    } catch (error) {
        console.error("Error:", error);
        movieContainer.innerHTML = `
            <p>No se pudieron cargar las películas.</p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", init);