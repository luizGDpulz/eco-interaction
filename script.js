async function fetchWasteData() {
    const res = await fetch('dados.json');
    return res.json();
  }
  
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const itemSelect = document.getElementById('item-select');
  const infoDiv = document.getElementById('info');
  let wasteData = [];
  
  // Inicialização
  window.addEventListener('load', async () => {
    wasteData = await fetchWasteData();
    const categorias = [...new Set(wasteData.map(item => item.categoria))];
    categorias.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  });
  
  // Filtrar itens por categoria
  categorySelect.addEventListener('change', () => {
    const cat = categorySelect.value;
    const itens = wasteData.filter(item => item.categoria === cat);
    itemSelect.innerHTML = '<option value="" disabled selected>Selecione o item</option>';
    itens.forEach((item, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = item.tipo;
      itemSelect.appendChild(opt);
    });
    itemSelect.disabled = false;
    infoDiv.style.display = 'none';
  });
  
  // Exibir informação ao selecionar item
  itemSelect.addEventListener('change', () => {
    const cat = categorySelect.value;
    const idx = itemSelect.value;
    const item = wasteData.filter(i => i.categoria === cat)[idx];
    infoDiv.style.display = 'block';
    infoDiv.innerHTML = `
      <p><span class="label">Categoria:</span> ${item.categoria}</p>
      <p><span class="label">Tipo:</span> ${item.tipo}</p>
      <p><span class="label">Onde descartar:</span> ${item.local}</p>
      <p><span class="label">Descrição:</span> ${item.descricao}</p>
      <p><span class="label">Tempo de decomposição:</span> ${item.decomposicao}</p>
      <p><span class="label">Reciclável:</span> ${item.reciclavel ? 'Sim' : 'Não'}</p>
    `;
  });
  
  // Pesquisa em tempo real
  searchInput.addEventListener('input', () => {
    const termo = searchInput.value.toLowerCase();
    if (!termo) {
      infoDiv.style.display = 'none';
      return;
    }
    const resultados = wasteData.filter(item =>
      item.tipo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo)
    );
    if (resultados.length) {
      infoDiv.style.display = 'block';
      infoDiv.innerHTML = resultados.map(item => 
        `<div class="info-card">
           <p><span class="label">Categoria:</span> ${item.categoria}</p>
           <p><span class="label">Tipo:</span> ${item.tipo}</p>
           <p><span class="label">Onde descartar:</span> ${item.local}</p>
           <p><span class="label">Descrição:</span> ${item.descricao}</p>
           <p><span class="label">Tempo de decomposição:</span> ${item.decomposicao}</p>
           <p><span class="label">Reciclável:</span> ${item.reciclavel ? 'Sim' : 'Não'}</p>
         </div>`
      ).join('');
    } else {
      infoDiv.style.display = 'block';
      infoDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    }
  });