(async function (params) {
  const val = await fetch("http://localhost:4000/prompt/createPrompts");
  console.log(await val.json())
})();