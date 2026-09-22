async function getData() {
    const response = await fetch("data/movies.json");

    if (!response.ok) {
        throw new Error("No se pudo cargar el archivo movies.json");
    }

    const data = await response.json();

    return data;
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
        const link = $("<a>")
            .attr("href", "#")
            .text(genre)
            .attr("data-genre", genre);

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

function addButtonAction(movies) {

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
        const data = await getData();

        renderGenres(data.genres);
        renderMovies(data.movies);
        filterByGenre(data.movies);
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