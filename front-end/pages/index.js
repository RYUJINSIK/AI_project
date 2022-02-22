import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import HeaderNav from "../components/HeaderNav";

const Main = () => {
  const router = useRouter();
  const goMainPage = () => {
    router.push("/main");
  };

  return (
    <>
      <HeaderNav />
      안녕하세요
    </>
  );
};

export default Main;
