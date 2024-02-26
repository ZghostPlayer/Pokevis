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

interface PokemonBasicInfo {
  name: string;
  url: string;
}

function App(){
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [pokemonCount, setPokemonCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isClickedLeftArrow, setIsClickedLeftArrow] = useState(false);
  const [isClickedRightArrow, setIsClickedRightArrow] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const numberOfPokemons = 8;

  useEffect(() => {
    const fetchPokemons = async () => {
      // URL inicial para buscar um lote de Pokémon
      const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemons}&offset=${offset}`);
      const listData = await listResponse.json();
  
      // Busca detalhes completos para cada Pokémon no lote
      const detailsPromises = listData.results.map(async (pokemonBasicInfo: PokemonBasicInfo) => {
        const detailResponse = await fetch(pokemonBasicInfo.url);
        const pokemonDetail = await detailResponse.json();
        setPokemonCount(listData.count);
  
        return {
          name: pokemonDetail.name,
          types: pokemonDetail.types.map((typeInfo: { type: { name: string } }) => ({
            type: typeInfo.type // Mantém a estrutura conforme a interface
          })),
          image: pokemonDetail.sprites.front_default,
        };
      });
  
      // Aguarda todas as promessas serem resolvidas e atualiza o estado
      const fetchedPokemons: Pokemon[] = await Promise.all(detailsPromises);
      setPokemon(fetchedPokemons);
    };
  
    fetchPokemons();
  }, [offset, numberOfPokemons]);

  const goToNextPage = () => {
    if(isButtonDisabled) return;

    setIsButtonDisabled(true)

    setOffset(prev => prev + numberOfPokemons);
    setIsClickedRightArrow(true)
    setTimeout(() => setIsClickedRightArrow(false), 500);

    setTimeout(() => {
      setIsButtonDisabled(false)
    }, 500);
  };

  const goToPreviousPage = () => {
    if(isButtonDisabled) return;

    setIsButtonDisabled(true);

    setOffset(prev => Math.max(0, prev - numberOfPokemons)); // Evita números negativos
    setIsClickedLeftArrow(true)
    setTimeout(() => setIsClickedLeftArrow(false), 500);

    setTimeout(() => {
      setIsButtonDisabled(false)
    }, 500);
  };

  const typeToBackgroundColor : Record<string, string> = {
  
    water: 'bg-blue-400',
    fire: 'bg-red-400',
    grass: 'bg-green-400',
    electric: 'bg-yellow-300',
    psychic: 'bg-rose-500',
    normal: 'bg-orange-600',
    bug: 'bg-emerald-500',
    fairy: 'bg-pink-500',
    poison: 'bg-fuchsia-600',
    ground: 'bg-yellow-500',
    fighting: 'bg-gray-500',
    rock: 'bg-stone-900',
    ghost: 'bg-violet-900',
    ice: 'bg-indigo-600',
    dragon: 'bg-cyan-600',
    dark: 'bg-rose-950',
    steel: 'bg-slate-700',
    // Adicione mais tipos e cores conforme necessário
  };

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    console.log(event)
    const cardRef = cardRefs.current[index];
    if (!cardRef) return;

    const { left, top, width, height } = cardRef.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    const rotateX = (mouseY / height) * 200;
    const rotateY = (mouseX / width) * 200;

    cardRef.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  const handleMouseLeave = (index : number) => {
    const cardRef = cardRefs.current[index];
    if (!cardRef) return;
    cardRef.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

   return(
  <div className={`App min-h-screen bg-gray-700 flex flex-row justify-center items-center`}>
    <div className="bg-purple-500 w-20 h-80 rounded-l-md flex flex-col justify-center items-center">
    <img src={`/left_arrow.svg`} alt="Left Arrow" className={isClickedLeftArrow ? 'animate-click' : `mt-0 rounded-full ${offset === 0 ? 'hidden' : ''} `}
    onClick={() => {
      if (offset > 0 && !isButtonDisabled) {
        goToPreviousPage();
      }
    }}/>
    </div>

    <div className="w-fit h-fit bg-purple-600 rounded-lg">
      <div className="card grid grid-cols-4 gap-4 p-2"> {/* Ajuste o grid-cols conforme necessário */}
      {pokemon.map((pokemonItem, index) => {         

          // Atribuição defensiva da cor de fundo
          let backgroundColor = 'bg-gray-200'; // Valor padrão
          if (pokemonItem.types.length > 0 && pokemonItem.types[0]) {
            const firstType = pokemonItem.types[0].type.name;
            backgroundColor = typeToBackgroundColor[firstType] || 'bg-gray-200';
          }

          return (
            <div 
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className="card_2"
             >              
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

   <div className="bg-purple-500 w-20 h-80 rounded-r-md flex flex-col justify-center items-center">
   <img src={`/right_arrow.svg`} alt="Right Arrow" className={isClickedRightArrow ? 'animate-click' : `mt-0 rounded-full ${offset + numberOfPokemons >= pokemonCount ? 'hidden' : ''}`}
   onClick={() => {
    if (offset + numberOfPokemons < pokemonCount && !isButtonDisabled) {
      goToNextPage();
    }
  }}/>
    </div>      
  </div>
  )
}
export default App
