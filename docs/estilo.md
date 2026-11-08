# Guia de Estilo do NeuroRotina Kids

Este guia registra a linguagem visual do NeuroRotina Kids e define o padrão a seguir em novas telas e alterações de interface. O objetivo é manter uma experiência familiar, calma, clara e utilizável por crianças e responsáveis.

## Direção visual

- Use `public/neuro-rotina-logo.png` como marca global do aplicativo, cabeçalho, tela de erro e ícones de instalação.
- Preserve a identidade acolhedora e lúdica já usada no aplicativo, sem sobrecarregar a tela com estímulos.
- Mantenha a interface previsível: ações, estados e informações equivalentes devem ter aparência e comportamento equivalentes.
- Prefira superfícies claras, texto escuro e acentos de cor com significado consistente.
- Use gradientes suaves somente em áreas de destaque já compatíveis com o produto, como cabeçalhos e banners. Evite transformá-los no fundo de cada componente.
- Não use cor, som ou animação como único meio de transmitir informação.

## Cores

O tema estende a paleta do Tailwind em `tailwind.config.js`. Reutilize essas cores e as classes já presentes nos componentes; não crie valores avulsos sem necessidade.

| Uso | Padrão do projeto |
| --- | --- |
| Fundo e superfícies | Branco, `slate-50` e `calm-50`/`sky-50` |
| Ação principal e informação | `calm-500`/`calm-600` e tons `sky` |
| Apoio e estado positivo | `teal` e `emerald` |
| Atenção, pendência e estrelas | `amber` e `yellow` |
| Erro ou ação destrutiva | `rose` |
| Texto principal e secundário | `slate-800`/`slate-700` e `slate-500`/`slate-400` |

O tema também disponibiliza `sensory-mint`, `sensory-softYellow`, `sensory-lavender`, `sensory-peach` e `sensory-sky`. Use-os com moderação e preserve contraste suficiente entre texto, fundo, bordas e estados interativos. Não atribua significado diferente a uma cor já usada semanticamente sem atualizar este guia e revisar as telas relacionadas.

## Tipografia

- Use Nunito, já carregada em `index.html`, com a pilha de fallback configurada no Tailwind (`Nunito`, `system-ui`, `sans-serif`).
- Use pesos mais fortes para títulos, nomes de tarefas e ações principais; use pesos regulares ou médios para textos explicativos.
- Mantenha hierarquia tipográfica compacta e clara. Rótulos auxiliares podem ser menores, mas informações necessárias para agir devem permanecer legíveis em celular.
- Prefira espaçamento normal entre letras. Não use espaçamento negativo nem aumentos decorativos que prejudiquem a leitura.
- Evite texto longo em caixa alta; reserve caixa alta para rótulos curtos quando seguir um padrão existente.

## Layout e espaçamento

- O layout principal é estreito e centralizado (`max-w-xl`), com conteúdo responsivo e margens laterais. Preserve essa leitura focada, salvo requisito aprovado que justifique outra composição.
- Use a escala de espaçamento do Tailwind (`p-*`, `m-*`, `gap-*`) e mantenha relações consistentes entre agrupamentos, controles e seções.
- Em telas pequenas, priorize uma coluna, ordem de leitura natural e controles que não exijam precisão excessiva. Use `sm:` e `md:` para adaptações pontuais, não para criar uma experiência diferente sem necessidade.
- Evite rolagem horizontal não intencional, conteúdo cortado e mudanças de tamanho causadas por hover, texto ou estados.
- Use cartões para agrupar conteúdo relacionado, não como decoração repetida. Evite cartões dentro de cartões em novas interfaces.

## Superfícies, bordas e sombras

- O padrão atual usa superfícies claras, bordas sutis (`border-slate-100` ou `border-sky-100`) e cantos bem arredondados, frequentemente `rounded-2xl` e `rounded-3xl`.
- Para novas áreas, prefira os raios e superfícies já usados no contexto próximo; não introduza outro sistema de cantos ou sombras sem motivo funcional.
- Use sombras leves para separar superfícies interativas do fundo. Reserve sombras mais fortes para modais e ações de destaque.
- Use bordas mais marcadas para estados que precisam de atenção, como pendência, seleção ou erro, sem depender somente da cor.

## Botões e controles

- Use o padrão de botão existente: rótulo direto, área de toque confortável, alinhamento consistente entre ícone e texto e feedback para hover, foco, pressionado e desabilitado.
- Ações principais devem ter contraste claro e aparência consistente em telas equivalentes. Ações secundárias podem usar superfícies neutras ou contornos.
- Use botões de ícone apenas para ações reconhecíveis; forneça `title` ou nome acessível quando o significado não estiver explícito no texto visível.
- Prefira ícones de `lucide-react`, já instalado. Emojis podem continuar como elemento de apoio e identidade infantil, mas não devem substituir rótulos necessários.
- Formulários devem manter rótulos associados aos campos, validação clara e foco visível. Não remova o indicador de foco sem substituí-lo por outro igualmente visível.

## Estados e feedback

- Mantenha os usos semânticos atuais: sky/azul para navegação e informação; teal/emerald para sucesso; amber para pendência, atenção e estrelas; rose para erro e remoção.
- Mostre claramente estados selecionado, pendente, concluído/aprovado, carregando, sucesso, erro e desabilitado quando forem relevantes.
- Combine cor com texto, ícone ou outro sinal visual. Mensagens devem ser curtas, concretas e não culpabilizar a criança.
- Preserve os rótulos e fluxos existentes, exceto quando a mudança funcional tiver sido aprovada.

## Ícones, ilustrações e áudio

- Use `lucide-react` para ícones de interface e mantenha tamanho e alinhamento coerentes com o texto ao redor.
- Reaproveite emojis e símbolos existentes quando ajudarem no reconhecimento de tarefas e emoções; evite misturar muitos estilos de ícone na mesma área.
- Sons devem ser suaves, iniciados em resposta a uma interação válida e nunca ser necessários para compreender um resultado. Considere as limitações de autoplay e as preferências sensoriais.

## Movimento e animação

- As animações existentes são pontuais e suaves; o CSS global define `animate-pulse-gentle` e `animate-breathe`. Reutilize-as somente quando ajudarem a compreender uma ação ou estado.
- Evite movimento contínuo desnecessário, piscadas, mudanças rápidas de escala e efeitos que distraiam ou causem desconforto.
- Toda animação nova deve respeitar `prefers-reduced-motion`, desativando ou reduzindo movimento quando a preferência do sistema estiver ativa.
- Movimento nunca deve ser o único indicador de estado. Não adicione animação a cada interação por padrão.

## Acessibilidade e responsividade

- Use elementos semânticos, rótulos acessíveis e controles operáveis por teclado.
- Mantenha indicador de foco claramente visível e contraste adequado em estados normais, hover, foco e desabilitado.
- Verifique que textos não se sobreponham ou transbordem e que controles sejam utilizáveis em celulares, tablets e desktops.
- Respeite movimento reduzido e não use apenas cor, som ou animação para comunicar informações.
- Considere legibilidade, previsibilidade e possíveis sensibilidades sensoriais sem presumir que todas as crianças têm as mesmas necessidades.

## Implementação

- Use primeiro as classes utilitárias Tailwind e os tokens já configurados; mantenha CSS global para estilos realmente compartilhados ou animações que não caibam bem nas utilidades existentes.
- Siga as convenções do componente e da tela mais próxima. Não introduza outra biblioteca de UI, ícones, fontes ou animações sem necessidade comprovada e autorização.
- Faça mudanças visuais localizadas. Uma alteração aprovada na identidade, nos tokens ou nos padrões globais deve atualizar este guia e considerar as telas que compartilham o padrão.
- Antes de concluir uma mudança de interface, confira estados interativos, teclado/foco, movimento reduzido e dimensões móveis e desktop relevantes.

## Referências no código

- `index.html`: carregamento da fonte Nunito e metadados visuais.
- `tailwind.config.js`: cores e família tipográfica estendidas.
- `src/index.css`: estilos globais e animações próprias.
- `src/App.jsx` e `src/components/`: aplicação dos padrões nas telas e nos fluxos.