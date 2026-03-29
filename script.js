// MAPA CENTRAL EM TAUBATÉ
const map = L.map('map').setView([-23.026, -45.555], 13);
// MAPA OPENSTREETMAP
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
// PONTOS DE COLETA
const pontos = [
   {
  nome: "PEV Portal Mantiqueira",
  coords: [-23.02783807934763, -45.59524964394488]
},
  {
  nome: "PEV Cecap ",
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
  nome: "PEV itaim",
  coords: [-23.02017202574099, -45.52601969038315]
},
{
  nome: "PEV Parque São Luiz",
  coords: [-22.99772208852909, -45.560003250506306]
},
{
  nome: "PEV Parque Piratininga",
  coords: [-23.010131076369166, -45.593815713260426]
},
];
// adicionar marcadores
pontos.forEach(ponto => {
  L.marker(ponto.coords)
    .addTo(map)
    .bindPopup(`
      <b>${ponto.nome}</b><br>
      ♻️ Ponto de entrega voluntária
    `);
});
// MARCADORES
pontos.forEach(ponto => {
  L.marker(ponto.coords)
    .addTo(map)
    .bindPopup(`<b>${ponto.nome}</b>`);
});
// LOCALIZAÇÃO DO USUÁRIO
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const userCoords = [pos.coords.latitude, pos.coords.longitude];
    L.marker(userCoords)
      .addTo(map)
      .bindPopup("Você está aqui")
      .openPopup();
    map.setView(userCoords, 14);
  });
}