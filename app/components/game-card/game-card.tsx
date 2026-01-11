import React from 'react';
import { Sparkles, type LucideIcon } from 'lucide-react';

type ItemProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    href?: string;
    onClick?: () => void;
};

export const GameCard: React.FC<ItemProps> = ({
    title,
    description,
    icon: Icon,
    color,
    href,
    onClick,
}) => {
    const Component = href ? 'a' : 'div';

    return (
        <Component
            href={href}
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 ${color}`}
        >
            <div
                className={`w-20 h-20 rounded-full bg-linear-to-br ${color} flex items-center justify-center mb-6 mx-auto`}
            >
                <Icon className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {title}
            </h2>

            <p className="text-gray-600 text-center mb-6">
                {description}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-purple-600">
                <Sparkles className="w-4 h-4" />
                <span>Clique para Jogar</span>
                <Sparkles className="w-4 h-4" />
            </div>
        </Component>
    );
};