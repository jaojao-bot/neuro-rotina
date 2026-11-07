# NeuroRotina Kids

Aplicação web de apoio à organização de rotinas infantis, com quadro visual de tarefas, timer, check-in de emoções e recompensas. O projeto foi criado como demonstração educacional para uma Feira de Ciências, com foco em previsibilidade e reforço positivo para crianças, inclusive aquelas com TEA e/ou TDAH.

O aplicativo é uma ferramenta de organização e demonstração. Não diagnostica, trata ou substitui acompanhamento de profissionais de saúde, educação ou terapia. Os recursos devem ser adaptados às necessidades e preferências de cada criança, sem presumir que uma estratégia funciona para todas.

## O que o aplicativo oferece

### Modo Criança

- Exibe o perfil atualmente selecionado, o saldo de estrelas e as tarefas associadas a esse perfil.
- Permite selecionar uma tarefa e consultar seu horário, valor em estrelas e duração configurada.
- Inclui timer visual regressivo com controles para iniciar, pausar e reiniciar. O timer não conclui a tarefa automaticamente.
- Permite marcar a tarefa selecionada como concluída. A tarefa passa a aguardar aprovação de um responsável.
- Oferece check-in de emoções com cinco opções: Muito Feliz, Calmo/Bem, Cansado, Inquieto/Agitado e Sobrecarregado. A seleção mostra uma mensagem e registra a data.
- Inclui o Cantinho da Calma, com orientação visual de respiração em ciclos de quatro segundos e bolhas interativas.
- Apresenta a loja de prêmios. Se houver estrelas suficientes, a criança pode resgatar um prêmio; o saldo é descontado imediatamente.

### Área dos Pais

A entrada é solicitada por um PIN demonstrativo. A área permite:

- Criar perfis de criança com nome obrigatório e idade e diagnóstico opcionais, editar o nome do perfil selecionado e alternar entre perfis.
- Adicionar e remover sensibilidades do perfil selecionado. Sensibilidades são descrições livres, não avaliações clínicas.
- Excluir um perfil após confirmação. A exclusão também remove as tarefas vinculadas e o saldo daquele perfil; não é possível excluir o último perfil.
- Aprovar tarefas pendentes e creditar as estrelas correspondentes.
- Criar, editar e excluir tarefas. Cada tarefa pode ter título, horário, duração, quantidade de estrelas, categoria, nível de estímulo (baixo, médio ou alto) e dica de adaptação sensorial.
- Criar e excluir prêmios, definindo título, custo em estrelas e descrição.
- Consultar o painel de relatório demonstrativo.

Um perfil novo começa com zero estrelas, sem tarefas próprias e com idade e diagnóstico vazios caso não sejam informados. A idade deve ser um número inteiro positivo quando preenchida. Saldo e sequência de estrelas são inicializados pelo sistema, não preenchidos manualmente. Idade e diagnóstico são opcionais; diagnóstico pode ser uma informação sensível e fica salvo apenas no `localStorage` do navegador. As recompensas e o histórico de emoções permanecem compartilhados entre os perfis; os registros de emoção não estão associados a uma criança específica. Os perfis iniciais e parte do conteúdo são dados de exemplo. Não há edição de prêmios existentes.

## Fluxo principal e regras de negócio

1. Um responsável escolhe o perfil ativo e configura tarefas e prêmios na Área dos Pais.
2. Na tela da criança, a tarefa pode ser selecionada e o timer pode ser iniciado separadamente.
3. Ao tocar em “Terminei esta tarefa”, o estado muda de `todo` para `completed_pending_approval`. Nenhuma estrela é concedida nessa etapa.
4. O responsável aprova a tarefa na fila de aprovação. O estado muda para `approved`, as estrelas da tarefa são somadas ao saldo do perfil correspondente e a sequência de dias (`streakDays`) aumenta em um.
5. Ao resgatar um prêmio cujo custo não excede o saldo, o custo é subtraído imediatamente. Não existe etapa de aprovação parental para o resgate.
6. Cada check-in de emoção é acrescentado ao histórico, com data e identificação da emoção. O armazenamento mantém no máximo os 15 registros mais recentes.

Os estados das tarefas e o saldo persistem no navegador e não são reiniciados por dia. Não há recorrência diária automática, calendário ou regra que reabra tarefas aprovadas. A sequência é incrementada por aprovação de tarefa; não é uma contagem validada de dias consecutivos.

## Dados de demonstração

Na primeira execução, o aplicativo apresenta dois perfis de exemplo, Theo e Maya, além de tarefas, prêmios e registros de emoção pré-carregados. Os registros iniciais servem para demonstrar a interface; não são dados de usuários reais. A lista de tarefas de exemplo está associada ao perfil Theo.

O botão de reinício no cabeçalho restaura os dados de demonstração após confirmação, incluindo saldos, tarefas, prêmios, perfil ativo e registros de emoção. Essa ação substitui os dados locais atuais.

## Persistência, privacidade e limitações

- Os dados do aplicativo são salvos em `localStorage` no navegador, separados por origem e perfil de navegador. Não existe servidor, conta, sincronização entre dispositivos, criptografia ou exportação de dados.
- Limpar os dados do site/navegador pode apagar as informações salvas. Os dados não são compartilhados automaticamente com outros dispositivos.
- O PIN usado para abrir a Área dos Pais é `1234` e está definido no código. Ele serve apenas para demonstrar a troca de área; não é autenticação nem proteção de segurança. Não use o aplicativo como controle de acesso a informações sensíveis.
- O relatório semanal contém números fixos de demonstração. A taxa exibida é calculada a partir de uma série de exemplo; o indicador de crises também é fixo. O painel não calcula métricas semanais reais a partir das tarefas ou do histórico de emoções, e não deve ser apresentado como avaliação clínica ou resultado de pesquisa.
- O projeto inclui manifest e service worker para instalação como PWA. O service worker atual não pré-armazena os arquivos do aplicativo; portanto, não há garantia de que o app abra ou funcione offline após uma primeira visita.
- Sons são sintetizados pela Web Audio API e podem depender de interação do usuário e das permissões/configurações do navegador.

## Executar em desenvolvimento

Pré-requisitos: Node.js e npm instalados.

```bash
npm install
npm run dev
```

O Vite inicia na porta `3000` (configurada em `vite.config.js`) e informa no terminal o endereço local, normalmente `http://localhost:3000`. O servidor também aceita conexões da rede local, o que pode ser útil para testar em outro aparelho conectado à mesma rede.

## Build e pré-visualização

```bash
npm run build
npm run preview
```

O build de produção é gerado na pasta `dist/`. `npm run preview` serve esse build localmente para verificação; use o endereço mostrado pelo Vite. Não há scripts de teste ou lint configurados no `package.json`.

Para publicar, hospede o conteúdo de `dist/` em um servidor web. Para que a instalação PWA esteja disponível de forma confiável em dispositivos, publique em HTTPS (ou teste localmente em `localhost`). A configuração atual usa caminhos de raiz (`/`), portanto a publicação foi preparada para a raiz do domínio.

## Instalar no dispositivo

Com o site publicado, abra-o no navegador do dispositivo:

- **Android:** no Chrome, abra o menu e selecione “Instalar aplicativo” ou “Adicionar à tela inicial”.
- **iPhone/iPad:** no Safari, toque em Compartilhar e selecione “Adicionar à Tela de Início”.

A disponibilidade do convite de instalação depende do navegador e dos critérios da plataforma. A tela “Baixar App” do projeto oferece instruções e permite copiar o endereço atualmente aberto, por exemplo para compartilhar um link ou criar um QR Code.

## Tecnologias

- React 19 e Vite 6
- Tailwind CSS 3 e PostCSS
- Lucide React para ícones
- Web Audio API para sons sintetizados
- `localStorage` para persistência local
- `canvas-confetti` para o efeito visual no resgate de prêmios
- Manifest e service worker para suporte à instalação PWA

## Estrutura principal

```text
src/
   App.jsx                  Estado global, navegação e regras principais
   components/              Telas e componentes do aplicativo
   utils/storage.js         Dados iniciais e persistência local
   utils/audio.js           Síntese dos sons
public/
   manifest.json            Metadados da PWA
   sw.js                    Service worker
```

## Uso responsável

Combine tarefas e prêmios com a criança e seus responsáveis, respeitando limites sensoriais e evitando usar estrelas como punição. O aplicativo não coleta dados em um servidor, mas qualquer pessoa com acesso ao mesmo navegador pode ver os dados locais. Não registre informações pessoais ou de saúde identificáveis em dispositivos compartilhados.
