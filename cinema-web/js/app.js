const API_URL = "https://proyectocinemaapi.onrender.com";

async function getMovies() {
    const response = await fetch(`${API_URL}/movies`);

    if (!response.ok) {
        throw new Error("No se pudieron cargar las películas");
    }

    return await response.json();
}

async function getGenres() {
    const response = await fetch(`${API_URL}/genres`);

    if (!response.ok) {
        throw new Error("No se pudieron cargar los géneros");
    }

    return await response.json();
}

function renderMovies(movies) {
    $("#movieContainer").empty();

    movies.forEach(movie => {
        const article = $(`
            <article class="movie-card">
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
            </article>
        `);

        $("#movieContainer").append(article);
    });

    addButtonAction(movies);
}

function renderGenres(genres) {
    $("#genreContainer").empty();

    const allLink = $("<a>")
        .attr("href", "#")
        .text("Todas las películas")
        .attr("data-genre", "Todos");

    $("#genreContainer").append(allLink);

    genres.forEach(genre => {
        const genreName = typeof genre === "object" ? genre.name : genre;

        const link = $("<a>")
            .attr("href", "#")
            .text(genreName)
            .attr("data-genre", genreName);

        $("#genreContainer").append(link);
    });
}

function filterByGenre(movies) {
    $("#genreContainer a").on("click", function (event) {
        event.preventDefault();

        const selectedGenre = $(this).data("genre");

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
}

function closeMovieModal() {
    $("#closeModal").on("click", function () {
        $("#movieModal").removeClass("active");
    });

    $("#movieModal").on("click", function (event) {
        if (event.target === this) {
            $("#movieModal").removeClass("active");
        }
    });
}

function addButtonAction(movies) {
    $(".movie-card__button").on("click", function () {
        const movieId = $(this).data("movie-id");

        const movie = movies.find(movie => movie.id == movieId);

        const movieJSON = JSON.stringify(movie, null, 2);

        $("#movieJson").text(movieJSON);
        $("#movieModal").addClass("active");

        console.log(`Película seleccionada: ${movieId}`);
    });
}

async function init() {
    try {
        const [movies, genres] = await Promise.all([
            getMovies(),
            getGenres()
        ]);

        renderGenres(genres);
        renderMovies(movies);
        filterByGenre(movies);
        closeMovieModal();

        $("#year").text(new Date().getFullYear());
    } catch (error) {
        console.error("Error:", error);

        $("#movieContainer").html(`
            <p>No se pudieron cargar las películas.</p>
        `);
    }
}

$(document).ready(function () {
    init();
});