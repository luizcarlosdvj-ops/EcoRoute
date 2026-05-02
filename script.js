// 1. Inicialização do Mapa Leaflet
const map = L.map('map').setView([-23.026, -45.555], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Variável global para controlar o destaque do marcador
let marcadorAtivo = null;

// 2. Pontos de Coleta
const pontos = [
    { nome: "PEV Imaculada", coords: [-23.047449, -45.545293] },
    { nome: "PEV Centro", coords: [-23.028803, -45.554524] },
    { nome: "PEV Cecap", coords: [-23.038419, -45.618807] },
    { nome: "PEV Piratininga", coords: [-23.010131, -45.593815] },
    { nome: "PEV Itaim", coords: [-23.020458547523464, -45.52598485533881] },
    { nome: "PEV Parque Três Marias II", coords: [-23.03207039845902, -45.538086982449144] },
    { nome: "PEV Jaraguá", coords: [-23.004223977807303, -45.54469594595168] },
    { nome: "PEV Parque São Luiz", coords: [-22.99814044866994, -45.55997380844301] },
    { nome: "PEV Mourisco", coords: [-23.00390795705881, -45.56615361796405] },
    { nome: "PEV Explanada Santa Helena", coords: [-22.99561222100303, -45.57540896134348] },
    { nome: "PEV Jardim Santa Catarina", coords: [-23.011018314245327, -45.581459999181824] },
    { nome: "PEV Portal da Mantiqueira", coords: [-23.0280814754557, -45.59476375587876] },
    { nome: "PEV Parque Urupês", coords: [-22.99999720871826, -45.53393125386039] },
];

// Renderização dos marcadores
pontos.forEach(ponto => {
    const marker = L.marker(ponto.coords).addTo(map);
    marker.bindPopup(`<b>${ponto.nome}</b><br>Ponto de Entrega Voluntária`);
    
    // Adiciona evento de clique para destacar o marcador manualmente no mapa
    marker.on('click', function() {
        destacarMarcador(this);
    });
});

// Função Auxiliar para destacar o marcador visualmente
function destacarMarcador(marker) {
    if (marcadorAtivo) {
        marcadorAtivo._icon.style.filter = "none"; 
    }
    // Aplica um brilho e muda a cor para destacar
    marker._icon.style.filter = "hue-rotate(150deg) brightness(1.2) saturate(2)";
    marcadorAtivo = marker;
}

// 3. Funções de Interface
function toggleCard(element) {
    element.classList.toggle('active');
}

function irParaMapa(coords) {
    map.setView(coords, 16);
    
    // Procura o marcador nas coordenadas clicadas para destacar e abrir popup
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            const latLng = layer.getLatLng();
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
