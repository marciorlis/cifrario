document.getElementById('songSelect').addEventListener('change', async (e) => {
  const filePath = e.target.value;
  const container = document.getElementById('cifraOutput');

  if (!filePath) {
    container.innerHTML = '<p>Selecione uma música no menu acima.</p>';
    return;
  }

  try {
    // 1. Busca o arquivo ChordPro na pasta local
    const response = await fetch(filePath);
    const chordProText = await response.text();

    // 2. Transforma o texto ChordPro em estrutura HTML
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordProText);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    
    // 3. Renderiza na página
    container.innerHTML = formatter.format(song);
  } catch (error) {
    container.innerHTML = `<p style="color: red;">Erro ao carregar a cifra: ${error.message}</p>`;
  }
});