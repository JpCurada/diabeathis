import React from "react";

type HeaderProps = {
  name: string;
};

const Header: React.FC<HeaderProps> = ({ name }) => {
  return <h1 className="text-2xl font-bold text-[#000000] mb-6">{name}</h1>;
};

export default Header;
