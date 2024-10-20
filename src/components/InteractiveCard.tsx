import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CardMessage } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveCard({
  message,
  isOpen,
}: {
  message: CardMessage;
  isOpen: boolean;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (isOpen) {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(20);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, timeLeft, selectedAnswer]);

  const handleAnswerClick = (answer: string, correct: boolean) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answer);
      setIsCorrect(correct);
    }
  };

  return (
    <Drawer open={isOpen}>
      <DrawerContent className="bg-[#1a1a1a] flex flex-col items-center justify-start h-screen p-6">
        <div className="w-full max-w-4xl h-[45vh] aspect-video bg-[#46178f] mb-4 flex items-center justify-center relative p-8">
          <h2 className="text-4xl text-white font-bold text-center">
            {message?.question}
          </h2>
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#333] flex items-center justify-center">
            <span className="text-2xl text-white font-bold">{timeLeft}</span>
          </div>
          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center ${
                  isCorrect ? "bg-green-500/80" : "bg-red-500/80"
                }`}
              >
                <div className="text-6xl font-bold text-white">
                  {isCorrect ? "Correct!" : "Incorrect!"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-full max-w-4xl grid grid-cols-2 gap-4">
          {message?.answers?.map((answer, index) => {
            const isSelected = selectedAnswer === answer.answer;
            const showCorrect = selectedAnswer !== null && answer.is_correct;

            return (
              <Button
                key={answer.answer}
                onClick={() =>
                  handleAnswerClick(answer.answer, answer.is_correct)
                }
                className={`h-auto min-h-[6rem] text-xl font-bold text-[#333] bg-white hover:bg-opacity-90 rounded-md relative overflow-hidden flex items-center p-4 ${
                  isSelected
                    ? showCorrect
                      ? "ring-4 ring-green-500"
                      : "ring-4 ring-red-500"
                    : ""
                }`}
                disabled={selectedAnswer !== null}
              >
                <span className="text-left text-wrap">{answer.answer}</span>
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
