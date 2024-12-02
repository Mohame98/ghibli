package main

import (
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strings"
)

type film struct {
	Id            string `json:"id"`
	Title         string `json:"title"`
	OriginalTitle string `json:"original_title"`
	Image         string `json:"image"`
	MovieBanner   string `json:"movie_banner"`
	Description   string `json:"description"`
	Director      string `json:"director"`
	Producer      string `json:"producer"`
	ReleaseDate   string `json:"release_date"`
	RunningTime   string `json:"running_time"`
}

type catalogue struct {
	Films []film `json:"films"`
}

func newCatalogue() (*catalogue, error) {
	jsonBlob, err := os.ReadFile("./ghibli.json")
	if err != nil {
		return nil, fmt.Errorf("reading json file: %w", err)
	}
	var c catalogue
	err = json.Unmarshal(jsonBlob, &c)
	return &c, nil
}

func (c *catalogue) get(id string) *film {
	for _, f := range c.Films {
		if f.Id != id {
			continue
		}
		return &f
	}
	return nil
}

func (c *catalogue) sort(order string) {
	o := 1
	if order == "descending" {
		o = -1
	}
	slices.SortFunc(c.Films, func(a film, b film) int {
		return o * strings.Compare(strings.ToLower(a.Title), strings.ToLower(b.Title))
	})
}

func (c *catalogue) filter(criteria []string) {
	c.Films = slices.DeleteFunc(c.Films, func(f film) bool {
		return !slices.Contains(criteria, f.Director)
	})
}

func (c *catalogue) search(query string) {
	c.Films = slices.DeleteFunc(c.Films, func(f film) bool {
		return !(strings.Contains(f.Title, query) ||
			strings.Contains(f.Director, query))
	})
}
