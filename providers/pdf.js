const { spawn } = require('child_process');

process.env.PYTHONIOENCODING = 'utf-8';

class Pdf {
  constructor() {}

  getPdfText(file_path) {
    const python = spawn("python", ["././python/parsePdf.py", file_path]);

    const data = new Promise((resolve, reject) => {
      python.stdout.on("data", (data) => {
        resolve(data.toString());
      });
    });

    python.stderr.on("data", (data) => {
      console.error(`Error received from Python script: ${data}`);
    });

    python.on("close", (code) => {});

    return data;
  }
}

module.exports = { Pdf }