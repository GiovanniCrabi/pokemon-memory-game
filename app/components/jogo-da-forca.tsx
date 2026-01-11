"use client";

import React, { useState, useEffect, useCallback, useRef, startTransition } from 'react';
import { Sparkles, RotateCcw, Loader2, Globe } from 'lucide-react';

type Idioma = 'pt' | 'en' | null;

interface GameState {
    palavra: string;
    letrasAdvinhadas: Set<string>;
    tentativasRestantes: number;
    status: 'jogando' | 'ganhou' | 'perdeu' | 'carregando';
}

export const JogoDaForca: React.FC = () => {
    const [idioma, setIdioma] = useState<Idioma>(null);
    const [gameState, setGameState] = useState<GameState>({
        palavra: '',
        letrasAdvinhadas: new Set(),
        tentativasRestantes: 12,
        status: 'carregando'
    });

    const alfabeto = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const hasInitialized = useRef(false);

    const removerAcentos = (str: string): string => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const palavrasReservaPt = [
        'bola', 'casa', 'gato', 'cachorro', 'sol', 'lua', 'estrela',
        'agua', 'fogo', 'terra', 'flor', 'arvore',
        'carro', 'bicicleta', 'aviao', 'navio',
        'mae', 'pai', 'irmao', 'amigo',
        'brincar', 'correr', 'pular', 'rir',
        'comer', 'beber', 'dormir',
        'azul', 'vermelho', 'verde', 'amarelo',
        'feliz', 'triste', 'legal',
        'peixe', 'passaro', 'leao',
        'numero', 'letra', 'palavra', 'escola',
        'livro', 'mesa', 'cadeira', 'porta', 'janela',
        'sapato', 'roupa', 'boneca', 'jogo', 'musica'
    ];

    const palavrasReservaEn = [
        'ball', 'house', 'cat', 'dog', 'sun', 'moon', 'star',
        'water', 'fire', 'earth', 'flower', 'tree',
        'car', 'bike', 'plane', 'ship',
        'mom', 'dad', 'brother', 'friend',
        'play', 'run', 'jump', 'laugh',
        'eat', 'drink', 'sleep',
        'blue', 'red', 'green', 'yellow',
        'happy', 'sad', 'cool',
        'fish', 'bird', 'lion',
        'number', 'letter', 'word', 'school',
        'book', 'table', 'chair', 'door', 'window',
        'shoe', 'shirt', 'doll', 'game', 'music'
    ];

    const textos = {
        pt: {
            titulo: 'Jogo da Forca',
            subtitulo: 'Adivinhe a palavra antes que o boneco seja enforcado!',
            tentativas: 'Tentativas Restantes',
            novaPalavra: 'Nova Palavra',
            ganhou: '🎉 Parabéns! 🎉',
            msgGanhou: 'Você acertou a palavra:',
            perdeu: '😢 Game Over! 😢',
            msgPerdeu: 'A palavra era:',
            clique: 'Clique para Jogar',
            escolhaIdioma: 'Escolha o Idioma',
            portugues: 'Português',
            ingles: 'English',
            carregando: 'Carregando palavra...'
        },
        en: {
            titulo: 'Hangman Game',
            subtitulo: 'Guess the word before the hangman is complete!',
            tentativas: 'Attempts Remaining',
            novaPalavra: 'New Word',
            ganhou: '🎉 Congratulations! 🎉',
            msgGanhou: 'You guessed the word:',
            perdeu: '😢 Game Over! 😢',
            msgPerdeu: 'The word was:',
            clique: 'Click to Play',
            escolhaIdioma: 'Choose Language',
            portugues: 'Português',
            ingles: 'English',
            carregando: 'Loading word...'
        }
    };

    const buscarNovaPalavra = useCallback(async () => {
        if (!idioma) return;

        setGameState(prev => ({ ...prev, status: 'carregando' }));

        try {
            const palavrasReserva = idioma === 'pt' ? palavrasReservaPt : palavrasReservaEn;
            const palavraEscolhida = palavrasReserva[
                Math.floor(Math.random() * palavrasReserva.length)
            ];

            setGameState({
                palavra: palavraEscolhida,
                letrasAdvinhadas: new Set(),
                tentativasRestantes: 12,
                status: 'jogando'
            });
        } catch (error) {
            console.error('Erro ao buscar palavra:', error);
            const palavrasReserva = idioma === 'pt' ? palavrasReservaPt : palavrasReservaEn;
            const palavraFallback = palavrasReserva[
                Math.floor(Math.random() * palavrasReserva.length)
            ];
            setGameState({
                palavra: palavraFallback,
                letrasAdvinhadas: new Set(),
                tentativasRestantes: 12,
                status: 'jogando'
            });
        }
    }, [idioma]);

    useEffect(() => {
        if (idioma && !hasInitialized.current) {
            hasInitialized.current = true;
            startTransition(() => {
                buscarNovaPalavra();
            });
        }
    }, [idioma, buscarNovaPalavra]);

    const selecionarIdioma = (lang: Idioma) => {
        setIdioma(lang);
    };

    const tentarLetra = (letra: string) => {
        if (gameState.status !== 'jogando') return;
        if (gameState.letrasAdvinhadas.has(letra)) return;

        const novasLetras = new Set(gameState.letrasAdvinhadas).add(letra);
        const letraCorreta = gameState.palavra.includes(letra);
        const novasTentativas = letraCorreta ? gameState.tentativasRestantes : gameState.tentativasRestantes - 1;

        const palavraCompleta = gameState.palavra
            .split('')
            .every(letra => novasLetras.has(letra));

        let novoStatus: 'jogando' | 'ganhou' | 'perdeu' | 'carregando' = gameState.status;
        if (palavraCompleta) {
            novoStatus = 'ganhou';
        } else if (novasTentativas === 0) {
            novoStatus = 'perdeu';
        }

        setGameState({
            ...gameState,
            letrasAdvinhadas: novasLetras,
            tentativasRestantes: novasTentativas,
            status: novoStatus
        });
    };

    const renderizarPalavra = () => {
        return gameState.palavra.split('').map((letra, index) => (
            <span
                key={index}
                className="w-6 h-8 sm:w-8 sm:h-10 md:w-10 md:h-12 lg:w-12 lg:h-14 mx-0.5 sm:mx-1 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold border-b-2 sm:border-b-3 md:border-b-4 border-purple-500 text-center flex items-center justify-center"
            >
                {gameState.letrasAdvinhadas.has(letra) || gameState.status === 'perdeu'
                    ? letra.toUpperCase()
                    : ''}
            </span>
        ));
    };

    const renderizarBoneco = () => {
        const partes = [
            <circle key="head" cx="100" cy="50" r="20" stroke="black" strokeWidth="3" fill="none" />,
            <line key="body" x1="100" y1="70" x2="100" y2="120" stroke="black" strokeWidth="3" />,
            <line key="left-arm" x1="100" y1="85" x2="70" y2="100" stroke="black" strokeWidth="3" />,
            <line key="right-arm" x1="100" y1="85" x2="130" y2="100" stroke="black" strokeWidth="3" />,
            <line key="left-leg" x1="100" y1="120" x2="80" y2="150" stroke="black" strokeWidth="3" />,
            <line key="right-leg" x1="100" y1="120" x2="120" y2="150" stroke="black" strokeWidth="3" />
        ];

        const partesVisiveis = 6 - gameState.tentativasRestantes;

        return (
            <svg
                viewBox="0 0 200 200"
                className="w-full h-auto max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] mx-auto"
                preserveAspectRatio="xMidYMid meet"
            >
                <line x1="20" y1="180" x2="180" y2="180" stroke="brown" strokeWidth="4" />
                <line x1="50" y1="180" x2="50" y2="20" stroke="brown" strokeWidth="4" />
                <line x1="50" y1="20" x2="100" y2="20" stroke="brown" strokeWidth="4" />
                <line x1="100" y1="20" x2="100" y2="30" stroke="brown" strokeWidth="3" />

                {partes.slice(0, partesVisiveis)}
            </svg>
        );
    };

    // Tela de seleção de idioma
    if (!idioma) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-600 to-orange-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full mx-4">
                    <div className="text-center mb-8">
                        <Globe className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                            {textos.pt.escolhaIdioma} / Choose Language
                        </h1>
                        <p className="text-gray-600">Selecione o idioma para jogar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => selecionarIdioma('pt')}
                            className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl p-8 transform transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <div className="text-6xl mb-4">🇧🇷</div>
                            <h2 className="text-3xl font-bold mb-2">Português</h2>
                            <p className="text-sm opacity-90">Palavras simples em português</p>
                        </button>

                        <button
                            onClick={() => selecionarIdioma('en')}
                            className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl p-8 transform transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <div className="text-6xl mb-4">🇬🇧</div>
                            <h2 className="text-3xl font-bold mb-2">English</h2>
                            <p className="text-sm opacity-90">Simple words in English</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const t = textos[idioma];

    if (gameState.status === 'carregando') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center max-w-sm w-full mx-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-purple-600 animate-spin mx-auto mb-3 sm:mb-4" />
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{t.carregando}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-600 to-orange-500 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl w-full mx-auto">
                <div className="text-center mb-3 sm:mb-4 md:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 flex items-center justify-center gap-1 sm:gap-2">
                        <Sparkles className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        {t.titulo}
                        <Sparkles className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2">{t.subtitulo}</p>
                    <button
                        onClick={() => {
                            setIdioma(null);
                            hasInitialized.current = false;
                        }}
                        className="mt-2 text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 mx-auto"
                    >
                        <Globe className="w-3 h-3" />
                        {idioma === 'pt' ? 'Mudar idioma' : 'Change language'}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-0 mb-3 sm:mb-4 md:mb-6 bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4">
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600">{t.tentativas}</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{gameState.tentativasRestantes}</p>
                    </div>
                    <button
                        onClick={buscarNovaPalavra}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors disabled:opacity-50 text-xs sm:text-sm md:text-base font-medium"
                    >
                        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                        {t.novaPalavra}
                    </button>
                </div>

                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                    {renderizarBoneco()}
                </div>

                <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 flex-wrap px-2">
                    {renderizarPalavra()}
                </div>

                {gameState.status === 'ganhou' && (
                    <div className="text-center bg-gradient-to-br from-green-400 to-blue-500 text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6 animate-pulse">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{t.ganhou}</h2>
                        <p className="text-sm sm:text-base md:text-lg px-2">{t.msgGanhou} <span className="font-bold">{gameState.palavra.toUpperCase()}</span></p>
                    </div>
                )}

                {gameState.status === 'perdeu' && (
                    <div className="text-center bg-gradient-to-br from-red-400 to-pink-500 text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{t.perdeu}</h2>
                        <p className="text-sm sm:text-base md:text-lg px-2">{t.msgPerdeu} <span className="font-bold">{gameState.palavra.toUpperCase()}</span></p>
                    </div>
                )}

                {gameState.status === 'jogando' && (
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 md:gap-2 mb-3 sm:mb-4 md:mb-6 px-1">
                        {alfabeto.map(letra => {
                            const jaUsada = gameState.letrasAdvinhadas.has(letra);
                            const correta = jaUsada && gameState.palavra.includes(letra);
                            const incorreta = jaUsada && !gameState.palavra.includes(letra);

                            return (
                                <button
                                    key={letra}
                                    onClick={() => tentarLetra(letra)}
                                    disabled={jaUsada}
                                    className={`
                    w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm md:text-base lg:text-lg transition-all transform
                    ${jaUsada ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 active:scale-95'}
                    ${correta ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg' : ''}
                    ${incorreta ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg' : ''}
                    ${!jaUsada ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 shadow-md' : ''}
                  `}
                                >
                                    {letra.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};