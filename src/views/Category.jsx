import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NKHttpSvc } from "../services/httpService";
// import { Breadcrumb, BreadcrumbItem } from "@fluentui/react-components";

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [wordsInCategory, setWordsInCategory] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    NKHttpSvc.WordsOfCategory(category)
      .then((res) => res.json())
      .then((data) => {
        setWordsInCategory(Object.keys(data));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [category]);

  // Match Vue logic: images are in /assets/ and named as <category>_<word>.png
  const getImgUrl = (name) => `${process.env.PUBLIC_URL}/assets/${category}_${name}.png`;
  const onCardChange = (word) => navigate(`/${category}/${word}`);

  return (
    <>
      <div style={{ margin: "1em 0 2em 15%", display: "flex", justifyContent: "flex-start" }}>
        <div style={{ margin: "1em 0 2em 0", display: "flex", alignItems: "center" }}>
          <span style={{ cursor: "pointer", color: "#0078d4", fontWeight: "bold" }} onClick={() => navigate("/")}>
            Home
          </span>
          <span style={{ margin: "0 8px" }}>{">"}</span>
          <span style={{ fontWeight: "bold" }}>{category}</span>
        </div>
      </div>
      <div className='category-container' style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginLeft: "15%", marginRight: "15%" }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : wordsInCategory.length > 0 ? (
          wordsInCategory.map((word) => (
            <div key={word} style={{ margin: "1em", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5em" }}>
              <img src={getImgUrl(word)} alt={word} className='image-container' style={{ height: "300px", width: "280px", cursor: "pointer" }} onClick={() => onCardChange(word)} />
              <div className='card-font-container' style={{ fontWeight: 600, fontSize: "2vw", cursor: "pointer", textAlign: "center" }} onClick={() => onCardChange(word)}>
                {word}
              </div>
            </div>
          ))
        ) : (
          <div>Will add more cards here soon</div>
        )}
      </div>
    </>
  );
};

export default Category;
