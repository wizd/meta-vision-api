javascript: (function () {
  function writeToInputBox(text) {
    const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
    if (inputBox) {
      inputBox.focus();
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      inputBox.dispatchEvent(clickEvent);
      inputBox.innerHTML = '';
      let i = 0;
      function typeNextChar() {
        if (i < text.length) {
          inputBox.innerHTML += text.charAt(i);
          i++;
          const inputEvent = new Event('input', { bubbles: true, cancelable: true });
          inputBox.dispatchEvent(inputEvent);
          setTimeout(typeNextChar, 10);
        } else {
          const keyEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            keyCode: 13
          });
          inputBox.dispatchEvent(keyEvent);
        }
      }
      setTimeout(typeNextChar, 100);
    } else {
      console.log("未找到输入框");
    }
  }
  function sendMessage() {
    setTimeout(() => {
      const sendButton = document.querySelector('div[aria-label="Press Enter to send"]');
      if (sendButton) {
        sendButton.click();
      } else {
        console.log("未找到发送按钮");
      }
    }, 100);
  }
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
      await new Promise(resolve => {
        writeToInputBox(data);
        setTimeout(resolve, 1000);
      });
      sendMessage();
    }
    else {
      console.log("未找到图片1");
    }
  });
  alert("已添加 Messenger 聊天观察器");
})();