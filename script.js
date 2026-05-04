// 1. Inicialização do Mapa Leaflet
const map = L.map('map').setView([-23.026, -45.555], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Variável global para controlar o destaque do marcador
let marcadorAtivo = null;

// Ícones customizados usando SVG de pin
function criarIcone(cor) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
            <path fill="${cor}" stroke="#fff" stroke-width="1.5"
                d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
            <circle fill="white" cx="12.5" cy="12.5" r="5"/>
        </svg>`;
    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
}

const iconeAzul  = criarIcone('#2563eb');
const iconeVerde = criarIcone('#16a34a');

// 2. Pontos de Coleta
const pontos = [
    { nome: "PEV Imaculada", endereco: "Av. Nossa Senhora Imaculada Conceição, 2033 - Imaculada Conceição, Taubaté - SP", coords: [-23.047449, -45.545293] },
    { nome: "PEV Centro", endereco: "Praça Dr. Euzébio da Câmara Leal, 142 - Centro, Taubaté - SP", coords: [-23.028803, -45.554524] },
    { nome: "PEV Cecap", endereco: "Rua Paulo Wagner de Barros, 201 - Cecap, Taubaté - SP", coords: [-23.038419, -45.618807] },
    { nome: "PEV Piratininga", endereco: "Rua Antônio da Silva Lobo, 992 - Piracangaguá, Taubaté - SP", coords: [-23.010131, -45.593815] },
    { nome: "PEV Itaim", endereco: "Av. Joaquim Ferreira da Silva, 241 - Itaim, Taubaté - SP", coords: [-23.020458547523464, -45.52598485533881] },
    { nome: "PEV Parque Três Marias II", endereco: "Av. Vereador Rodson Lima - Parque Três Marias, Taubaté - SP", coords: [-23.03207039845902, -45.538086982449144] },
    { nome: "PEV Jaraguá", endereco: "Av. Manoel Antônio de Carvalho, 1540 - Jardim Ana Rosa, Taubaté - SP", coords: [-23.004223977807303, -45.54469594595168] },
    { nome: "PEV Parque São Luiz", endereco: "Av. Ivan da Silva Cunha, 605 - Parque São Luiz, Taubaté - SP", coords: [-22.99814044866994, -45.55997380844301] },
    { nome: "PEV Mourisco", endereco: "Av. José Benedito Penna Guimarães, 201 - Jardim Mourisco, Taubaté - SP", coords: [-23.00390795705881, -45.56615361796405] },
    { nome: "PEV Explanada Santa Helena", endereco: "Rua Jaime Domingues da Silva, 457 - Jardim Santa Helena, Taubaté - SP", coords: [-22.99561222100303, -45.57540896134348] },
    { nome: "PEV Jardim Santa Catarina", endereco: "Av. São Francisco das Chagas, 209 - Parque Aeroporto, Taubaté - SP", coords: [-23.011018314245327, -45.581459999181824] },
    { nome: "PEV Portal da Mantiqueira", endereco: "Av. Portal da Mantiqueira, S/N - Portal da Mantiqueira, Taubaté - SP", coords: [-23.0280814754557, -45.59476375587876] },
    { nome: "PEV Parque Urupês", endereco: "Rua Fernandópolis, 50 - Parque Urupês, Taubaté - SP", coords: [-22.99999720871826, -45.53393125386039] },
];

// Renderização dos marcadores
pontos.forEach(ponto => {
    const marker = L.marker(ponto.coords, { icon: iconeAzul }).addTo(map);
    marker.bindPopup(`
        <b>${ponto.nome}</b><br>
        <i class="fas fa-map-marker-alt" style="color:#16a34a"></i> ${ponto.endereco}<br>
        <i class="fas fa-clock" style="color:#16a34a"></i> Seg–Sex: 07:00–17:00 · Sáb: 08:00–12:00
    `);
    
    // Adiciona evento de clique para destacar o marcador manualmente no mapa
    marker.on('click', function() {
        destacarMarcador(this);
    });
});

// Função Auxiliar para destacar o marcador visualmente (troca o ícone para verde)
function destacarMarcador(marker) {
    // Restaura o ícone azul do marcador anterior
    if (marcadorAtivo) {
        marcadorAtivo.setIcon(iconeAzul);
    }

    // Define o novo marcador ativo e aplica o ícone verde
    marcadorAtivo = marker;
    marker.setIcon(iconeVerde);
}

// 3. Funções de Interface
function toggleCard(element) {
    const isActive = element.classList.contains('active');

    // Fecha todos os cards abertos
    document.querySelectorAll('.location-card.active').forEach(card => {
        card.classList.remove('active');
    });

    // Se o clicado não estava aberto, abre ele
    if (!isActive) {
        element.classList.add('active');
    }
}

function irParaMapa(coords) {
    map.setView(coords, 16);
    
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            const latLng = layer.getLatLng();
            // Verifica se as coordenadas batem
            if (latLng.lat === coords[0] && latLng.lng === coords[1]) {
                layer.openPopup();
                destacarMarcador(layer);
            }
        }
    });

    const mapaSection = document.getElementById('mapa-section');
    if (mapaSection) {
        mapaSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 4. Filtro de Busca
const filtroInput = document.getElementById("filtro");
if (filtroInput) {
    filtroInput.addEventListener("input", function() {
        const busca = this.value.toLowerCase();
        const cards = document.querySelectorAll(".location-card");

        cards.forEach(card => {
            const conteudo = card.innerText.toLowerCase();
            card.style.display = conteudo.includes(busca) ? "block" : "none";
        });
    });
}

// 5. Máscara de Telefone
const phoneMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, ''); 
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
}

const telInput = document.getElementById('tel-empresa');
if (telInput) {
    telInput.addEventListener('input', (event) => {
        event.target.value = phoneMask(event.target.value);
    });
}

// 6. Lógica de Cadastro (Envia para o PHP)
const formEmpresa = document.getElementById('form-empresa');

if (formEmpresa) {
    formEmpresa.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(formEmpresa);

        fetch('empresa.php', { 
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro HTTP: " + response.status);
            }
            return response.text(); 
        })
        .then(text => {
            let data;
            try {
                data = JSON.parse(text); 
            } catch (e) {
                throw new Error("PHP não retornou JSON válido");
            }

            if (data.status === "sucesso") {
                alert("✅ " + (data.message || "Empresa cadastrada com sucesso!"));
                formEmpresa.reset();
            } else {
                alert("⚠️ " + (data.message || "Erro ao salvar no banco"));
            }
        })
        .catch(error => {
            console.error('Erro detalhado:', error);
            alert("❌ Erro ao conectar com o servidor.\nVerifique seu XAMPP e o arquivo empresa.php");
        });
    });
}
