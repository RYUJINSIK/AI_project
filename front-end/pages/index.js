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
      <video id="vid" width="320" height="240" autoplay="autoplay" loop="loop" muted="muted" controls poster="https://www.w3schools.com/images/w3schools_green.jpg">
           <source src="http://localhost:8000/media/test/1.avi" type="video/avi"/ >
      </video> 
      <script> document.getElementById('vid').play(); </script>
    </>
  );
};

export default Main;
