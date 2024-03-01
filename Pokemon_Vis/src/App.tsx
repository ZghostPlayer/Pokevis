import React, { useState, useRef, useEffect} from 'react';
import './App.css'

interface PokemonType {
  type: string;
}

interface pokemonStats{
  stat: string
  base_stat: number
}

interface pokemonAbilities{
  url: string
  details?: AbilityDetail;
}

interface Pokemon {
  name: string;
  types: PokemonType[];
  image: string;
  stat: pokemonStats[];
  abilities: pokemonAbilities[];
}

interface PokemonBasicInfo {
  name: string;
  url: string;
}

interface AbilityDetail {
  name: string;
  effect: string;
}


function App(){
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [pokemonCount, setPokemonCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isClickedLeftArrow, setIsClickedLeftArrow] = useState(false);
  const [isClickedRightArrow, setIsClickedRightArrow] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [expandedPokemon, setExpandedPokemon] = useState<Pokemon | null>(null);
  const [expandedCardRotation, setExpandedCardRotation] = useState(0);
  const numberOfPokemons = 8;

  useEffect(() => {

    const fetchPokemons = async () => {
      const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemons}&offset=${offset}`);
      const listData = await listResponse.json();
  
      setPokemonCount(listData.count);

      const detailsPromises = listData.results.map(async (pokemonBasicInfo: PokemonBasicInfo) => {
        const detailResponse = await fetch(pokemonBasicInfo.url);
        const pokemonDetail = await detailResponse.json();
  
        const abilitiesPromises = pokemonDetail.abilities.map(async (abilitiesInfo: { ability: { url: string } }) => {
          const details = await fetchAbilityDetails(abilitiesInfo.ability.url);
          return {
            url: abilitiesInfo.ability.url,
            details: details
          };
        });
        const abilitiesDetails = await Promise.all(abilitiesPromises);
  
        return {
          name: pokemonDetail.name,
          types: pokemonDetail.types.map((typeInfo: { type: { name: string } }) => ({
            type: typeInfo.type.name
          })),
          image: pokemonDetail.sprites.front_default,
          stat: pokemonDetail.stats.map((statInfo: { stat: { name: string }; base_stat: number }) => ({
            stat: statInfo.stat.name,
            base_stat: statInfo.base_stat
          })),
          abilities: abilitiesDetails
        };
      });
  
      const fetchedPokemons: Pokemon[] = await Promise.all(detailsPromises);
      setPokemon(fetchedPokemons);

    //   fetchedPokemons.forEach(pokemon => {
    //     console.log(`Pokemon: ${pokemon.name}`);
    //     pokemon.abilities.forEach(ability => {
    //       if (ability.details) {
    //         console.log(`Ability Name: ${ability.details.name}, Effect: ${ability.details.effect}`);
    //       } else {
    //         console.log('Ability details not loaded yet');
    //       }
    //     });
    //   });
    };
  
    fetchPokemons();
  }, [offset, numberOfPokemons]);

  const fetchAbilityDetails = async (url: string): Promise<AbilityDetail> => {
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      const name = data.name;
      const effectEntry = data.effect_entries.find((entry: any) => entry.language.name === 'en');
      const effect = effectEntry ? effectEntry.short_effect : ''; // Ajuste aqui
  
      return { name, effect };
    } catch (error) {
      console.error('Error fetching ability details:', error);
      return { name: '', effect: '' };
    }
  };
  

  const goToNextPage = () => {
    if(isButtonDisabled) return;

    setIsButtonDisabled(true)

    setOffset(prev => prev + numberOfPokemons);
    console.log(offset)
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

  const handleCardClick = (pokemon: Pokemon) => {
    setExpandedPokemon(pokemon);
  };

  const expandedCardHandleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) { // Verifica se o botão esquerdo do mouse está pressionado
      const rotationSpeed = 0.5; // Velocidade de rotação (ajuste conforme necessário)
      const deltaX = event.movementX; // Movimento horizontal do mouse
      const newRotation = expandedCardRotation + deltaX * rotationSpeed;
      setExpandedCardRotation(newRotation);
    }
  };

  const typeToBackgroundColor : Record<string, string> = {
    water: 'bg-blue-400',
    fire: 'bg-red-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400',
    psychic: 'bg-purple-500',
    normal: 'bg-gray-400',
    bug: 'bg-lime-500',
    fairy: 'bg-pink-400',
    poison: 'bg-violet-600',
    ground: 'bg-amber-600',
    fighting: 'bg-red-700',
    rock: 'bg-yellow-800',
    ghost: 'bg-indigo-700',
    ice: 'bg-blue-300',
    dragon: 'bg-orange-500',
    dark: 'bg-gray-800',
    steel: 'bg-blueGray-600',
    // Adicione mais tipos e cores conforme necessário
  };

  const typeToBackgroundImage : Record<string, string> = {
  
    water: `water_img.jpg`,
    fire: `fire_img.jpg`,
    grass: `grass_img.jpg`,
    electric: 'eletric_img.jpg',
    psychic: 'psychic_img.jpg',
    normal: 'normal_img.jpg',
    bug: 'bug_img.jpg',
    fairy: 'fairy_img.jpg',
    poison: 'poison_img.jpg',
    ground: 'ground_img.jpg',
    fighting: 'fighting_img.jpg',
    rock: 'rock_img.jpg',
    ghost: 'ghost_img.jpg',
    ice: 'icy_img.jpg',
    dragon: 'dragon_img.jpg',
    dark: 'dark_img.jpg',
    steel: 'steel_img.jpg',
    // Adicione mais tipos e cores conforme necessário
  };

  const typeToImageSymbol : Record<string, string> = {
    water: `water_symbol.jpg`,
    fire: `fire_symbol.jpg`,
    grass: `grass_symbol.jpg`,
    electric: 'eletric_symbol.jpg',
    psychic: 'psychic_symbol.jpg',
    normal: 'normal_symbol.jpg',
    bug: 'bug_symbol.jpg',
    fairy: 'fairy_symbol.jpg',
    poison: 'poison_symbol.jpg',
    ground: 'ground_symbol.jpg',
    fighting: 'fighting_symbol.jpg',
    rock: 'rock_symbol.jpg',
    ghost: 'ghost_symbol.jpg',
    ice: 'ice_symbol.jpg',
    dragon: 'dragon_symbol.jpg',
    dark: 'dark_symbol.jpg',
    steel: 'steel_symbol.jpg',
  };

  const typeToBackgroundTheme : Record<string, string> = {
    water: 'from-blue-400',
    fire: 'from-red-500',
    grass: 'from-green-500',
    electric: 'from-yellow-400',
    psychic: 'from-purple-500',
    normal: 'from-gray-400',
    bug: 'from-lime-500',
    fairy: 'from-pink-400',
    poison: 'from-violet-600',
    ground: 'from-amber-600',
    fighting: 'from-red-700',
    rock: 'from-yellow-800',
    ghost: 'from-indigo-700',
    ice: 'from-blue-300',
    dragon: 'from-orange-500',
    dark: 'from-gray-800',
    steel: 'from-blueGray-600',
    // Adicione mais tipos e cores conforme necessário
  };

  const elementAltDescription : Record<string, string> = {
    water: 'Water symbol',
    fire: 'Fire symbol',
    grass: 'Grass symbol',
    electric: 'Eletric symbol',
    psychic: 'Psychic symbol',
    normal: 'Normal symbol',
    bug: 'Bug symbol',
    fairy: 'Fairy symbol',
    poison: 'Poison symbol',
    ground: 'Ground symbol',
    fighting: 'Fighting symbol',
    rock: 'Rock symbol',
    ghost: 'Ghost symbol',
    ice: 'Ice symbol',
    dragon: 'Dragon symbol',
    dark: 'Dark symbol',
    steel: 'Steel symbol',
    // Adicione mais tipos e cores conforme necessário
  };

  

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
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

  const handleExpandedMouseDown = () => {
    document.addEventListener('mousemove', handleExpandedMouseMove);
    document.addEventListener('mouseup', handleExpandedMouseUp);
  };
  
  const handleExpandedMouseMove = (event: MouseEvent) => {
    if (event.buttons === 1) {
      const rotationSpeed = 0.5;
      const deltaX = event.movementX;
      setExpandedCardRotation((prevRotation) => prevRotation + deltaX * rotationSpeed);
    }
  };
  
  const handleExpandedMouseUp = () => {
    document.removeEventListener('mousemove', handleExpandedMouseMove);
    document.removeEventListener('mouseup', handleExpandedMouseUp);
  };

  console.log("Offset:", offset);
  console.log("Number of Pokemons:", numberOfPokemons);
  console.log("Pokemon Count:", pokemonCount);
  const isLastPage = offset + numberOfPokemons >= pokemonCount;
  console.log("Is Last Page:", isLastPage);


  const expanded = expandedPokemon?.types[0].type || 'bg-gray-200'
  const backgroundColors = typeToBackgroundColor[expanded]
  const backgroundImage = typeToBackgroundImage[expanded]
  const symbolImage = typeToImageSymbol[expanded]
  const backgroundTheme = typeToBackgroundTheme[expanded]
  const eAltDescription = elementAltDescription[expanded]


  const handleMouseLeave = (index : number) => {
    const cardRef = cardRefs.current[index];
    if (!cardRef) return;
    cardRef.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

   return(
  <div className={`App min-h-screen bg-gray-700 flex flex-row justify-center items-center`} onMouseDown={handleExpandedMouseDown}>
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
            const firstType = pokemonItem.types[0].type;
            backgroundColor = typeToBackgroundColor[firstType] || 'bg-gray-200';
          }          
          return (
            <div 
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleCardClick(pokemonItem)} // Adicione esta linha
            className={`card_2`}
             >              
              <div className="w-full bg-gray-800 text-white text-center py-1 rounded-t-lg">
                <h3 className="text-md font-semibold">{pokemonItem.name.toUpperCase()}</h3>
              </div>
              <div className={`w-full py-1 px-9 ${backgroundColor}`}>
                <img src={pokemonItem.image} alt={pokemonItem.name} className="w-20 h-20" />
              </div>
              <div className="w-full bg-gray-800 text-white text-center py-1 rounded-b-lg">
                <p className="text-sm font-serif">Type: {pokemonItem.types[0].type}</p>
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

    {expandedPokemon && (
  <div className="expandedPokemonOverlay">
    <div 
    className={`expandedPokemonCard bg-gradient-to-r ${backgroundTheme}`}
      onClick={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
      onMouseMove={expandedCardHandleMouseMove}
      style={{
        transform: `rotateY(${expandedCardRotation}deg)`,
        transition: 'transform 0.1s',
        userSelect: 'none'
      }}>
    <div className="front" style={{ display: (expandedCardRotation % 360 < 90 || (expandedCardRotation % 360 > 270 && expandedCardRotation % 360 < 360)) ? 'block' : 'none' }}>
      <div> <button onClick={() => setExpandedPokemon(null)}>Close</button> </div>
      <div className='flex justify-between items-center w-full h-10 z-10' style={{
        fontFamily: 'serif',
        fontSize: 40,
        backgroundColor: 'gray',
      }}>
      <h2 className="flex-1">{expandedPokemon.name.toUpperCase()}</h2>
  <div className="flex items-center">
    <b className="text-sm">{expandedPokemon.stat[0].stat}:</b>
    <b className={`${typeToBackgroundColor[expandedPokemon.types[0].type || 'bg-gray-300']} rounded-full ml-2`}>{expandedPokemon.stat[0].base_stat}</b>
  </div>
  </div>
      <div className='w-full h-48 flex justify-center items-center' style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', // Garante que a imagem cubra toda a área
        backgroundPosition: 'center', // Centraliza a imagem no elemento
        // Adicione outras propriedades de estilo conforme necessário
      }}>
      <img src={expandedPokemon.image} alt={expandedPokemon.name} style={{
        width: 200,
        height: 200,
      }} />
      </div>
      <div className="flex justify-between items-center w-full h-10" style={{
      fontFamily: 'serif',
      fontSize: 30,
      backgroundColor: 'gray',
      }}>
      <p className="text-lg">type: <b className="text-xl">{expandedPokemon.types[0].type}</b></p>
      <img className="w-8 h-8 mr-3 rounded-full" src={symbolImage} alt={eAltDescription} />
    </div>

      <div className="flex flex-col justify-between bg-gray-300 w-full min-h-72 h-auto py-2">
        <div className="abilities">
          {expandedPokemon.abilities.map((ability, index) => (
            <div key={index} className="ability">
              <p className="text-sm">Name: <b>{ability.details?.name.toUpperCase()}</b></p>
              <p className="text-sm">Effect: {ability.details?.effect}</p>
              <br></br>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-end w-full h-20">
          <div>
            <b className="text-xs">{expandedPokemon.stat[1].stat}:</b>
            <b className="text-4xl bg-red-600 rounded-full">{expandedPokemon.stat[1].base_stat}</b>
          </div>
          <div>
            <b className="text-xs">{expandedPokemon.stat[2].stat}:</b>
            <b className="text-4xl bg-blue-600 rounded-full">{expandedPokemon.stat[2].base_stat}</b>
          </div>
        </div>
      </div>
      {/* Inclua mais detalhes conforme necessário */}
      </div>
      <div className="back" style={{  display: expandedCardRotation % 360 >= 90 && expandedCardRotation % 360 < 270 ? 'block' : 'none'}}>
       <img
       src="/Card_Back.jpg"
      alt="Parte de trás"
      style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</div>
    </div>
  </div>
)}    

  </div>
  )
}
export default App
