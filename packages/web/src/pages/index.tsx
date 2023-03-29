import { trpc } from "@/utils/trpc";
import Image from "next/image";
import React from "react";

interface Props {}
const Home: React.FC<Props> = ({}) => {
  return (
    <div className="home">
      <button>Generate Link</button>
    </div>
  );
};

export default Home;
