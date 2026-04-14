// Classe para armazenar dados de cálculo
class CO2Calculation {
    constructor(data) {
        this.date = new Date().toLocaleString('pt-BR');
        this.data = data;
        this.totals = calculateTotals(data);
    }
}

// Sistema de Histórico
const historyManager = {
    storageKey: 'CO2CalculatorHistory',

    getHistory() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    },

    addToHistory(calculation) {
        const history = this.getHistory();
        history.push(calculation);
        if (history.length > 20) history.shift(); // Manter apenas últimos 20
        localStorage.setItem(this.storageKey, JSON.stringify(history));
        this.updateHistoryUI();
    },

    clearHistory() {
        localStorage.removeItem(this.storageKey);
        this.updateHistoryUI();
    },

    updateHistoryUI() {
        const historyList = document.getElementById('historyList');
        const history = this.getHistory();

        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum cálculo salvo ainda.</p>';
            return;
        }

        historyList.innerHTML = history.reverse().map((item, index) => `
            <div class="history-item">
                <h4>Cálculo ${history.length - index}</h4>
                <p><strong>Data:</strong> ${item.date}</p>
                <p><strong>Total Anual:</strong> ${item.totals.annual.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg CO2</p>
                <p><strong>Mensal:</strong> ${item.totals.monthly.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg CO2</p>
                <p><strong>Categorias:</strong> Transporte: ${item.totals.transport.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} | 
                Energia: ${item.totals.energy.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} | 
                Alimentação: ${item.totals.food.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} | 
                Resíduos: ${item.totals.waste.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                <div class="history-item-actions">
                    <button class="load-btn" onclick="historyManager.loadCalculation(${index})">📥 Carregar</button>
                    <button class="delete-btn" onclick="historyManager.deleteItem(${index})">🗑️ Deletar</button>
                </div>
            </div>
        `).join('');
    },

    loadCalculation(index) {
        const history = this.getHistory();
        const calculation = history[history.length - 1 - index];
        const data = calculation.data;

        // Preencher formulários
        document.getElementById('carKm').value = data.carKm || 0;
        document.getElementById('fuelType').value = data.fuelType || 'gasolina';
        document.getElementById('carEfficiency').value = data.carEfficiency || 10;
        document.getElementById('domesticFlights').value = data.domesticFlights || 0;
        document.getElementById('internationalFlights').value = data.internationalFlights || 0;
        document.getElementById('publicTransport').value = data.publicTransport || 0;
        document.getElementById('bicycle').value = data.bicycle || 0;

        document.getElementById('electricity').value = data.electricity || 0;
        document.getElementById('naturalGas').value = data.naturalGas || 0;
        document.getElementById('renewablePercent').value = data.renewablePercent || 0;
        document.getElementById('heatingType').value = data.heatingType || 'eletrico';
        document.getElementById('heatingFuel').value = data.heatingFuel || 0;

        document.getElementById('dietType').value = data.dietType || 'mixed';
        document.getElementById('redMeat').value = data.redMeat || 0;
        document.getElementById('chicken').value = data.chicken || 0;
        document.getElementById('fish').value = data.fish || 0;
        document.getElementById('dairy').value = data.dairy || 0;
        document.getElementById('localFood').value = data.localFood || 'sometimes';

        document.getElementById('totalWaste').value = data.totalWaste || 0;
        document.getElementById('recyclingRate').value = data.recyclingRate || 0;
        document.getElementById('composting').value = data.composting || 0;
        document.getElementById('newClothes').value = data.newClothes || 0;
        document.getElementById('electronics').value = data.electronics || 0;

        // Fechar modal e calcular
        document.getElementById('historyModal').classList.remove('active');
        calculateEmissions();
    },

    deleteItem(index) {
        const history = this.getHistory();
        history.splice(history.length - 1 - index, 1);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
        this.updateHistoryUI();
    }
};

// Fatores de emissão (kg CO2 por unidade)
const emissionFactors = {
    // Transporte (kg CO2 por litro ou km)
    transport: {
        gasoline: 2.31, // por litro
        diesel: 2.68, // por litro
        electric: 0.0, // por km (considerar após energia)
        hybrid: 1.15, // por litro
        flight: {
            domestic: 0.255, // por km (distância média 1000km)
            international: 0.195 // por km (distância média 5000km)
        },
        publicTransport: 0.089, // por km
        bicycle: 0 // zero emissões
    },

    // Energia (kg CO2 por unidade)
    energy: {
        electricity: 0.42, // por kWh (média Brasil)
        naturalGas: 2.04, // por m³
        oil: 3.15, // por litro
        biomass: 0.1 // por litro (biocombustível)
    },

    // Alimentação (kg CO2 por kg)
    food: {
        redMeat: 27.0, // por kg (maior impacto)
        chicken: 6.9, // por kg
        fish: 12.0, // por kg
        dairy: 1.23, // por kg
        vegan: 2.9, // média mensal
        vegetarian: 5.7,
        pescatarian: 8.5,
        mixed: 7.19,
        highMeat: 11.0
    },

    // Resíduos (kg CO2 por kg)
    waste: {
        landfill: 0.5,
        recycled: 0.1,
        composted: 0.0,
        clothing: 5.0, // por kg
        electronics: 15.0 // por kg
    }
};

// Calcular emissões de transporte
function calculateTransport(data) {
    let emissions = 0;

    // Carro pessoal
    if (data.carKm > 0) {
        const litersPerMonth = data.carKm / data.carEfficiency;
        const factor = emissionFactors.transport[data.fuelType] || 2.31;
        emissions += litersPerMonth * factor * 12; // anualizar
    }

    // Voos
    if (data.domesticFlights > 0) {
        emissions += data.domesticFlights * 1000 * emissionFactors.transport.flight.domestic; // 1000km médio
    }
    if (data.internationalFlights > 0) {
        emissions += data.internationalFlights * 5000 * emissionFactors.transport.flight.international; // 5000km médio
    }

    // Transporte público
    if (data.publicTransport > 0) {
        emissions += data.publicTransport * emissionFactors.transport.publicTransport * 12;
    }

    return Math.max(0, emissions);
}

// Calcular emissões de energia
function calculateEnergy(data) {
    let emissions = 0;

    // Eletricidade
    if (data.electricity > 0) {
        const factor = emissionFactors.energy.electricity;
        const renewableReduction = (data.renewablePercent || 0) / 100;
        emissions += data.electricity * factor * (1 - renewableReduction) * 12;
    }

    // Gás natural
    if (data.naturalGas > 0) {
        emissions += data.naturalGas * emissionFactors.energy.naturalGas * 12;
    }

    // Aquecimento (combustível adicional)
    if (data.heatingFuel > 0) {
        let factor = emissionFactors.energy.oil; // padrão óleo
        if (data.heatingType === 'gas') factor = emissionFactors.energy.naturalGas;
        if (data.heatingType === 'biomassa') factor = emissionFactors.energy.biomass;
        emissions += data.heatingFuel * factor * 12;
    }

    return Math.max(0, emissions);
}

// Calcular emissões de alimentação
function calculateFood(data) {
    let emissions = 0;

    // Carne vermelha
    if (data.redMeat > 0) {
        emissions += data.redMeat * emissionFactors.food.redMeat * 12;
    }

    // Frango
    if (data.chicken > 0) {
        emissions += data.chicken * emissionFactors.food.chicken * 12;
    }

    // Peixe
    if (data.fish > 0) {
        emissions += data.fish * emissionFactors.food.fish * 12;
    }

    // Laticínios
    if (data.dairy > 0) {
        emissions += data.dairy * emissionFactors.food.dairy * 12;
    }

    // Dieta geral (complemento)
    const dietFactor = emissionFactors.food[data.dietType] || 7.19;
    const localFoodReduction = data.localFood === 'always' ? 0.2 : (data.localFood === 'sometimes' ? 0.1 : 0);

    // Se não preencheu carne específica, usar fator da dieta
    if (data.redMeat === 0 && data.chicken === 0 && data.fish === 0) {
        emissions += dietFactor * (1 - localFoodReduction) * 12;
    }

    return Math.max(0, emissions);
}

// Calcular emissões de resíduos
function calculateWaste(data) {
    let emissions = 0;

    // Lixo geral
    if (data.totalWaste > 0) {
        const recycledAmount = (data.totalWaste * (data.recyclingRate || 0)) / 100;
        const landfillAmount = data.totalWaste - recycledAmount;

        emissions += landfillAmount * emissionFactors.waste.landfill * 12;
        emissions += recycledAmount * emissionFactors.waste.recycled * 12;
    }

    // Compostagem
    if (data.composting > 0) {
        emissions += data.composting * emissionFactors.waste.composted * 12;
    }

    // Roupas novas
    if (data.newClothes > 0) {
        emissions += data.newClothes * emissionFactors.waste.clothing;
    }

    // Eletrônicos
    if (data.electronics > 0) {
        emissions += data.electronics * emissionFactors.waste.electronics;
    }

    return Math.max(0, emissions);
}

// Calcular totais
function calculateTotals(data) {
    const transport = calculateTransport(data);
    const energy = calculateEnergy(data);
    const food = calculateFood(data);
    const waste = calculateWaste(data);

    const annual = transport + energy + food + waste;
    const monthly = annual / 12;
    const daily = annual / 365;

    return {
        transport,
        energy,
        food,
        waste,
        annual,
        monthly,
        daily
    };
}

// Coletar dados do formulário
function collectFormData() {
    return {
        // Transporte
        carKm: parseFloat(document.getElementById('carKm').value) || 0,
        fuelType: document.getElementById('fuelType').value,
        carEfficiency: parseFloat(document.getElementById('carEfficiency').value) || 10,
        domesticFlights: parseFloat(document.getElementById('domesticFlights').value) || 0,
        internationalFlights: parseFloat(document.getElementById('internationalFlights').value) || 0,
        publicTransport: parseFloat(document.getElementById('publicTransport').value) || 0,
        bicycle: parseFloat(document.getElementById('bicycle').value) || 0,

        // Energia
        electricity: parseFloat(document.getElementById('electricity').value) || 0,
        naturalGas: parseFloat(document.getElementById('naturalGas').value) || 0,
        renewablePercent: parseFloat(document.getElementById('renewablePercent').value) || 0,
        heatingType: document.getElementById('heatingType').value,
        heatingFuel: parseFloat(document.getElementById('heatingFuel').value) || 0,

        // Alimentação
        dietType: document.getElementById('dietType').value,
        redMeat: parseFloat(document.getElementById('redMeat').value) || 0,
        chicken: parseFloat(document.getElementById('chicken').value) || 0,
        fish: parseFloat(document.getElementById('fish').value) || 0,
        dairy: parseFloat(document.getElementById('dairy').value) || 0,
        localFood: document.getElementById('localFood').value,

        // Resíduos
        totalWaste: parseFloat(document.getElementById('totalWaste').value) || 0,
        recyclingRate: parseFloat(document.getElementById('recyclingRate').value) || 0,
        composting: parseFloat(document.getElementById('composting').value) || 0,
        newClothes: parseFloat(document.getElementById('newClothes').value) || 0,
        electronics: parseFloat(document.getElementById('electronics').value) || 0
    };
}

// Dicas dinâmicas
function generateTips(totals) {
    const tips = [];

    if (totals.transport > totals.annual * 0.4) {
        tips.push('Sua pegada de carbono do transporte é alta. Considere usar transporte público ou compartilhar caronas.');
    }
    if (totals.energy > totals.annual * 0.3) {
        tips.push('Sua consumo de energia é significativo. Invista em painéis solares ou use energia renovável.');
    }
    if (totals.food > totals.annual * 0.2) {
        tips.push('Reduza o consumo de carne vermelha e aumente o consumo de alimentos locais e de temporada.');
    }
    if (totals.waste > totals.annual * 0.1) {
        tips.push('Aumente sua taxa de reciclagem e compostagem. Reduza o consumo de novas roupas e eletrônicos.');
    }

    if (totals.annual > 4000) {
        tips.unshift('⚠️ Sua pegada de carbono está acima da média. Considere fazer mudanças em múltiplas áreas.');
    } else if (totals.annual > 2000) {
        tips.unshift('✓ Sua pegada está próxima à média. Você pode ainda melhorar!');
    } else {
        tips.unshift('✓ Excelente! Sua pegada de carbono está abaixo da média. Mantenha o bom trabalho!');
    }

    // Dicas gerais se lista está vazia
    if (tips.length === 1) {
        tips.push('💡 Caminhe ou use bicicleta para trajetos curtos.');
        tips.push('💡 Reduza o consumo de plástico e use sacolas reutilizáveis.');
        tips.push('💡 Desligue aparelhos eletrônicos quando não estiver usando.');
    }

    return tips;
}

// Atualizar UI com resultados
function updateResultsUI(totals) {
    document.getElementById('totalEmissions').textContent = totals.annual.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    document.getElementById('monthlyEmissions').textContent = totals.monthly.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    document.getElementById('dailyEmissions').textContent = totals.daily.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

    // Comparação
    const brazilAverage = 2200; // kg CO2/ano per capita
    const comparison = ((totals.annual - brazilAverage) / brazilAverage * 100).toFixed(1);
    const comparisonText = document.getElementById('comparisonText');

    if (totals.annual < brazilAverage) {
        comparisonText.innerHTML = `Sua pegada é ${Math.abs(comparison)}% <strong>MENOR</strong> que a média brasileira (${brazilAverage.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg CO2/ano)`;
        comparisonText.style.color = '#27ae60';
    } else {
        comparisonText.innerHTML = `Sua pegada é ${comparison}% <strong>MAIOR</strong> que a média brasileira (${brazilAverage.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg CO2/ano)`;
        comparisonText.style.color = '#e74c3c';
    }

    // Gráficos
    updateCharts(totals);

    // Dicas
    const tips = generateTips(totals);
    document.getElementById('tips').innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

// Variáveis globais para os gráficos
let comparisonChart = null;
let breakdownChart = null;

// Atualizar gráficos
function updateCharts(totals) {
    const ctx1 = document.getElementById('comparisonChart').getContext('2d');
    const ctx2 = document.getElementById('breakdownChart').getContext('2d');
    const brazilAverage = 2200;

    // Destroyer gráficos anteriores
    if (comparisonChart) comparisonChart.destroy();
    if (breakdownChart) breakdownChart.destroy();

    // Gráfico de comparação
    comparisonChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Sua Emissão', 'Média Brasil'],
            datasets: [{
                label: 'kg CO2/ano',
                data: [totals.annual, brazilAverage],
                backgroundColor: [
                    totals.annual < brazilAverage ? '#2ecc71' : '#e74c3c',
                    '#3498db'
                ],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });

    // Gráfico de breakdown
    breakdownChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Transporte', 'Energia', 'Alimentação', 'Resíduos'],
            datasets: [{
                data: [totals.transport, totals.energy, totals.food, totals.waste],
                backgroundColor: ['#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'],
                borderColor: 'var(--bg-color)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Cálculo principal
function calculateEmissions() {
    const data = collectFormData();
    const totals = calculateTotals(data);
    updateResultsUI(totals);

    // Exibir aba de resultados
    switchTab('results');
}

// Alternar abas
function switchTab(tabName) {
    // Remover active de todos
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Adicionar active à selecionada
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Exportar para PDF
function exportToPDF() {
    const element = document.getElementById('results');
    const opt = {
        margin: 10,
        filename: `CO2_Calculator_${new Date().toLocaleDateString('pt-BR')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
}

// Modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateDarkModeButton();
}

function updateDarkModeButton() {
    const btn = document.getElementById('darkModeBtn');
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Resetar formulário
function resetForm() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        document.getElementById('carEfficiency').value = '10';
        document.getElementById('fuelType').value = 'gasolina';
        document.getElementById('heatingType').value = 'eletrico';
        document.getElementById('dietType').value = 'mixed';
        document.getElementById('localFood').value = 'sometimes';
        switchTab('transport');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dark mode salvo
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeButton();

    // Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Calcular em tempo real quando mudar valores
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', calculateEmissions);
    });

    // Botões
    document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
    document.getElementById('historyBtn').addEventListener('click', () => {
        historyManager.updateHistoryUI();
        document.getElementById('historyModal').classList.add('active');
    });

    document.getElementById('exportBtn').addEventListener('click', exportToPDF);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('saveBtn').addEventListener('click', () => {
        const data = collectFormData();
        const calculation = new CO2Calculation(data);
        historyManager.addToHistory(calculation);
        alert('✓ Cálculo salvo no histórico!');
    });

    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
            historyManager.clearHistory();
        }
    });

    // Fechar modal
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('historyModal').classList.remove('active');
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('historyModal');
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Carregar histórico inicial
    historyManager.updateHistoryUI();

    // Teste inicial
    calculateEmissions();
});
