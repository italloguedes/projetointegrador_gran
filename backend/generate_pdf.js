const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '../entrega_final.pdf');
const doc = new PDFDocument();

doc.pipe(fs.createWriteStream(outputPath));

doc.fontSize(16).text('Entrega Final - API REST', { align: 'center' });
doc.moveDown();

doc.fontSize(12).text('CHAMADA 1 – Cadastrar Produto', { underline: true });
doc.text('Método: POST');
doc.text('URL: http://localhost:8080/products');
doc.text('Body:');
doc.font('Courier').text(`{
  "nome": "Notebook Gamer",
  "descricao": "Processador i7, 16GB RAM",
  "preco": 4500.00,
  "codigoBarras": "7891234567890"
}`);
doc.font('Helvetica').moveDown();

doc.fontSize(12).text('CHAMADA 2 – Cadastrar Fornecedor', { underline: true });
doc.text('Método: POST');
doc.text('URL: http://localhost:8080/suppliers');
doc.text('Body:');
doc.font('Courier').text(`{
  "nome": "Tech Distribuidora",
  "cnpj": "12.345.678/0001-90",
  "endereco": "Rua da Tecnologia, 100",
  "contato": "contato@techdistribuidora.com"
}`);
doc.font('Helvetica').moveDown();

doc.fontSize(12).text('CHAMADA 3 – Associar Produto ao Fornecedor', { underline: true });
doc.text('Método: POST');
doc.text('URL: http://localhost:8080/associations');
doc.text('Body:');
doc.font('Courier').text(`{
  "productId": 1,
  "supplierId": 1
}`);

doc.end();

console.log('PDF generated successfully at: ' + outputPath);
