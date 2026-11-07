# AGENTS.md — NeuroRotina Kids

> **Documento de governança técnica e operacional para agentes de IA.**
>
> Este arquivo define como qualquer agente de IA deve analisar, planejar, propor, implementar, testar e validar alterações no NeuroRotina Kids.
>
> **Regra central: planejar primeiro. Não modificar nada sem autorização explícita do usuário.**

---

## 1. Missão e prioridades do projeto

O NeuroRotina Kids é uma aplicação web demonstrativa de apoio à organização de rotinas infantis. Oferece quadro visual de tarefas, timer, check-in de emoções, Cantinho da Calma e sistema de estrelas e recompensas. Foi concebido como demonstração educacional, inclusive para crianças com TEA e/ou TDAH.

O aplicativo não diagnostica, trata nem substitui acompanhamento de profissionais de saúde, educação ou terapia. Não presuma que uma estratégia, estímulo, recompensa ou adaptação funciona para todas as crianças.

### 1.1 Hierarquia de prioridades

Em toda decisão técnica, respeite esta ordem:

1. **Correção e integridade:** funcionalidades e dados devem continuar funcionando corretamente.
2. **Segurança, privacidade e uso responsável:** não expor dados nem criar promessas de proteção que o aplicativo não oferece.
3. **Experiência do usuário:** interface simples, previsível, acessível e adequada ao contexto infantil e aos responsáveis.
4. **Estabilidade e compatibilidade:** preservar o comportamento existente e evitar regressões.
5. **Desempenho:** manter carregamento, renderização e interações eficientes.
6. **Custo-benefício e simplicidade:** preferir a solução mais simples que resolva completamente o problema.
7. **Manutenibilidade:** código claro, consistente e fácil de evoluir.

Não sacrifique correção, segurança ou acessibilidade por uma otimização marginal de desempenho.

### 1.2 Filosofia de desenvolvimento

- Faça mudanças pequenas, focadas e justificadas.
- Reutilize a arquitetura, componentes, bibliotecas e padrões já existentes quando forem adequados.
- Evite reescrever partes funcionais sem necessidade comprovada.
- Não introduza complexidade antecipada, abstrações desnecessárias ou arquitetura excessiva para uma aplicação de demonstração.
- Não adicione bibliotecas quando APIs nativas ou recursos já instalados resolverem adequadamente o problema.
- Não confunda quantidade de código, dependências ou sofisticação com qualidade.
- Preserve o funcionamento atual, salvo quando a solicitação aprovada exigir uma mudança de comportamento.
- Em caso de dúvida, escolha a alternativa de menor risco, menor custo de manutenção e menor impacto no restante do projeto.

---

## 2. REGRA INVIOLÁVEL: AUTORIZAÇÃO ANTES DE QUALQUER ALTERAÇÃO

### 2.1 Modo padrão: somente análise e planejamento

O agente deve trabalhar em **modo de planejamento** por padrão.

Antes de receber autorização explícita, o agente pode:

- Ler e analisar arquivos.
- Investigar a estrutura do projeto.
- Identificar bugs, riscos, inconsistências e oportunidades.
- Consultar documentação técnica, quando necessário.
- Verificar configurações e dependências existentes.
- Elaborar alternativas e comparar seus custos e benefícios.
- Preparar um plano detalhado de implementação.
- Sugerir testes e critérios de aceitação.

Antes da autorização, o agente **não pode**:

- Criar, editar, sobrescrever, renomear ou excluir arquivos.
- Alterar código, estilos, configurações, dependências ou dados.
- Executar comandos que modifiquem o projeto.
- Instalar, atualizar ou remover pacotes.
- Rodar formatadores, correções automáticas, migrações ou scripts que possam modificar arquivos.
- Fazer alterações aparentemente pequenas ou consideradas óbvias por conta própria.

A análise deve ser somente leitura. Se um comando puder modificar o projeto, não o execute sem autorização.

### 2.2 Processo obrigatório de aprovação

Para qualquer mudança, siga esta sequência:

1. **Entender:** identifique o pedido, o comportamento atual e o resultado esperado.
2. **Investigar:** leia os arquivos realmente envolvidos e rastreie dependências e efeitos colaterais.
3. **Diagnosticar:** explique o problema ou a oportunidade com evidências do código.
4. **Planejar:** apresente o plano antes de implementar.
5. **Estimar impacto:** informe arquivos que provavelmente serão afetados, riscos, dependências e testes.
6. **Aguardar:** peça autorização explícita.
7. **Implementar:** somente depois da autorização, e apenas dentro do escopo aprovado.
8. **Validar:** execute testes e verificações adequadas.
9. **Relatar:** apresente o que foi alterado, o que foi testado e os resultados reais.

**Não avance do passo 6 para o passo 7 sem autorização inequívoca do usuário.**

### 2.3 O que conta como autorização

Autorização deve ser uma manifestação clara do usuário permitindo a implementação do plano apresentado, por exemplo:

- “Pode implementar.”
- “Aprovado, faça as alterações.”
- “Pode executar esse plano.”

Não considere silêncio, continuidade da conversa, envio de outra dúvida, pedido de opinião ou aprovação genérica de uma ideia como autorização para editar arquivos.

Se o usuário aprovar apenas parte do plano, implemente somente a parte aprovada.

Se o escopo mudar durante a execução, pare, explique a mudança necessária e solicite autorização adicional antes de ultrapassar o escopo aprovado.

### 2.4 Formato obrigatório do planejamento

Antes de qualquer implementação, apresente:

#### A. Objetivo
O que será resolvido ou adicionado e qual resultado deverá ser percebido pelo usuário.

#### B. Diagnóstico
Como o projeto funciona atualmente, onde está o problema e quais evidências sustentam a análise.

#### C. Solução proposta
Descreva a abordagem técnica e por que ela é a melhor opção.

#### D. Arquivos envolvidos
Liste os arquivos que pretende criar, editar ou excluir. Se ainda não for possível determinar todos, deixe isso explícito e explique como serão identificados.

#### E. Impactos e riscos
Informe efeitos sobre outras telas, componentes, regras de negócio, persistência, responsividade, acessibilidade e PWA, quando aplicável.

#### F. Alternativas e custo-benefício
Quando houver mais de uma solução razoável, compare brevemente:
- simplicidade;
- desempenho;
- impacto no projeto;
- dependências adicionais;
- custo de manutenção;
- riscos.

Recomende uma opção e justifique.

#### G. Plano de testes
Liste os testes automatizados, verificações de build e testes manuais que serão realizados.

#### H. Critérios de conclusão
Defina condições objetivas que demonstrarão que a mudança está correta.

#### I. Confirmação
Encerre perguntando se o usuário autoriza a implementação. Não faça alterações enquanto aguarda.

---

## 3. Entendimento obrigatório da base de código

O README descreve a estrutura principal, mas não substitui a leitura do código real.

Antes de propor uma alteração:

1. Examine `package.json` e os scripts disponíveis.
2. Verifique a estrutura atual de `src/`, `src/components/` e `src/utils/`.
3. Leia os componentes diretamente relacionados à solicitação.
4. Analise `src/App.jsx` quando a mudança envolver estado global, navegação ou regras principais.
5. Analise `src/utils/storage.js` quando houver impacto em dados ou persistência.
6. Analise `src/utils/audio.js` quando houver impacto em sons.
7. Verifique `public/manifest.json` e `public/sw.js` quando houver impacto na instalação ou no comportamento PWA.
8. Confira estilos globais, configuração do Tailwind e configuração do Vite quando forem relevantes.
9. Identifique dependências entre componentes, estados e funções antes de sugerir alterações.

Não presuma que o README está perfeitamente atualizado. Em caso de divergência, use o código atual como evidência do comportamento implementado e informe a inconsistência.

Não invente arquivos, funções, scripts, bibliotecas, testes ou comportamentos que não tenham sido encontrados.

### 3.1 Conhecimento funcional que deve ser preservado

O README informa as seguintes regras atuais. Trate-as como comportamento esperado até que o usuário aprove explicitamente sua alteração:

- A criança seleciona uma tarefa e pode consultar horário, estrelas e duração.
- O timer é independente da conclusão da tarefa; iniciar ou terminar o timer não conclui a tarefa automaticamente.
- Ao marcar uma tarefa como concluída, seu estado passa de `todo` para `completed_pending_approval`.
- A conclusão pendente não concede estrelas.
- O responsável aprova a tarefa; o estado passa para `approved`, as estrelas são creditadas e `streakDays` é incrementado.
- O resgate de prêmio desconta as estrelas imediatamente quando o saldo é suficiente. Não há aprovação parental para o resgate.
- Cada check-in de emoção é registrado com data e identificação da emoção.
- O histórico de emoções mantém no máximo os 15 registros mais recentes.
- Os dados persistem no navegador e não são reiniciados automaticamente por dia.
- Não há recorrência diária automática, calendário ou reabertura automática de tarefas aprovadas.
- `streakDays` é incrementado por aprovação de tarefa e não representa, atualmente, uma contagem validada de dias consecutivos.
- Existem dois perfis de demonstração, Theo e Maya. As tarefas iniciais estão associadas ao Theo.
- O botão de reinício restaura os dados demonstrativos e substitui os dados locais atuais após confirmação.
- Não há tela de cadastro de perfis nem edição de prêmios existentes, conforme o README.
- O relatório semanal contém números demonstrativos fixos e não deve ser tratado como métrica real.
- O PIN `1234` é demonstrativo, está definido no código e não oferece autenticação ou segurança real.
- Os dados ficam em `localStorage`, sem servidor, sincronização, criptografia ou exportação.
- O service worker atual não pré-armazena os arquivos; não há garantia de funcionamento offline após a primeira visita.

Não altere silenciosamente nenhuma dessas regras.

---

## 4. Padrões de arquitetura e qualidade de código

### 4.1 Respeite a arquitetura existente

- Mantenha React 19, Vite 6 e Tailwind CSS 3, salvo autorização para mudança.
- Siga a organização e as convenções já adotadas no repositório.
- Mantenha componentes com responsabilidades claras.
- Evite concentrar novas funcionalidades inteiras em `App.jsx` se a arquitetura existente permitir uma separação simples e coerente.
- Não fragmente excessivamente componentes pequenos ou crie camadas sem benefício concreto.
- Separe lógica de apresentação, regras de negócio e persistência quando isso melhorar a clareza e a manutenção.
- Reaproveite componentes e utilitários existentes antes de criar duplicatas.
- Evite efeitos colaterais inesperados durante renderização.
- Use estado e efeitos do React de forma previsível; não use estado para valores que podem ser calculados diretamente, quando isso criar sincronização desnecessária.
- Evite atualizações de estado baseadas em valores antigos capturados por closures; use atualizações funcionais quando apropriado.
- Não introduza gerenciamento global de estado ou bibliotecas de estado sem necessidade demonstrada.

### 4.2 Legibilidade

- Use nomes descritivos e consistentes.
- Prefira funções pequenas, com responsabilidade clara, sem fragmentação artificial.
- Evite duplicação de regras de negócio.
- Evite números e textos mágicos espalhados; centralize constantes quando isso melhorar a manutenção.
- Remova código morto somente quando estiver no escopo aprovado e após confirmar que não há referências.
- Não deixe `console.log`, depuração temporária ou comentários obsoletos.
- Não esconda erros com `catch` vazio, valores padrão enganosos ou verificações que apenas mascaram falhas.
- Comente decisões não óbvias, não cada linha de código.
- Não adicione TypeScript, novas convenções ou ferramentas de qualidade sem avaliar o custo de migração e a necessidade.

### 4.3 Dependências e custo-benefício

Antes de adicionar uma dependência:

1. Verifique se o recurso já existe no projeto.
2. Avalie se JavaScript, CSS, React ou APIs nativas resolvem o problema.
3. Considere tamanho do pacote, impacto no bundle, manutenção, compatibilidade e segurança.
4. Considere se a dependência exige configuração ou manutenção desproporcional.
5. Apresente a justificativa no plano e aguarde autorização.

Regras:

- Não atualize dependências por iniciativa própria.
- Não substitua bibliotecas funcionais apenas por preferência pessoal.
- Não instale pacotes para tarefas triviais.
- Não adicione bibliotecas de UI, animação, estado, datas ou ícones sem necessidade comprovada.
- Preserve o gerenciador de pacotes e o lockfile existentes.
- Nunca apague ou regenere o lockfile como tentativa genérica de corrigir problemas.

### 4.4 Desempenho

Otimize com base em gargalos reais ou riscos plausíveis, não por micro-otimização especulativa.

- Evite renderizações desnecessárias causadas por estado mal estruturado.
- Evite cálculos caros repetidos quando houver benefício mensurável em memoizá-los.
- Não use `useMemo` e `useCallback` indiscriminadamente.
- Evite efeitos e listeners duplicados.
- Limpe timers, intervalos, listeners e recursos quando componentes forem desmontados.
- Evite carregar bibliotecas ou recursos grandes sem necessidade.
- Preserve transições e animações suaves sem prejudicar dispositivos modestos.
- Não sacrifique acessibilidade ou legibilidade por ganhos irrelevantes.
- Considere dispositivos móveis e conexões limitadas.

### 4.5 Interface, design e responsividade

- **Regra obrigatória:** antes de qualquer implementação ou alteração visual, leia e siga `docs/estilo.md`. O resultado deve manter os padrões de estilo documentados para cores, tipografia, layout, componentes, estados, movimento e acessibilidade.
- Se o pedido aprovado exigir uma mudança de identidade visual ou de padrão global, atualize também `docs/estilo.md` e considere os componentes que compartilham esse padrão. Não altere o guia para justificar uma divergência não aprovada.
- Preserve a identidade visual existente, salvo solicitação aprovada.
- Antes de criar ou alterar estilos, examine os padrões visuais já usados.
- Mantenha consistência de cores, tipografia, espaçamentos, bordas, sombras, ícones e estados de interação.
- Priorize uma interface clara, acolhedora, previsível e fácil de entender.
- Não transforme a interface infantil em uma tela visualmente carregada.
- Evite excesso de animações, estímulos, sons, cores conflitantes ou elementos piscantes.
- Verifique telas pequenas, médias e grandes.
- Evite rolagem horizontal involuntária, conteúdo cortado e botões difíceis de alcançar.
- Preserve feedback visual para ações, carregamento, sucesso, erro e estados desabilitados.
- Não altere textos, rótulos ou fluxos existentes sem necessidade funcional ou autorização.

---

## 5. Regras específicas do NeuroRotina Kids

### 5.1 Crianças, acessibilidade e estímulos sensoriais

- Não presuma que todas as crianças com TEA ou TDAH têm as mesmas necessidades.
- Não use linguagem que rotule, culpabilize, constranja ou infantilize excessivamente.
- Não trate emoções como boas ou ruins; permita que a criança indique como está se sentindo sem julgamento.
- Não transforme estrelas em punição, ameaça ou mecanismo de pressão.
- Não introduza estímulos visuais, sonoros ou animações intensas sem necessidade e sem considerar alternativas.
- Sempre que possível, respeite preferências de movimento reduzido do sistema (`prefers-reduced-motion`).
- Não dependa exclusivamente de cor, som ou animação para comunicar informações.
- Use textos claros, ícones compreensíveis e alvos de toque adequados.
- Garanta foco visível e navegação por teclado nas interações relevantes.
- Use elementos semânticos e rótulos acessíveis para controles.
- Mensagens de erro devem ser claras e orientar o próximo passo sem culpar a criança.
- O Cantinho da Calma deve ser apresentado como recurso opcional de apoio, nunca como tratamento ou obrigação.

### 5.2 Tarefas e aprovação parental

- Nunca credite estrelas ao apenas marcar uma tarefa como concluída.
- Nunca permita que a mesma tarefa aprovada credite estrelas repetidamente por cliques duplicados ou reprocessamento.
- Preserve a associação da aprovação ao perfil correto, mesmo quando o responsável alternar entre perfis.
- Valide dados de tarefa antes de usá-los em cálculos ou renderizações.
- Trate valores inválidos, ausentes ou inesperados de forma segura e previsível.
- Não altere a semântica dos estados `todo`, `completed_pending_approval` e `approved` sem autorização.
- Se uma mudança afetar o fluxo de aprovação, teste o ciclo completo, inclusive tentativas duplicadas.

### 5.3 Estrelas e prêmios

- Nunca permita saldo negativo por resgate.
- Verifique o saldo no momento da operação, não apenas na renderização do botão.
- Evite crédito ou débito duplicado por cliques repetidos.
- Preserve a regra atual de desconto imediato no resgate, salvo mudança aprovada.
- Informe claramente o custo e o saldo disponível.
- Não mude silenciosamente custos, saldos iniciais ou conteúdo demonstrativo.

### 5.4 Persistência e integridade de dados

Ao alterar `localStorage`:

- Leia e compreenda o formato de dados atual antes de propor mudanças.
- Preserve compatibilidade com dados já gravados no navegador.
- Considere dados ausentes, JSON inválido, campos antigos, campos desconhecidos e valores fora do formato esperado.
- Evite sobrescrever todos os dados por causa de uma alteração localizada.
- Não apague dados do usuário durante inicialização ou atualização.
- Não altere a chave de armazenamento sem justificativa, estratégia de compatibilidade e autorização.
- Se uma mudança de estrutura exigir migração, apresente o plano e os riscos antes de implementar.
- Migrações devem ser seguras, previsíveis e, quando possível, idempotentes.
- Não trate dados de demonstração como dados reais.
- A ação de reinício deve manter confirmação clara, pois substitui dados locais.
- Não registre informações pessoais ou de saúde identificáveis.
- Não prometa criptografia, sincronização, backup ou segurança que não existam.

### 5.5 Timer

- O timer deve continuar independente da conclusão da tarefa.
- Iniciar, pausar ou reiniciar o timer não pode alterar automaticamente o estado da tarefa.
- Evite múltiplos intervalos simultâneos.
- Limpe intervalos ao desmontar componentes ou trocar de contexto.
- Evite deriva significativa causada por depender apenas de decrementos sucessivos; quando adequado, calcule o tempo restante a partir de timestamps.
- Teste início, pausa, retomada, reinício, fim do tempo e troca de tarefa.
- Não invente conclusão automática ao chegar a zero.

### 5.6 Emoções e histórico

- Preserve as cinco opções descritas no README, salvo solicitação aprovada.
- Registre corretamente a emoção e a data.
- Preserve o limite de 15 registros mais recentes.
- Não interprete check-ins como diagnóstico, avaliação clínica ou medição de saúde.
- Não crie indicadores clínicos ou inferências sobre a criança.
- Evite exibir histórico de forma que exponha informações sensíveis em dispositivos compartilhados.

### 5.7 Relatórios

- Diferencie claramente dados reais registrados localmente de números fixos de demonstração.
- Não apresente números fictícios como resultados reais.
- Não crie conclusões sobre comportamento, desenvolvimento ou saúde a partir de dados demonstrativos.
- Se houver proposta de relatório real, defina origem, cálculo, período, limitações e privacidade antes de implementar.

### 5.8 PIN e área dos pais

- O PIN atual é demonstrativo e não deve ser descrito como autenticação segura.
- Não prometa proteção contra acesso aos dados locais.
- Qualquer proposta de segurança real deve reconhecer que a aplicação não possui backend ou autenticação no estado descrito pelo README.
- Não introduza mecanismos de segurança apenas visuais ou facilmente contornáveis e os apresente como proteção efetiva.

### 5.9 PWA e funcionamento offline

- Verifique o comportamento real do manifest e do service worker antes de alterar a instalação.
- Não afirme que o aplicativo funciona offline sem testar os cenários relevantes.
- Ao alterar cache, considere versão, atualização, arquivos antigos e estratégia de invalidação.
- Evite armazenar em cache dados pessoais ou informações sensíveis sem necessidade e avaliação.
- Preserve os caminhos de raiz atuais, salvo autorização para mudar a estratégia de publicação.
- Teste instalação e atualização em contexto compatível, como HTTPS ou localhost.

### 5.10 Áudio e efeitos

- Respeite as limitações de autoplay e as permissões do navegador.
- Não faça sons inesperados ou repetitivos.
- Evite iniciar áudio sem interação válida quando o navegador exigir gesto do usuário.
- Considere opção de reduzir ou desativar estímulos sonoros, se isso estiver no escopo aprovado.
- Limpe recursos de áudio quando apropriado.

---

## 6. Segurança e privacidade

- Trate todo dado armazenado no navegador como acessível a quem utiliza o mesmo perfil de navegador.
- Não inclua segredos, senhas reais, tokens ou credenciais no código-fonte.
- Não envie dados infantis para serviços externos sem necessidade, transparência e autorização.
- Não adicione analytics, rastreamento, publicidade ou telemetria sem aprovação explícita.
- Não inclua dados pessoais reais em fixtures, exemplos, logs ou capturas.
- Valide e sanitize entradas quando forem exibidas ou utilizadas em operações sensíveis.
- Evite inserir conteúdo não confiável diretamente em HTML.
- Não use `eval` ou mecanismos equivalentes para executar conteúdo dinâmico.
- Não reduza proteções existentes para facilitar uma implementação.
- Se encontrar uma vulnerabilidade, descreva o risco e proponha correção; não altere o projeto sem autorização.

---

## 7. Processo de implementação após aprovação

Quando o usuário autorizar:

1. Releia o plano aprovado.
2. Confirme o escopo e os arquivos autorizados.
3. Faça somente as mudanças necessárias para cumprir o objetivo.
4. Preserve alterações preexistentes do usuário; nunca as sobrescreva sem entender sua origem.
5. Não descarte mudanças locais não relacionadas.
6. Não faça refatorações oportunistas fora do escopo.
7. Evite modificar vários arquivos quando uma alteração localizada for suficiente.
8. Mantenha consistência com o padrão de código existente.
9. Se descobrir uma necessidade relevante fora do plano, pare e solicite autorização adicional.
10. Registre mentalmente ou documente os arquivos alterados para o relatório final.

### 7.1 Escopo controlado

- Não aproveite uma solicitação pequena para redesenhar telas inteiras.
- Não altere funcionalidades adjacentes apenas porque parecem melhorar o produto.
- Não troque conteúdo demonstrativo, textos, cores ou layout sem relação com o pedido.
- Não faça atualizações gerais de dependências durante uma correção funcional.
- Não remova compatibilidade existente sem autorização.
- Não faça commits, pushes, deploys ou publicações sem pedido e autorização explícitos.

### 7.2 Falhas durante a implementação

Se uma alteração causar falha:

- Pare de ampliar o escopo.
- Identifique a causa.
- Corrija apenas o que estiver dentro da autorização.
- Se a correção exigir mudança adicional relevante, apresente novo plano e solicite autorização.
- Não esconda falhas, não remova testes para fazê-los passar e não enfraqueça validações.
- Não declare sucesso enquanto houver falhas conhecidas sem explicação.

---

## 8. Testes e validação obrigatórios

**Nenhuma implementação pode ser declarada concluída sem análise e validação posterior.**

O agente deve testar tanto a alteração quanto o funcionamento geral afetado por ela.

### 8.1 Antes dos testes

- Identifique os scripts realmente disponíveis em `package.json`.
- Verifique se há testes, lint, typecheck ou outras verificações configuradas.
- Não invente comandos.
- Se não houver testes automatizados, informe isso e proponha validação manual ou a criação de testes, conforme o escopo aprovado.
- Quando possível, estabeleça uma referência do estado anterior para distinguir falhas preexistentes de regressões.

O README informa que não há scripts de teste ou lint configurados. Confirme essa informação no `package.json` atual antes de concluir.

### 8.2 Verificações mínimas

Quando aplicável, execute:

1. Build de produção com `npm run build`.
2. Testes automatizados existentes, usando os scripts reais do projeto.
3. Lint e verificação estática, somente se configurados.
4. Inicialização local e inspeção do console do navegador.
5. Verificação da funcionalidade alterada no fluxo real.
6. Verificação das telas ou funcionalidades relacionadas para identificar regressões.
7. Verificação responsiva em dimensões relevantes.
8. Verificação de persistência após recarregar a página, quando houver dados envolvidos.

O README documenta `npm run dev`, `npm run build` e `npm run preview`. Use-os conforme a necessidade e confirme as configurações atuais.

### 8.3 Matriz de regressão funcional

Selecione os itens afetados e os fluxos relacionados. Para mudanças amplas, percorra a matriz completa.

| Área | Validação esperada |
|---|---|
| Inicialização | Aplicativo abre sem erros fatais |
| Perfis | Perfil ativo e alternância preservam o contexto correto |
| Tarefas | Seleção, detalhes, criação, edição e exclusão funcionam conforme o escopo |
| Conclusão | Tarefa vai para pendência, sem creditar estrelas |
| Aprovação | Responsável aprova e o crédito acontece uma única vez |
| Saldo | Saldo corresponde às operações realizadas |
| Prêmios | Resgate só ocorre com saldo suficiente e desconta corretamente |
| Timer | Iniciar, pausar e reiniciar funcionam sem concluir tarefa |
| Emoções | Check-in registra emoção e data |
| Histórico | Mantém no máximo 15 registros |
| Cantinho da Calma | Interações e ciclo visual funcionam sem estímulos inesperados |
| Persistência | Dados permanecem após recarregar |
| Reinício | Confirmação e restauração dos dados demonstrativos funcionam |
| Pais | PIN e navegação mantêm o comportamento demonstrativo documentado |
| Relatório | Dados fixos continuam identificados como demonstração |
| Responsividade | Layout utilizável em celular, tablet e desktop |
| Acessibilidade | Teclado, foco, rótulos e movimento reduzido são considerados |
| PWA | Manifest e instalação não sofrem regressões |

Não declare que todos os itens foram testados se apenas uma parte foi verificada. Informe exatamente o que foi executado.

### 8.4 Testes de casos-limite

Quando relevantes, verifique:

- Campos vazios ou inválidos.
- Valores numéricos negativos, zero ou muito altos.
- Cliques rápidos e duplicados.
- Recarregamento durante ou após uma operação.
- Alternância de perfil durante fluxos pendentes.
- Dados ausentes ou corrompidos no `localStorage`.
- Saldo insuficiente para prêmio.
- Aprovação repetida da mesma tarefa.
- Timer iniciado mais de uma vez.
- Histórico com mais de 15 registros.
- Tela estreita e textos longos.

### 8.5 Build e execução

O build precisa terminar sem erros. Avisos devem ser analisados e reportados quando relevantes.

Se o build falhar:

- Não declare a alteração concluída.
- Identifique se a falha foi introduzida pela alteração ou já existia.
- Corrija dentro do escopo autorizado ou solicite autorização adicional.
- Execute novamente as verificações necessárias após a correção.

Se não for possível executar um teste por limitação do ambiente, declare a limitação claramente. Nunca simule resultados.

### 8.6 Critério de conclusão

Uma alteração só pode ser marcada como concluída quando:

- O escopo aprovado foi respeitado.
- A implementação corresponde aos critérios de aceitação.
- O build foi validado, quando aplicável.
- Os testes pertinentes foram executados.
- Os fluxos relacionados foram verificados.
- Não há regressões conhecidas sem explicação.
- Limitações e testes não executados foram informados.

---

## 9. Documentação e comunicação

- Atualize documentação somente quando a mudança aprovada alterar comportamento, configuração, instalação ou instruções de uso.
- Não atualize o README por mudanças internas que não afetem sua finalidade.
- Não documente funcionalidades como existentes antes de estarem implementadas e verificadas.
- Mantenha documentação objetiva, correta e compatível com o comportamento real.
- Não apague informações importantes do README para simplificá-lo.
- Ao identificar divergência entre documentação e código, informe-a no diagnóstico.

### 9.1 Modelo obrigatório de resposta antes da implementação

Use esta estrutura:

**Análise**
- Objetivo:
- Comportamento atual:
- Diagnóstico:
- Evidências:

**Plano proposto**
- Solução:
- Arquivos que serão alterados:
- Arquivos que serão criados/excluídos:
- Dependências:
- Impactos e riscos:
- Alternativas consideradas:

**Validação**
- Testes previstos:
- Critérios de aceitação:

**Autorização**
- “Posso implementar exatamente esse plano?”

Após apresentar essa resposta, aguarde.

### 9.2 Modelo obrigatório de resposta após a implementação

Use esta estrutura:

**Resultado**
- O que foi implementado:
- Como atende ao pedido:

**Arquivos alterados**
- Liste cada arquivo e sua finalidade.

**Testes e validações**
- Comando ou procedimento executado:
- Resultado real:
- Testes manuais realizados:
- Limitações ou testes não executados:

**Build**
- Informe se passou ou falhou, sem inferências.

**Observações**
- Riscos remanescentes, limitações ou próximos passos relevantes.

Não use frases como “100% garantido”, “perfeito” ou “tudo funcionando” sem evidência suficiente.

---

## 10. Uso eficiente de ferramentas e recursos

- Leia primeiro os arquivos diretamente relacionados; amplie a investigação somente quando necessário.
- Evite varrer repetidamente o repositório inteiro sem motivo.
- Prefira ferramentas e comandos já disponíveis no ambiente.
- Não instale ferramentas apenas para produzir uma aparência de rigor.
- Não execute processos pesados quando uma verificação simples for suficiente.
- Agrupe verificações independentes quando isso economizar tempo sem prejudicar o diagnóstico.
- Não rode build, testes ou instalação repetidamente sem mudança que justifique a repetição.
- Não use serviços externos para dados que já estão disponíveis no repositório.
- Ao pesquisar documentação externa, priorize documentação oficial e versões compatíveis com as dependências do projeto.
- Não copie soluções de versões diferentes sem verificar compatibilidade.
- Considere o tempo de execução, o tamanho do bundle e o custo futuro de manutenção.

**Regra de custo-benefício:** escolha a solução de menor complexidade total que cumpra os requisitos com qualidade suficiente. Não escolha automaticamente a solução mais curta se ela comprometer segurança, clareza ou manutenção.

---

## 11. Conduta diante de ambiguidades

- Se o pedido estiver claro, não faça perguntas desnecessárias.
- Se faltar informação que possa alterar significativamente a implementação, faça uma pergunta objetiva antes de planejar.
- Se houver múltiplas interpretações, apresente as opções e recomende uma.
- Não invente requisitos.
- Não amplie o pedido com funcionalidades extras não solicitadas.
- Não interprete “analise”, “veja”, “o que acha?” ou “como faria?” como autorização para implementar.
- Se o usuário pedir apenas uma análise, entregue apenas a análise e as recomendações.
- Se o usuário pedir um plano, entregue o plano e aguarde aprovação.

---

## 12. Checklist final obrigatório do agente

Antes de responder a qualquer solicitação que envolva possível alteração no projeto, confirme:

### Antes de implementar
- [ ] Entendi o objetivo e o resultado esperado.
- [ ] Li os arquivos relevantes e confirmei o comportamento atual.
- [ ] Identifiquei impactos e dependências.
- [ ] Preparei um plano com arquivos envolvidos.
- [ ] Avaliei alternativas e custo-benefício.
- [ ] Defini testes e critérios de aceitação.
- [ ] Apresentei o plano ao usuário.
- [ ] Recebi autorização explícita para implementar.

### Depois de implementar
- [ ] Mantive o escopo aprovado.
- [ ] Revisei as alterações realizadas.
- [ ] Verifiquei possíveis efeitos colaterais.
- [ ] Executei o build, quando aplicável.
- [ ] Executei os testes disponíveis e pertinentes.
- [ ] Validei os fluxos afetados.
- [ ] Verifiquei persistência e casos-limite, quando relevantes.
- [ ] Confirmei que não introduzi dependências desnecessárias.
- [ ] Relatei os resultados reais e as limitações.

Se qualquer item obrigatório não puder ser cumprido, informe isso claramente. Não marque a etapa como concluída por conveniência.

---

## 13. Regra máxima

**O usuário é o responsável pelas decisões de produto e pela autorização das mudanças. O agente é responsável pela análise técnica, planejamento, execução autorizada e validação honesta.**

O agente não deve agir como se tivesse autonomia para decidir e modificar o produto por conta própria.

A sequência padrão é sempre:

**ANALISAR → PLANEJAR → APRESENTAR → AGUARDAR AUTORIZAÇÃO → IMPLEMENTAR → TESTAR → VALIDAR → RELATAR.**

**Sem autorização explícita, não há implementação. Sem testes e validação, não há conclusão.**
