// 1. Inicialização do Mapa Leaflet
const map = L.map('map').setView([-23.026, -45.555], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Pontos de Coleta
const pontos = [
    { nome: "PEV Imaculada", coords: [-23.047449, -45.545293] },
    { nome: "PEV Centro", coords: [-23.028803, -45.554524] },
    { nome: "PEV Cecap", coords: [-23.038419, -45.618807] },
    { nome: "PEV Piratininga", coords: [-23.010131, -45.593815] }
];

pontos.forEach(ponto => {
    L.marker(ponto.coords)
        .addTo(map)
        .bindPopup(`<b>${ponto.nome}</b><br>Ponto de Entrega Voluntária`);
});

// 3. Funções de Interface
function toggleCard(element) {
    element.classList.toggle('active');
}

function irParaMapa(coords) {
    map.setView(coords, 16);
    document.getElementById('mapa-section').scrollIntoView({ behavior: 'smooth' });
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
            console.log("Resposta bruta:", response);

            if (!response.ok) {
                throw new Error("Erro HTTP: " + response.status);
            }

            return response.text(); // 👈 pega como texto primeiro
        })
        .then(text => {
            console.log("Resposta do PHP:", text);

            let data;

            try {
                data = JSON.parse(text); // tenta converter pra JSON
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
            alert("❌ Erro ao conectar com o servidor.\nVerifique:\n- XAMPP ligado\n- Arquivo empresa.php\n- Console (F12)");
        });
    });
}
