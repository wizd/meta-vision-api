javascript: (function () {
  const messages = document.getElementsByClassName("x78zum5 xdt5ytf x1iyjqo2 x2lah0s xl56j7k x121v3j4")[0];
  messages.removeEventListener("DOMNodeInserted", null);
  messages.addEventListener("DOMNodeInserted", async (event) => {
    console.log("domnodeinserted event target is:", event?.target);
    const imgSrc = event?.target?.getElementsByTagName("img")[1]?.src;
    if (imgSrc) {
      const res = await fetch("http://localhost:3103/api/gpt-4-vision", {
        method: "POST",
        body: JSON.stringify({ imageUrl: imgSrc }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    }
    else {
      console.log("未找到图片1");
    }
  });
  alert("已添加 Messenger 聊天观察器");
})();