function textdata() {
  fetch("text.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const textElement = document.querySelector("#textdata");
      let output = data.text;
      textElement.innerHTML = output;
      console.log(output);
    })
    .catch((error) => console.error("error fetching data", error));
}

textdata();
