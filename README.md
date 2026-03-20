# 🚀 PROSIS - Agent Intelligence Engine

**PROSIS** é um Launchpad de Agentes de IA projetado para acelerar a criação de SaaS e Apps Nativos (iOS/Android). O sistema utiliza uma metodologia de desenvolvimento sequencial, onde um squad de agentes especialistas (CPO, Designer e CTO) guiam o usuário desde a ideia bruta até o código final.

## 🛠️ Tecnologias de Ponta
* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS + Lucide Icons
* **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
* **Inteligência Artificial:** Google Gemini 1.5 Pro/Flash API
* **PWA:** Suporte nativo para instalação em dispositivos móveis.

## 🤖 O Squad de Agentes
1.  **CPO (Product Owner):** Refino de ideia, definição de MVP e escopo.
2.  **UI/UX Designer:** Jornada do usuário e interface visual.
3.  **CTO (Data Architect):** Modelagem de banco de dados e APIs.
4.  **Dev Full-Stack:** Geração de código funcional e integração.

## 🚀 Como Rodar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/genetoengcivil-blip/PROSIS.git](https://github.com/genetoengcivil-blip/PROSIS.git)
    cd PROSIS
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente (.env.local):**
    Crie o arquivo na raiz com as seguintes chaves:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
    GEMINI_API_KEY=sua_chave_gemini
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 📱 Funcionalidades de App Nativo (PWA)
O PROSIS foi construído para ser mobile-first. Para "instalar" no seu celular:
* **iOS:** Compartilhar > Adicionar à Tela de Início.
* **Android:** Menu > Instalar Aplicativo.

## 🔐 Segurança e Acesso
O acesso ao sistema é restrito via login e senha gerenciados pelo Supabase Auth. Certifique-se de configurar as políticas de RLS no seu painel PostgreSQL para garantir a privacidade dos dados.

---
*Desenvolvido para transformar ideias em realidade com o poder da IA.*