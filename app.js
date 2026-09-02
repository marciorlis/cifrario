const songSelect = document.getElementById('songSelect');
const cifraOutput = document.getElementById('cifraOutput');

function formatSongLabel(fileName) {
  return decodeURIComponent(fileName)
    .replace(/\.txt$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

async function loadSongList() {
  songSelect.innerHTML = '<option value="">Carregando...</option>';

  try {
    const response = await fetch('./cifras/');
    if (!response.ok) {
      throw new Error(`Não foi possível listar as músicas (${response.status})`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fileLinks = [...doc.querySelectorAll('a[href]')]
      .map(link => link.getAttribute('href'))
      .filter(href => href && href.toLowerCase().endsWith('.txt'));

    const songs = [...new Set(fileLinks.map(link => link.replace(/^\.\//, '')))].sort();

    if (!songs.length) {
      songSelect.innerHTML = '<option value="">Nenhuma música encontrada</option>';
      return;
    }

    songSelect.innerHTML = '<option value="">Selecione...</option>' +
      songs.map(file => `<option value="${encodeURI(file)}">${formatSongLabel(file)}</option>`).join('');
  } catch (error) {
    songSelect.innerHTML = '<option value="">Selecione...</option>' +
      '<option value="cifras/musica-1.txt">Música 1</option>';
    console.warn('Não foi possível listar o diretório via fetch; usando fallback.', error);
  }
}

songSelect.addEventListener('change', async (e) => {
  const filePath = e.target.value;

  if (!filePath) {
    cifraOutput.innerHTML = '<p>Selecione uma música no menu acima.</p>';
    return;
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Falha ao carregar a música (${response.status})`);
    }

    const chordProText = await response.text();
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordProText);
    const formatter = new ChordSheetJS.HtmlTableFormatter();

    cifraOutput.innerHTML = formatter.format(song);
  } catch (error) {
    cifraOutput.innerHTML = `<p style="color: red;">Erro ao carregar a cifra: ${error.message}</p>`;
  }
});

loadSongList();