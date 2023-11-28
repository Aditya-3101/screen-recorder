let start = document.getElementById("start"),
  stop = document.getElementById("stop"),
  mediaRecorder;

start.addEventListener("click", async function () {
  let stream = await recordScreen();
  let mimeType = "video/webm";
  mediaRecorder = createRecorder(stream, mimeType);
  let node = document.createElement("p");
  node.className = "start-rec";
  node.textContent = "-Start Recording......";
  document.body.appendChild(node);
});

stop.addEventListener("click", async function () {
  mediaRecorder.stop();
  let node = document.createElement("p");
  node.className = "stop-rec";
  node.textContent = "-Stoped Recording";
  document.body.appendChild(node);
});

async function recordScreen() {
  return await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: {
      mediaSource: "screen",
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 },
    },
  });
}

function createRecorder(stream, mimeType) {
  let recordedChunks = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = function () {
    saveFile(recordedChunks);
    recordedChunks = [];
  };

  mediaRecorder.start(200);
  return mediaRecorder;
}

function saveFile(recordedChunks) {
  const blob = new Blob(recordedChunks, {
    type: "video/mp4",
  });

  let fileName = window.prompt("Enter File Name");
  let downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${fileName}.mp4`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(blob);
  document.body.removeChild(downloadLink);
}
