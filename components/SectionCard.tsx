import React from "react";

interface CardProps {
    title: string;
    image: string;
}

const Card: React.FC<CardProps> = ({ title, image }) => {
    return (
        <div className="relative w-5/6 max-w-md h-30 rounded-xl overflow-hidden shadow-lg mx-auto">

            {/* Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
            />

            {/* Linear Gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))"
                }}
            />

            {/* Texte en bas */}
            <div className="absolute bottom-0 right-0 p-4">
                <h2
                    className="text-white text-xl md:text-2xl font-semibold"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                >
                    {title}
                </h2>
            </div>

        </div>
    );
};

export default Card;
