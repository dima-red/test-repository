(() => {
  init();

  function init() {
    const body = document.querySelector(".calc-wrapper");
    const keyBtnArr = Array.from(body.querySelectorAll(".key-btn"));
    keyBtnArr.forEach(item => {
      item.addEventListener("click", getInputValues);
    });

    document.addEventListener("click", getInputValues);
  }

  function getInputValues(ev) {
    console.log(ev);
  }
})();
