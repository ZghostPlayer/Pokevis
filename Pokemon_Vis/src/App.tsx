import React, { useState, useRef, useEffect} from 'react';
import './App.css'

interface PokemonType {
  type: { name: string };
}

interface Pokemon {
  name: string;
  types: PokemonType[];
  image: string;
}

function App(){
  const tiltRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const numberOfPokemons = 8; // Defina quantos Pokémon você quer buscar
      let fetchedPokemons: Pokemon[] = [];

      for (let i = 1; i <= numberOfPokemons; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await response.json();

        const pokemon: Pokemon = {
          name: data.name,
          // Ajuste aqui para mapear corretamente para o formato esperado pela interface
          types: data.types.map((typeInfo: { type: { name: string } }) => ({
            type: typeInfo.type
          })),
          image: data.sprites.front_default,
        };

        fetchedPokemons.push(pokemon);
      }

      console.log(fetchedPokemons);
      setPokemon(fetchedPokemons);
    };

    fetchPokemons();
  }, []);

  const typeToBackgroundColor : Record<string, string> = {
  
    water: 'bg-blue-400',
    fire: 'bg-red-400',
    grass: 'bg-green-400',
    electric: 'bg-yellow-300',
    psychic: 'bg-purple-400',
    normal: 'bg-gray-400',
    // Adicione mais tipos e cores conforme necessário
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
  
    const { left, top, width, height } = tiltRef.current.getBoundingClientRect();
    const centerX = (left + width / 2);
    const centerY = (top + height / 2);
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / height) * 20; // Ajuste conforme necessário
    const rotateY = (mouseX / width) * -20; // Ajuste conforme necessário
    const brightness = 100 + Math.abs(mouseX / width) * 20; // Ajusta o brilho
  
    // Calcula a sombra com base na posição do mouse
    const shadowX = (mouseX / width) * 20;
    const shadowY = (mouseY / height) * 20;
  
    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      boxShadow: `${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.5)`,
      filter: `brightness(${brightness}%)`
    });
  };

  const handleMouseLeave = () => {
    // Redefine os estilos para valores padrão
    setStyle({
      transform: 'rotateX(0deg) rotateY(0deg)', // Volta para a posição original
      boxShadow: 'none', // Remove a sombra
      filter: 'brightness(100%)', // Redefine o brilho
      transition: 'transform 0.5s, box-shadow 0.5s, filter 0.5s', // Transição suave
    });
  };

   return(
  <div className={`App min-h-screen bg-gray-700 flex flex-row justify-center items-center`}>
    {/* <div className="bg-purple-500 w-20 h-80">

    </div> */}

    <div 
    ref={tiltRef}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    style={style}
    className="card">
      <div className="grid grid-cols-4 gap-4 p-2"> {/* Ajuste o grid-cols conforme necessário */}
      {pokemon.map((pokemonItem, index) => {
          // Corrigindo o acesso à propriedade types para cada Pokémon individual
          console.log(pokemonItem.types[0].type.name);
          

          // Atribuição defensiva da cor de fundo
          let backgroundColor = 'bg-gray-200'; // Valor padrão
          if (pokemonItem.types.length > 0 && pokemonItem.types[0]) {
            const firstType = pokemonItem.types[0].type.name;
            backgroundColor = typeToBackgroundColor[firstType] || 'bg-gray-200';
          }

          //console.log("Cor de fundo:", backgroundColor);

          return (
            <div key={index} className="bg-white p-2 flex flex-col items-center justify-center rounded-lg shadow">
              <div className="w-full bg-gray-800 text-white text-center py-1 rounded-t-lg">
                <h3 className="text-md font-semibold">{pokemonItem.name.toUpperCase()}</h3>
              </div>
              <div className={`w-full py-1 px-9 ${backgroundColor}`}>
                <img src={pokemonItem.image} alt={pokemonItem.name} className="w-20 h-20" />
              </div>
              <div className="w-full bg-gray-800 text-white text-center py-1 rounded-b-lg">
                <p className="text-sm font-serif">Type: {pokemonItem.types.map(t => t.type.name).join(', ')}</p>
              </div>
            </div>
          );
        })}
  </div>
    </div> 

    {/* <div className="bg-purple-500 w-20 h-80">

    </div>      */}
  </div>
  )
}
export default App
