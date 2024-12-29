// Listas de responsáveis e locais
const responsaveis = ["Leandro", "Guilherme", "Hiago", "Dácio"];
const locais = ["Morrinhos", "PCD Groairas", "PCD Maracajá"];

function capturarDados() {
  // Obtendo os valores dos campos
  const data = document.getElementById("data").value;
  const nome = document.getElementById("nome").value;
  const local = document.getElementById("local").value;
  const turno = document.getElementById("turno").value;
  const vazao = document.getElementById("vazao").value;
  const comentario = document.getElementById("comentario").value;

  // Formatando a data para dd/mm/aa
  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });

  // Criando um objeto com os dados
  const dados = { data: dataFormatada, nome, local, turno, vazao, comentario };

  // Salvando os dados no localStorage
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.push(dados);
  localStorage.setItem("historico", JSON.stringify(historico));

  // Exibindo os dados no console para depuração
  console.log(dados);

  // Exibindo uma mensagem de sucesso
  alert("Dados enviados com sucesso!");

  // Limpar os campos após envio
  document.getElementById("formVazao").reset();
}

// Função para preencher os campos de seleção
function preencherListas() {
  const nomeSelect = document.getElementById("nome");
  const localSelect = document.getElementById("local");

  responsaveis.forEach(responsavel => {
    const option = document.createElement("option");
    option.value = responsavel;
    option.text = responsavel;
    nomeSelect.add(option);
  });

  locais.forEach(local => {
    const option = document.createElement("option");
    option.value = local;
    option.text = local;
    localSelect.add(option);
  });
}

// Função para exibir o histórico dos dados inseridos
function exibirHistorico() {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  // Ordenar por local e data
  historico.sort((a, b) => {
    if (a.local < b.local) return -1;
    if (a.local > b.local) return 1;
    if (a.data < b.data) return -1;
    if (a.data > b.data) return 1;
    return 0;
  });

  const historicoDiv = document.getElementById("historico");
  historicoDiv.innerHTML = "<h2>Histórico de Medições</h2>";

  // Criação da tabela
  const table = document.createElement("table");
  table.style.width = "100%";
  table.setAttribute("border", "1");

  // Criação do cabeçalho da tabela
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Data", "Nome", "Local", "Turno", "Vazão (m³/s)", "Comentário"];

  headers.forEach(headerText => {
    const header = document.createElement("th");
    header.appendChild(document.createTextNode(headerText));
    headerRow.appendChild(header);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Criação do corpo da tabela
  const tbody = document.createElement("tbody");

  historico.forEach(dados => {
    const row = document.createElement("tr");

    Object.values(dados).forEach(text => {
      const cell = document.createElement("td");
      cell.appendChild(document.createTextNode(text));
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  historicoDiv.appendChild(table);
}

// Função para baixar o histórico como CSV
function baixarHistoricoCSV() {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  // Ordenar por local e data
  historico.sort((a, b) => {
    if (a.local < b.local) return -1;
    if (a.local > b.local) return 1;
    if (a.data < b.data) return -1;
    if (a.data > b.data) return 1;
    return 0;
  });

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Data,Nome,Local,Turno,Vazão,Comentário\n";

  historico.forEach(dados => {
    const row = `${dados.data},${dados.nome},${dados.local},${dados.turno},${dados.vazao},${dados.comentario}\n`;
    csvContent += row;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "historico_vazoes.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}

// Função para baixar o histórico como PDF
function baixarHistoricoPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  // Ordenar por local e data
  historico.sort((a, b) => {
    if (a.local < b.local) return -1;
    if (a.local > b.local) return 1;
    if (a.data < b.data) return -1;
    if (a.data > b.data) return 1;
    return 0;
  });

  let yPosition = 10; // Posição Y inicial no PDF
  doc.setFontSize(12);
  doc.text("Histórico de Medições", 10, yPosition);
  yPosition += 10;

  historico.forEach(dados => {
    doc.text(`Data: ${dados.data}, Nome: ${dados.nome}, Local: ${dados.local}, Turno: ${dados.turno}, Vazão: ${dados.vazao}, Comentário: ${dados.comentario}`, 10, yPosition);
    yPosition += 10;
  });

  doc.save("historico_vazoes.pdf");
}

window.onload = preencherListas; // Preencher listas ao carregar a página
