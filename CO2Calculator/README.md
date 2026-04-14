# 🌍 Calculadora de Emissões de CO2

Uma aplicação web interativa para calcular sua pegada de carbono e contribuir para um planeta mais sustentável.

## 📋 Características

✅ **Cálculo Completo** - 4 categorias principais:
- 🚗 **Transporte** (carro, voos, transporte público)
- ⚡ **Energia** (eletricidade, gás natural, aquecimento)
- 🍽️ **Alimentação** (dieta personalizada)
- ♻️ **Resíduos** (lixo, reciclagem, eletrônicos)

✅ **Funcionalidades Avançadas**:
- 📊 Gráficos dinâmicos em tempo real
- 📋 Histórico de cálculos (salvo no navegador)
- 🌙 Modo escuro/claro
- 📄 Exportar resultados em PDF
- 📈 Comparação com média brasileira
- 💡 Dicas personalizadas para reduzir emissões

## 🚀 Como Usar

### 1. Abrir a Aplicação
Abra o arquivo `index.html` em qualquer navegador moderno.

### 2. Preencher os Dados
- Clique em cada aba (Transporte, Energia, etc.)
- Preencha os valores correspondentes à sua vida
- Os cálculos são feitos automaticamente

### 3. Ver Resultados
- Clique na aba **Resultados**
- Veja seu total anual, mensal e diário
- Compare com a média brasileira
- Veja o detalhamento por categoria

### 4. Gerenciar Histórico
- Clique no botão 📋 (Histórico)
- Carregue cálculos anteriores
- Veja a tendência de suas emissões

### 5. Exportar
- Clique em **Exportar como PDF**
- O arquivo será baixado automaticamente

## 📊 Fatores de Emissão Utilizados

Os cálculos usam fatores de emissão baseados em dados reais:

### Transporte
- **Gasolina**: 2.31 kg CO2 por litro
- **Diesel**: 2.68 kg CO2 por litro
- **Elétrico**: 0 kg CO2 (zero direto)
- **Híbrido**: 1.15 kg CO2 por litro
- **Voos Nacionais**: 0.255 kg CO2 por km
- **Voos Internacionais**: 0.195 kg CO2 por km
- **Transporte Público**: 0.089 kg CO2 por km

### Energia
- **Eletricidade**: 0.42 kg CO2 por kWh
- **Gás Natural**: 2.04 kg CO2 por m³
- **Óleo Combustível**: 3.15 kg CO2 por litro
- **Biomassa**: 0.1 kg CO2 por litro

### Alimentação
- **Carne Vermelha**: 27.0 kg CO2 por kg
- **Frango**: 6.9 kg CO2 por kg
- **Peixe**: 12.0 kg CO2 por kg
- **Laticínios**: 1.23 kg CO2 por kg

### Resíduos
- **Aterro Sanitário**: 0.5 kg CO2 por kg
- **Reciclado**: 0.1 kg CO2 por kg
- **Compostado**: 0 kg CO2
- **Roupas**: 5.0 kg CO2 por kg
- **Eletrônicos**: 15.0 kg CO2 por kg

## 💾 Armazenamento de Dados

A aplicação armazena:
- **Histórico de Cálculos**: Até 20 últimos cálculos (localStorage)
- **Preferência de Modo Escuro**: Sua escolha de tema

**Nota**: Os dados são armazenados apenas no seu navegador, não em servidor.

## 🎨 Personalização

### Alterar Cores
Edite as variáveis CSS em `style.css`:

```css
:root {
    --primary-color: #2ecc71;      /* Verde primário */
    --secondary-color: #3498db;    /* Azul secundário */
    --accent-color: #e74c3c;       /* Vermelho destaque */
}
```

### Alterar Fatores de Emissão
Edite a constante `emissionFactors` em `script.js`:

```javascript
const emissionFactors = {
    transport: {
        gasoline: 2.31,  // Altere aqui
        // ...
    }
}
```

## 📱 Compatibilidade

- ✅ Chrome/Edge (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)
- ✅ Modo responsivo para celular

## 📚 Bibliotecas Utilizadas

- **Chart.js** - Gráficos dinâmicos
- **html2pdf.js** - Exportação em PDF

## 🌱 Dicas para Reduzir sua Pegada

1. **Transporte**
   - Use transporte público
   - Compartilhe caronas
   - Caminhe ou use bicicleta
   - Considere carros elétricos

2. **Energia**
   - Invista em painéis solares
   - Use lâmpadas LED
   - Desligue eletrônicos não usados
   - Escolha fornecedores de energia renovável

3. **Alimentação**
   - Reduza carne vermelha
   - Coma alimentos locais e de temporada
   - Reduza desperdício de comida
   - Considere uma dieta mais à base de plantas

4. **Resíduos**
   - Recicle o máximo possível
   - Compostagem de orgânicos
   - Compre menos roupas novas
   - Repare eletrônicos ao invés de descartar

## 📊 Comparação com Média

- **Média Brasil**: ~2.200 kg CO2/ano per capita
- **Ideal Global**: ~2.000-2.300 kg CO2/ano
- **Meta 2050**: ~1.500 kg CO2/ano per capita

## 🔐 Privacidade

A aplicação funciona integralmente no seu navegador. Nenhum dado é enviado a servidores externos.

## 🤝 Contribuições

Sugestões de melhorias:
- Adicionar mais tipos de alimento
- Integrar com APIs de energia local
- Adicionar mais categorias (moda, eletrônicos)
- Traduzir para mais idiomas

## 📄 Licença

Criado para fins educacionais e ambientais.

---

**Feito com 💚 pelo planeta** 🌍
