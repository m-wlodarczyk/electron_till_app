function run_camera() {
  document.getElementById("camera-btn").style.display = "none";
  document.getElementById("vid1-btn").style.display = "none";
  document.getElementById("vid2-btn").style.display = "none";

  document.getElementById("stop").style.display = "block";
  document.getElementById("video").style.display = "block";

  let path = require("path");
  let { PythonShell } = require("python-shell");
  let options = {
    pythonPath: path.join(__dirname, "\\venv\\Scripts\\python.exe"),
    scriptPath: path.join(__dirname, "\\python-scripts\\")
  };

  PythonShell.run("cam.py", options, function() {});
}

function run_vid() {
  document.getElementById("camera-btn").style.display = "none";
  document.getElementById("vid1-btn").style.display = "none";
  document.getElementById("vid2-btn").style.display = "none";

  document.getElementById("stop").style.display = "block";
  document.getElementById("video").style.display = "block";

  let path = require("path");
  let { PythonShell } = require("python-shell");
  let options = {
    pythonPath: path.join(__dirname, "\\venv\\Scripts\\python.exe"),
    scriptPath: path.join(__dirname, "\\python-scripts\\")
  };

  PythonShell.run("video.py", options, function() {});
}
