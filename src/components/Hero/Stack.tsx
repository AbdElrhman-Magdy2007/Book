import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import "./Stack.css";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

const CardRotate: React.FC<CardRotateProps> = ({
  children,
  onSendToBack,
  sensitivity,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number; y: number } }
  ) => {
    const { x: offsetX, y: offsetY } = info.offset;
    const exceeded =
      Math.abs(offsetX) > sensitivity || Math.abs(offsetY) > sensitivity;
    if (exceeded) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      className="card-rotate"
      drag
      style={{ x, y, rotateX, rotateY }}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
};

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  sendToBackOnClick?: boolean;
  cardsData?: { id: number; img: string }[];
  animationConfig?: { stiffness: number; damping: number };
}

const defaultCards = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format",
  },
];

export default function Stack({
  cardsData = defaultCards,
  randomRotation = false,
  sensitivity = 200,
  sendToBackOnClick = false,
  cardDimensions = { width: 208, height: 208 },
  animationConfig = { stiffness: 260, damping: 20 },
}: StackProps) {
  const [cards, setCards] = useState(cardsData);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((c) => c.id === id);
      if (index > -1) {
        const [card] = updated.splice(index, 1);
        updated.unshift(card);
      }
      return updated;
    });
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <div
      className="stack-container"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}
    >
      {cards.map((card, index) => {
        const rotationZ =
          (cards.length - index - 1) * 4 +
          (randomRotation ? Math.random() * 10 - 5 : 0);
        const scale = 1 + index * 0.06 - cards.length * 0.06;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
          >
            <motion.div
              className="card"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: rotationZ,
                scale,
                transformOrigin: "90% 90%",
              }}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              style={cardDimensions}
            >
              <Image
                src={card.img}
                alt={`card-${card.id}`}
                className="card-image"
                width={cardDimensions.width}
                height={cardDimensions.height}
                unoptimized
              />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
