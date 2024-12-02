/**
 * Catalogue class manages a collection of movies and provides methods
 * for fetching, rendering, and filtering movies.
 */
export class Catalogue {
  /**
   * @param {Array} movies - List of movie objects.
   */
  constructor(movies) {
    this.movies = movies;
    this.filteredMovies = movies;
  }

  /**
   * Fetches movies based on the current filters and sorting options.
   * Updates the filteredMovies and re-renders the movie list.
   * @param {URLSearchParams} params - URL parameters for the API request.
   * @throws Will log an error if the fetch operation fails.
   */
  async fetchFilteredMovies(params) {
    try {
      const res = await fetch(`api/films?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      this.filteredMovies = data.films;
      this.renderMovies();
    } catch (error) {
      this.renderCatchError(error);
    }
  }

  /**
   * Renders the filtered movies.
   * Clears the current view and adds corrsponding movie cards.
   */
  renderMovies() {
    const container = document.querySelector(".catalogue .view");
    container.textContent = "";
    for (const movie of this.filteredMovies) {
      const card = this.createCard(movie);
      container.appendChild(card);
    }
  }

  /**
   * Creates a card Node for a single movie.
   * @param {Object} movie - The movie object containing its data.
   * @returns {HTMLElement} The card Node representing the movie.
   */
  createCard(movie) {
    const card = document.createElement("div");
    card.classList.add("card");

    const link = document.createElement("a");
    link.href = `/film/view/${movie.id}`;
    card.appendChild(link);

    const img = document.createElement("img");
    img.src = movie.image;
    img.alt = movie.title;
    link.appendChild(img);

    const titleEl = document.createElement("p");
    titleEl.textContent = movie.title;
    const directorEl = document.createElement("p");
    directorEl.textContent = `By: ${movie.director}`;

    card.append(titleEl, directorEl);
    return card;
  }

  renderCatchError(error) {
    console.error("Error fetching movies", error);
    const container = document.querySelector(".catalogue .view");
    container.textContent = "";
    const err = document.createElement("p");
    err.textContent = `There was an error fetching the movies: ${error.message}`;
    err.classList.add("error");
    container.appendChild(err);
  }

  /**
   * Renders the director filter options in the DOM.
   * Creates a checkbox for each unique director from the movies list.
   */
  renderDirectors() {
    const container = document.querySelector(".catalogue .director");
    const uniqueDirectors = new Set(this.movies.map((movie) => movie.director));
    container.textContent = "";
    for (const director of uniqueDirectors) {
      const label = document.createElement("label");
      label.textContent = ` ${director}`;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = director;
      label.prepend(input);
      container.appendChild(label);
    }
  }
}