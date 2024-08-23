import React, { useState, useEffect } from "react";
import "./App.css";
import PokemonDetail from "./PokemonDetail";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
        const data = await response.json();

        const detailedPromises = data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        });

        const detailedPokemons = await Promise.all(detailedPromises);
        setPokemons(detailedPokemons);
        setFilteredPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemons();

    const fetchTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        setTypes(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon types:", error);
      }
    };

    fetchTypes();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterPokemons(e.target.value, typeFilter);
  };

  const handleTypeChange = (type) => {
    setTypeFilter(type);
    filterPokemons(search, type);
    setDropdownOpen(false);
  };

  const filterPokemons = (search, type) => {
    const lowercasedSearch = search.toLowerCase();

    const filtered = pokemons.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(lowercasedSearch);

      const matchesType =
        type === "" ||
        pokemon.types.some((t) => t.type.name.toLowerCase() === type);

      return matchesName && matchesType;
    });

    setFilteredPokemons(filtered);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="App">
      <h1 className="pokimon">Pokemon List</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokemon"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {typeFilter || "All Types"}
            <span className={`arrow ${dropdownOpen ? "open" : ""}`}></span>
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div onClick={() => handleTypeChange("")}>All Types</div>
              {types.map((type) => (
                <div
                  key={type.name}
                  onClick={() => handleTypeChange(type.name)}
                >
                  {type.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="pokemon-list">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <div
              className="pokemon-card"
              key={pokemon.id}
              onClick={() => handlePokemonClick(pokemon)}
            >
              <h2>{pokemon.name}</h2>
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <p>Height: {pokemon.height}</p>
              <p>Weight: {pokemon.weight}</p>
              <p>Types: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
            </div>
          ))
        ) : (
          <p>No Pokemon</p>
        )}
      </div>
      {selectedPokemon && (
        <PokemonDetail pokemon={selectedPokemon} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;
