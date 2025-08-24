class HttpServiceClient {
  Categories() {
    return fetch(process.env.PUBLIC_URL + "/db_category.JSON");
    // return ["animals", "foods", "tools"];
  }

  WordsOfCard(category, card) {
    const dictionay = process.env.PUBLIC_URL + "/db_" + category + ".JSON";
    console.log("dictionay", dictionay, card);
    return (
      fetch(dictionay)
        // .then((res) => res.json())
        // .then((data) => data[card]);
        .then((res) => console.log(res))
    );
    // .then((data) => {
    //   console.log("Available keys:", Object.keys(data));
    //   console.log("Requested card:", card);
    //   return data[card];
    // })
    // return fetch(dictionay);
  }

  WordsOfCategory(category) {
    const curCategory = process.env.PUBLIC_URL + "/db_" + category + ".JSON";
    return fetch(curCategory);
  }
}

export const NKHttpSvc = new HttpServiceClient();
