package main

import (
	"encoding/json"
	"html/template"
	"net/http"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	catalogue, err := newCatalogue()
	if err != nil {
		app.serverError(w, r, err)
	}
	if catalogue, err = app.parseQueries(catalogue, r); err != nil {
		app.serverError(w, r, err)
	}
	tmpls, err := template.ParseFiles("./ui/html/pages/home.tmpl")
	if err != nil {
		app.serverError(w, r, err)
		return
	}
	err = tmpls.ExecuteTemplate(w, "home", catalogue)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) film(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	catalogue, err := newCatalogue()
	if err != nil {
		app.serverError(w, r, err)
	}
	f := catalogue.get(id)
	if f == nil {
		http.NotFound(w, r)
		return
	}
	tmpls, err := template.ParseFiles("./ui/html/pages/film.tmpl")
	if err != nil {
		app.serverError(w, r, err)
		return
	}
	err = tmpls.ExecuteTemplate(w, "film", f)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) APIFilms(w http.ResponseWriter, r *http.Request) {
	catalogue, err := newCatalogue()
	if err != nil {
		app.serverError(w, r, err)
	}
	if catalogue, err = app.parseQueries(catalogue, r); err != nil {
		app.serverError(w, r, err)
	}
	w.Header().Add("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(catalogue)
	if err != nil {
		app.serverError(w, r, err)
	}
}
