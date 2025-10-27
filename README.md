# node-nfe

Projeto em **Node.js + TypeScript** para emissão/validação de **NF-e** (e NFC-e) com suporte à **ACBrLib** e execução via **Docker**.

---

## ✨ Recursos

- Node.js com TypeScript
- Integração com **ACBrLib** (bibliotecas nativas na pasta `acbrlibs/`)
- Organização de arquivos de trabalho em `data/` (ex.: certificados, XMLs, logs)
- Execução local e em contêiner (`Dockerfile` e `docker-compose.yml`)
- Configuração por variáveis de ambiente (`.env`)

---

## 🧱 Pré-requisitos

- **Node.js** 18+ 
- **npm** (ou **pnpm** / **yarn**)
- **Docker** (opcional, para rodar containerizado)
- Certificado digital **A1** (arquivo `.pfx`) ou **A3** (se aplicável)
- Dados fiscais: **CNPJ**, **CSC/ID CSC** (para NFC-e), **UF** (estado), etc.

---

## 🚀 Começando

### 1) Clonar e instalar dependências

```bash
git clone https://github.com/Gabrielmororo180/node-nfe.git
cd node-nfe
npm install
# ou
# pnpm install
# yarn
```

### 2) Configurar variáveis de ambiente

Crie um arquivo **`.env`** na raiz do projeto (você pode usar um arquivo de exemplo como base, se existir no repositório) e ajuste conforme seu ambiente. Abaixo, um **modelo sugerido** — adapte os nomes/chaves para o que o código realmente espera:

```ini
# Ambiente fiscal: 1 = Produção, 2 = Homologação
AMBIENTE=2
PORT=3333
CERT_PATH=
```

> 🔒 **Segurança**: mantenha certificados e senhas fora do versionamento. Use `.gitignore` para `data/` e para o próprio `.env`, se necessário.

### 3) Scripts de desenvolvimento

Verifique os scripts no `package.json` e ajuste os comandos abaixo conforme necessário:

```bash
# Desenvolvimento (ts-node/nodemon)
npm run dev

# Build + execução
npm run build
npm start
```

---

## 🐳 Executando com Docker

### Build e run diretos

```bash
docker build -t node-nfe .
docker run --env-file .env -p 3000:3000 -v ${PWD}/data:/app/data node-nfe
```

### Usando docker-compose

```bash
docker compose up --build
```

> Dica: monte a pasta `data/` como volume para persistir **XMLs, logs e certificados** fora do contêiner.
> Lembre-se de adicionar os schemas atualizados na pasta `data/schemas`
---

## 🗂️ Estrutura de pastas (sugerida)

```
.
├─ acbrlibs/          # bibliotecas ACBrLib (NFe e dependências nativas)
├─ data/              # certificados (.pfx), XMLs de envio/retorno, logs
├─ src/               # código-fonte TypeScript
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
└─ README.md
```

> Ajuste esta seção para refletir o seu projeto.

---


---

## 🔌 Endpoints / Exemplos de uso
>
> - **POST /nfe/emitir** – emite NF-e
> - **POST /nfe/cancelar** – cancela uma NF-e


---

## 📝 Documentação
Consulte o manual do [ACBrLib](https://acbr.sourceforge.io/ACBrLib/BemVindo.html)

Conheça a versão do [ACBrLib - Demo](https://www.projetoacbr.com.br/forum/topic/63052-acbrlib-demo-download-livre)

Dica: Siga a documentação do .ini, mais fácil de integrar


## 👤 Autor

- Gabriel Mororo – [@Gabrielmororo180](https://github.com/Gabrielmororo180)

Contribuições são bem-vindas! Faça um fork do repositório, crie um branch e abra um PR.
