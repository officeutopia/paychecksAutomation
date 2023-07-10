const { Pdf } = require("../providers/pdf");

class PdfService {
  constructor() {
    this.pdfProvider = new Pdf();
  }

  parsePdf(file_path) {
    return this.pdfProvider.getPdfText(file_path);
  }
}

 module.exports = { PdfService}