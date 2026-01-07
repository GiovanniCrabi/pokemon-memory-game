"use client";

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, RotateCcw, Loader2 } from 'lucide-react';

interface Pokemon {
    id: number;
    name: string;
    image: string;
}

interface Card {
    id: number;
    pokemonId: number;
    image: string;
    name: string;
}

export const PokemonGame = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState<number>(0);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRandomPokemons = async (): Promise<Pokemon[]> => {
        const pokemonCount = 8;
        const pokemons: Pokemon[] = [];
        const usedIds = new Set<number>();

        while (pokemons.length < pokemonCount) {
            const randomId = Math.floor(Math.random() * 151) + 1;

            if (!usedIds.has(randomId)) {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                    const data = await response.json();

                    pokemons.push({
                        id: data.id,
                        name: data.name,
                        image: data.sprites.front_default
                    });

                    usedIds.add(randomId);
                } catch (error) {
                    console.error('Erro ao buscar Pokémon:', error);
                }
            }
        }

        return pokemons;
    };

    const initializeGame = useCallback(async (): Promise<void> => {
        setLoading(true);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setGameWon(false);

        try {
            const pokemons = await fetchRandomPokemons();

            const cardPairs: Card[] = pokemons.flatMap((pokemon, index) => [
                { id: index * 2, pokemonId: pokemon.id, image: pokemon.image, name: pokemon.name },
                { id: index * 2 + 1, pokemonId: pokemon.id, image: pokemon.image, name: pokemon.name }
            ]);

            const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
            setCards(shuffledCards);
        } catch (error) {
            console.error('Erro ao inicializar o jogo:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handleCardClick = (index: number): void => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlipped;
            
            if (cards[first].pokemonId === cards[second].pokemonId) {
                setMatched([...matched, first, second]);
                setFlipped([]);
                
                if (matched.length + 2 === cards.length) {
                    setGameWon(true);
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-500 via-gray-400 to-blue-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
                    <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">Carregando Pokémon...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-400 to-blue-500 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-1 sm:gap-2">
                        <Sparkles className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
                        Pokémon Memory
                        <Sparkles className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">Encontre todos os pares de Pokémon!</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6 bg-gray-100 rounded-lg p-3 sm:p-4">
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600">Movimentos</p>
                        <p className="text-xl sm:text-2xl font-bold text-red-600">{moves}</p>
                    </div>
                    <button
                        onClick={initializeGame}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                        <RotateCcw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        Novo Jogo
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                    {cards.map((card, index) => {
                        const isFlipped = flipped.includes(index) || matched.includes(index);
                        const isMatched = matched.includes(index);

                        return (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(index)}
                                className={`aspect-square rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center overflow-hidden relative ${
                                    isFlipped
                                        ? isMatched
                                            ? 'bg-linear-to-br from-green-400 to-green-600 shadow-lg'
                                            : 'bg-linear-to-br from-blue-400 to-blue-600 shadow-lg'
                                        : 'bg-linear-to-br from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800'
                                }`}
                            >
                                {isFlipped ? (
                                    <Image
                                        src={card.image}
                                        alt={card.name}
                                        fill
                                        className="object-contain p-1 sm:p-2"
                                    />
                                ) : (
                                    <div className="text-2xl sm:text-3xl md:text-4xl">❓</div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {gameWon && (
                    <div className="text-center bg-linear-to-br from-green-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl animate-pulse">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">🎉 Parabéns! 🎉</h2>
                        <p className="text-base sm:text-lg">Você capturou todos os Pokémon em {moves} movimentos!</p>
                    </div>
                )}
            </div>
        </div>
    );
};