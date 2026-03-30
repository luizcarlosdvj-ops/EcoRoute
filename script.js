// MAPA CENTRAL EM TAUBATÉ
const map = L.map('map').setView([-23.026, -45.555], 13);
// MAPA OPENSTREETMAP
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
// ÍCONES DOS MARCADORES COR SEPARADA (NORMAL, SELECIONADO E USUÁRIO)
const normalIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const selectedIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const userIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
// PONTOS DE COLETA
const pontos = [
  {
    nome: "PEV Portal Mantiqueira",
    coords: [-23.02783807934763, -45.59524964394488]
  },
  {
    nome: "PEV Cecap",
    coords: [-23.038419303363188, -45.61880788931474]
  },
  { 
    nome: "PEV Centro",
    coords: [-23.028803162170558, -45.55452414441141]
  },
  {
    nome: "PEV Imaculada",
    coords: [-23.047449023860835, -45.545293672440415]
  },
  {
    nome: "PEV Parque Três Marias II",
    coords: [-23.031388956010513, -45.53782141016309]
  },
  {
    nome: "PEV Itaim",
    coords: [-23.02017202574099, -45.52601969038315]
  },
  {
    nome: "PEV Parque São Luiz",
    coords: [-22.99772208852909, -45.560003250506306]
  },
  {
    nome: "PEV Parque Piratininga",
    coords: [-23.010131076369166, -45.593815713260426]
  }
];
// CONTROLE DE MARCADOR SELECIONADO
let marcadorSelecionado = null;
// ADICIONAR MARCADORES
pontos.forEach(ponto => {
  const marker = L.marker(ponto.coords, { icon: normalIcon })
    .addTo(map)
    .bindPopup(`
      <b>${ponto.nome}</b><br>
      Ponto de entrega voluntária de lixo reciclável
    `);
  marker.on('click', () => {
    // volta a cor anterior do marcador selecionado
    if (marcadorSelecionado) {
      marcadorSelecionado.setIcon(normalIcon);
    }
    // marca o atual como selecionado
    marker.setIcon(selectedIcon);
    marcadorSelecionado = marker;
  });
});
// LOCALIZAÇÃO DO USUÁRIO
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const userCoords = [pos.coords.latitude, pos.coords.longitude];
    L.marker(userCoords, { icon: userIcon })
      .addTo(map)
      .bindPopup("Você está aqui")
      .openPopup();
    map.setView(userCoords, 14);
  });
}
// ATIVAR/DESATIVAR DOS PEV
function toggle(element) {
  const pev = element.parentElement;
  pev.classList.toggle("active");
}
// IR PARA MAPA
function irParaMapa(coords) {
  map.setView(coords, 16);
}
// FILTRO
document.getElementById("filtro").addEventListener("input", function () {
  const valor = this.value.toLowerCase();
  const pevs = document.querySelectorAll(".pev");
  pevs.forEach(pev => {
    const texto = pev.innerText.toLowerCase();
    if (texto.includes(valor)) {
      pev.style.display = "block";
    } else {
      pev.style.display = "none";
    }
  });
});
