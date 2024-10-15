javascript: (function () {
  function writeToInputBox(text) {
    const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
    if (inputBox) {
      const targetDiv = inputBox.parentElement;
      if (targetDiv) {
        console.log("点击目标 div");
        targetDiv.click();
        console.log("已点击目标 div");
      }

      setTimeout(() => {
        inputBox.focus();
        inputBox.textContent = '';
        console.log("开始输入 " + text);

        function simulateTyping(text, index = 0) {
          if (index < text.length) {
            if (text[index] === '\n') {
              const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
                shiftKey: true,
                bubbles: true
              });
              inputBox.dispatchEvent(event);
            } else {
              document.execCommand('insertText', false, text[index]);
            }
            setTimeout(() => simulateTyping(text, index + 1), 10);
          } else {
            console.log("输入完成");
            sendMessage();
          }
        }

        simulateTyping(text);
      }, 100);
    } else {
      console.log("未找到输入框");
    }
  }
  function sendMessage() {
    const inputBox = document.querySelector('div[contenteditable="true"][role="textbox"]');
    if (inputBox && inputBox.textContent.trim() !== '') {
      const sendButton = document.querySelector('div[aria-label="Press Enter to send"]');
      if (sendButton) {
        sendButton.click();
        console.log("消息已发送");
      } else {
        console.log("未找到发送按钮");
      }
    } else {
      console.log("消息内容为空,未发送");
    }
  }
  const messages = document.getElementsByClassName("x78zum5 xdt5ytf x1iyjqo2 x2lah0s xl56j7k x121v3j4")[0];
  messages.removeEventListener("DOMNodeInserted", null);
  messages.addEventListener("DOMNodeInserted", async (event) => {    
    const imgElement = event?.target?.getElementsByTagName("img")[1];
    const imgSrc = imgElement?.src;
    const imgAlt = imgElement?.alt;

    if (imgSrc && imgAlt === "Open photo") {
      console.log("发现用户上传的图片，正在发送到服务器");
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
    }
    else {
      console.log("img alt is:", imgAlt);
    }
  });
  alert("已添加 Messenger 聊天观察器");
})();
