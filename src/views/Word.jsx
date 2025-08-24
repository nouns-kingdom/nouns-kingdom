import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FluentProvider, Button } from "@fluentui/react-components";
import { NKHttpSvc } from "../services/httpService";

function Word() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState({});
  const [cardList, setCardList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    setIsLoading(true);
    NKHttpSvc.WordsOfCategory(category)
      .then((res) => res.json())
      .then((data) => {
        setCardList(Object.keys(data));
        setCurrentIndex(Object.keys(data).indexOf(id));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
    console.log("category, id", category, id);
    NKHttpSvc.WordsOfCard(category, id).then((wordData) => {
      console.log("word data", wordData);
      setWords(wordData || {});
    });
  }, [category, id]);

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(`/${category}/${cardList[currentIndex - 1]}`);
    }
  };
  const goNext = () => {
    if (currentIndex < cardList.length - 1) {
      navigate(`/${category}/${cardList[currentIndex + 1]}`);
    }
  };
  // const goBack = () => navigate(-1);
  // console.log(`/assets/${category}_${id}_with_words.png`);
  return (
    <FluentProvider>
      <div style={{ margin: "1em 0 2em 15%", display: "flex", alignItems: "center" }}>
        <span style={{ cursor: "pointer", color: "#0078d4", fontWeight: "bold" }} onClick={() => navigate("/")}>
          Home
        </span>
        <span style={{ margin: "0 8px" }}>{">"}</span>
        <span style={{ cursor: "pointer", color: "#0078d4", fontWeight: "bold" }} onClick={() => navigate(`/${category}`)}>
          {category}
        </span>
        <span style={{ margin: "0 8px" }}>{">"}</span>
        <span style={{ fontWeight: "bold" }}>{id}</span>
      </div>
      <h1 style={{ textAlign: "center", marginTop: "1em" }}>{id}</h1>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button onClick={goPrev} disabled={currentIndex <= 0} style={{ marginRight: "1em" }}>
          ←
        </Button>
        {isLoading ? <div>Loading...</div> : <img src={`${process.env.PUBLIC_URL}/assets/${category}_${id}_with_words.png`} alt={id} />}
        <Button onClick={goNext} disabled={currentIndex >= cardList.length - 1} style={{ marginLeft: "1em" }}>
          →
        </Button>
      </div>
      <div className='words-container'>
        {Object.entries(words).map(([key, value]) => (
          <div key={key} className='word-container'>
            {value} : {key}
          </div>
        ))}
      </div>
      {!isLoading && Object.keys(words).length === 0 && <div>working on design parts of {id}</div>}
    </FluentProvider>
  );
}

export default Word;
