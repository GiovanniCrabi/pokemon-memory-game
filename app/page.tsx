import { Gamepad2, Type, Trophy } from 'lucide-react';
import Link from 'next/link';
import { GameCard } from './components/game-card/game-card';
export default function Home() {
  const games = [
    {
      title: 'Pokémon Game',
      description: 'Adivinhe o Pokémon pela imagem! Teste seus conhecimentos sobre os monstrinhos mais famosos do mundo.',
      icon: Gamepad2,
      color: 'from-blue-400 to-purple-600 border-blue-400',
      route: '/pokemon'
    },
    {
      title: 'Jogo da Forca',
      description: 'Descubra a palavra secreta antes que o boneco seja enforcado! Um clássico jogo de palavras.',
      icon: Type,
      color: 'from-purple-500 to-pink-600 border-purple-500',
      route: '/forca'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-600 to-orange-500 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Centro de Jogos</h1>
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-xl text-white/90">Rafa e Gi</p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <Link key={index} href={game.route}>
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
                color={game.color}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}