function addnumber() {
  const num1 =parseInt(document.getElementById("num1").value);
  const num2 = parseInt(document.getElementById("num2").value);
  const  sum = num1 + num2;

//   const resultDiv=document.createElement("div");
//   resultDiv.textContent=`${sum}`;
  document.getElementById("number-container").append(sum);

}
document.getElementById("add").addEventListener("click",addnumber);
