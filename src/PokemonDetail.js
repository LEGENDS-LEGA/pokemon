import React from "react";
import "./PokemonDetail.css";

function PokemonDetail({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="pokemon-detail">
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Types: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
      <p>Abilities: {pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
      <p>Stats:</p>
      <ul>
        {pokemon.stats.map((stat) => (
          <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonDetail;
