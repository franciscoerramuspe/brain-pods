"use client";

import Image from "next/image";
import one from "../public/images/1.jpg";
import two from "../public/images/2.jpg";
import three from "../public/images/3.jpg";
import four from "../public/images/4.jpg";
import five from "../public/images/5.jpg";
import six from "../public/images/6.jpg";

const randomTitles = [
  "MadHacks",
  "Podcast",
  "Geometry Wars",
  "AI",
  "Web Development",
  "Music",
];

const imageCount = 6;
const cardCounts = 10;

const getRandomImage = () => {
  const selectedImage = Math.floor(Math.random() * imageCount);

  return [one, two, three, four, five, six][selectedImage];
};

const getRandomTitle = () => {
  return randomTitles[Math.floor(Math.random() * randomTitles.length)];
};

export default function ScrollList({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-left justify-center">
      <h1 className="text-white text-3xl font-bold font-adversecase ml-5">
        {title}
      </h1>
      {/* separator */}
      <div className="w-full h-[1px] bg-[#3B3A36] ml-4 p-px"></div>
      <div className="flex flex-row overflow-x-auto w-screen my-4 px-4 gap-8">
        {Array.from({ length: cardCounts }, (_, index) => (
          <div className="relative w-screen h-full min-w-[420px] min-h-[250px] overflow-hidden rounded-lg hover:scale-95 transition-all duration-300 cursor-pointer opacity-80 hover:opacity-100 active:scale-90">
            <Image
              src={getRandomImage()}
              alt={""}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h1 className="text-3xl font-bold font-adversecase mix-blend-difference">
                {getRandomTitle()}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
