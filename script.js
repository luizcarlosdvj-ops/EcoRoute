// 1. Inicialização do Mapa Leaflet
const map = L.map('map').setView([-23.026, -45.555], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Pontos de Coleta para os Marcadores do Mapa
const pontos = [
    { nome: "PEV Imaculada", coords: [-23.047449, -45.545293] },
    { nome: "PEV Centro", coords: [-23.028803, -45.554524] },
    { nome: "PEV Cecap", coords: [-23.038419, -45.618807] },
    { nome: "PEV Piratininga", coords: [-23.010131, -45.593815] }
];

// Adiciona os marcadores ao mapa
pontos.forEach(ponto => {
    L.marker(ponto.coords)
        .addTo(map)
        .bindPopup(`<b>${ponto.nome}</b><br>Ponto de Entrega Voluntária`);
});

// 3. Função para Abrir/Fechar os Cards (Acordeão)
function toggleCard(element) {
    // Fecha outros cards se quiser (opcional)
    // document.querySelectorAll('.location-card').forEach(c => { if(c !== element) c.classList.remove('active'); });
    
    element.classList.toggle('active');
}

// 4. Função para Localizar no Mapa (Botão dentro do card)
function irParaMapa(coords) {
    map.setView(coords, 16);
    document.getElementById('mapa-section').scrollIntoView({ behavior: 'smooth' });
}

// 5. Filtro de Busca nos Cards
document.getElementById("filtro").addEventListener("input", function() {
    const busca = this.value.toLowerCase();
    const cards = document.querySelectorAll(".location-card");

    cards.forEach(card => {
        const conteudo = card.innerText.toLowerCase();
        card.style.display = conteudo.includes(busca) ? "block" : "none";
    });
});

// 6. Localização Real do Usuário (Opcional)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        const userCoords = [pos.coords.latitude, pos.coords.longitude];
        L.circle(userCoords, { color: '#2ecc71', radius: 150 }).addTo(map).bindPopup("Sua Localização");
    });
}
