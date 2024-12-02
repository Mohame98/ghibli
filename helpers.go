package main

import (
	"net/http"
)

func (app *application) serverError(w http.ResponseWriter, r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), "method", method, "uri", uri)
	http.Error(
		w,
		http.StatusText(http.StatusInternalServerError),
		http.StatusInternalServerError,
	)
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) parseQueries(c *catalogue, r *http.Request) (*catalogue, error) {
	err := r.ParseForm()
	if err != nil {
		return c, err
	}
	filterQuery := r.Form["filter"]
	searchQuery := r.Form.Get("search")
	sortOrder := r.Form.Get("sort")
	c.sort(sortOrder)
	if len(searchQuery) != 0 {
		c.search(searchQuery)
	}
	if len(filterQuery) != 0 {
		c.filter(filterQuery)
	}
	return c, nil
}
