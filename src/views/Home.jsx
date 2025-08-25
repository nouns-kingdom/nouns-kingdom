import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NKHttpSvc } from "../services/httpService";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    NKHttpSvc.Categories()
      .then((res) => res.json())
      // .then((res) => console.log(res.json()))
      .then((data) => {
        setCategories(data.category);
        setIsLoading(false);
        console.log("home data", data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const getImgUrl = (name) => `${process.env.PUBLIC_URL}/assets/category/${name}.png`;
  const onCardChange = (category) => navigate(`/${category}`);

  return (
    <div className='category-container' style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginLeft: "15%", marginRight: "15%" }}>
      {isLoading ? (
        <div>Loading...</div>
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <div key={category} style={{ margin: "1em" }}>
            {/* <div>{getImgUrl(category)}</div> */}
            <img src={getImgUrl(category)} alt={category} className='image-container' style={{ height: "300px", width: "280px", cursor: "pointer" }} onClick={() => onCardChange(category)} />
            <div className='card-font-container' style={{ fontWeight: 600, fontSize: "2vw", cursor: "pointer" }} onClick={() => onCardChange(category)}>
              {category}
            </div>
          </div>
        ))
      ) : (
        <div>Will add more categories here soon</div>
      )}
    </div>
  );
};

export default Home;
