import { Catalogue } from "./catalogue.js";
/**
 * Initializes the Catalogue instance and sets up event listeners.
 * @returns {Catalogue} The initialized Catalogue instance.
 */
async function initializeCatalogue() {
  try {
    const res = await fetch('/api/films');
    if (!res.ok) throw new Error('Failed to fetch films');
    const data = await res.json();
    const movies = data.films; 
    const catalogue = new Catalogue(movies);
    document.querySelector(".catalogue .film-form .btn").addEventListener('click', function(e){
      filter(e, catalogue);
    });
    catalogue.renderDirectors();
    return catalogue; 
  } catch (error) {
    console.error('Error rendering initial catalogue', error);
  }
}

/**
 * Handles the filter functionality when the filter button is clicked.
 * Builds the URL parameters based on user input and fetches the filtered movies from the server.
 * @async
 * @param {Event} e - The click event triggered by the filter button.
 * @param {Catalogue} catalogue - The Catalogue instance containing the movies.
 */
async function filter(e, catalogue) {
  e.preventDefault(); 
  const params = new URLSearchParams();
  search(params)
  filterByDirectors(params)
  sortOrder(params)
  let url = new URL(window.location.href);
  url.search = params.toString();
  window.history.pushState(null, '', url);
  await catalogue.fetchFilteredMovies(params);
}

/**
 * Retrieves the value from the search bar and appends it to the URL parameters.
 * If the search bar is empty, it returns early.
 * @param {URLSearchParams} params - The URL parameters to append the search value to.
 */
function search(params){
  const searchValue = document.querySelector(".search-bar").value;
  if (!searchValue) return;
  params.append('search', searchValue)
}

/**
 * Pushes checked directors into an array and appends their values to the URL parameters.
 * @param {URLSearchParams} params - The URL parameters to append the director values to.
 */
function filterByDirectors(params){
  const checkboxes = document.querySelectorAll(".director input:checked");
  const selectedDirectors = [];
  for (const checkedbox of checkboxes) selectedDirectors.push(checkedbox.value);
  for (const director of selectedDirectors) { params.append('filter', director) }
}

/**
 * Retrieves the selected sort order from the dropdown and appends it to the URL parameters.
 * @param {URLSearchParams} params - The URL parameters to append the sort order to.
 */
function sortOrder(params){
  const sortOrder = document.querySelector(".sort").value;
  params.append('sort', sortOrder);
}

/**
 * Main function to initialize the application.
 */
function main() {
  initializeCatalogue();
}
main();