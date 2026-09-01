const songSelect = document.getElementById('songSelect');
const container = document.getElementById('cifraOutput');

// Carrega a lista de músicas ao iniciar
async function loadSongList() {
  try {
    const res = await fetch('songs.json');
    const songs = await res.json();

    songSelect.innerHTML = '<option value="">Selecione...</option>';
    songs.forEach(song => {
      const opt = document.createElement('option');
      opt.value = song.path;
      opt.textContent = song.title;
      songSelect.appendChild(opt);
    });
  } catch (err) {
    container.innerHTML = '<p style="color:red">Erro ao carregar o índice de músicas.</p>';
  }
}

songSelect.addEventListener('change', async (e) => {
  const filePath = e.target.value;
  if (!filePath) return;

  try {
    const res = await fetch(filePath);
    const text = await res.text();

    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(text);
    const formatter = new ChordSheetJS.HtmlTableFormatter();

    container.innerHTML = formatter.format(song);
  } catch (err) {
    container.innerHTML = `<p style="color:red">Erro ao abrir cifra: ${err.message}</p>`;
  }
});

loadSongList();