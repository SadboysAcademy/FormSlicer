/**not:
 * Vi que o plugin jqueryvalidate usava de regras de regex para validar, então tive a ideia
 * de usar essas regras dentro de objetos para o mesmo.
 * Na função ele está pegando o botão atualNext para saber qual fieldset está ativo no momento,
 * após isso ele cria um objeto com todos os inputs que estão nesse mesmo fieldset, usa o slice
 * para criar uma array e faz um forEach para testar todos os inputs com suas devidas regras.
 * O contador então retorna verdadeiro se todos os inputs estiverem corretos
 * 
 * TODO: Colocar as outras validações
 */

function validar() {
   // Regras tiradas da página do mozilla sobre regex
   'use strict';
   var regrasREGEX = {
      email: /[^\s]*@[a-z0-9.-]*/i,
      num: /^[0-9]*$/,
      texto: /[a-zA-Z]/,
      nome: /[a-zA-Z]{5,15}/,
   };

   let contador = 0;
   var botaoAtual = document.querySelector('.atualNext');
   var inputs = botaoAtual.parentNode.getElementsByTagName('input');
   var inputsArr = Array.from(inputs);
   inputsArr.forEach(function (x) {
      if (!regrasREGEX.texto.test(x.value)) {
         x.placeholder = 'erro';
         contador++;
      }
   });

   // contador == 0 significa que não foi encontrado erros
   return contador === 0;
}



/** not:
 * Antes do loop: Ele então cria uma variavel pega todos os fieldsets (collection).
 * No loop ele vai então começar a criar os botões de previous e next para inserir
 * nos fieldsets. Eu inseri a classe bgt para então depois criarmos o nosso css 
 * padrão da biblioteca, não usei innerHTML pois pode causar altos erros depois, 
 * por fim eu coloquei .type = "button" pois o botão dentro de uma form tem a 
 * propriedade padrão de dar refresh na pagina, causando então que tudo desmoronasse :(.
 * No primeiro if ele ve se o elemento possui um outro fieldset na frente ou atrás 
 * (é um fieldset sem ser o primeiro ou o ultimo), no segundo ele ve se ele é o 
 * primeiro (possui next) poderia ser também colocado !nextElement é também inserida 
 * a classe atualnext, no ultimo ele ve se ele é o ultimo (possui prev).
 */

function criarBotoes() {
   'use strict';
   var fieldsets = document.getElementsByTagName('fieldset');

   for (var i in fieldsets) {
      var prev = document.createElement('button');
      prev.classList.add('prev', 'bgt');
      prev.textContent = 'voltar';
      prev.type = 'button';
      var next = document.createElement('button');
      next.classList.add('next', 'bgt');
      next.textContent = 'avançar';
      next.type = 'button';
      if (fieldsets[i].previousElementSibling && fieldsets[i].nextElementSibling) {
         fieldsets[i].appendChild(prev);
         fieldsets[i].appendChild(next);
      } else if (fieldsets[i].nextElementSibling) {
         next.classList.add('atualNext');
         fieldsets[i].appendChild(next);
      } else if (fieldsets[i].previousElementSibling) {
         fieldsets[i].appendChild(prev);
      }
   }
}

/** not:
 * Criei pra melhorar a visualização do código, as classes estavam gigantescas então achei
 * melhor criar essas funções para facilitar a visualização
 * @param elementoDesejado
 * @returns o ultimo filho do irmão do pai
 */

function ultimoFilhoProximoPai(botaoAtual) {
   'use strict';
   return botaoAtual.parentNode.nextElementSibling.lastChild;
}

/** not: 
 * Reconhece o primeiro botão next, coloca o fieldset (parente) como none 
 * pega o proximo fieldset irmão do parente e coloca block.
 * No if é meio confuso mas é algo como se o ultimo elemento do proximo fieldset for também um 
 * botão  * que possui a classe next (para então não dar erro com o botão de previous) ele coloca 
 * .atualNext nele. Se ele possuir um botão antes (prev) ele coloca atualPrev. Se não existir 
 * mais um next (else) ele coloca esse botao como atualPrev no fim ele remove então as classes 
 * do botão que foi clicado.
 */

function prox() {
   //NEXT
   'use strict';
   var botaoAtual = document.getElementsByClassName('atualNext')[0];
   if (!validar()) {
      return;
   }
   botaoAtual.parentElement.style.display = 'none';
   botaoAtual.parentElement.nextElementSibling.style.display = 'block';
   if (ultimoFilhoProximoPai(botaoAtual).classList.contains('next')) {
      ultimoFilhoProximoPai(botaoAtual).previousElementSibling.classList.add('atualPrev');
      ultimoFilhoProximoPai(botaoAtual).classList.add('atualNext');
   } else {
      ultimoFilhoProximoPai(botaoAtual).classList.add('atualPrev');
   }
   botaoAtual.parentNode.lastChild.previousElementSibling.classList.remove('atualPrev');
   botaoAtual.classList.remove('atualNext');
}

/** not:
 * @param elementoDesejado
 * @returns o ultimo filho do irmão anterior do pai
 */


function ultimoFilhoPreviousPai(botaoAtual) {
   'use strict';
   return botaoAtual.parentNode.previousElementSibling.lastChild;
}


/** not: 
 * Reconhece o primeiro botão atualPrev, coloca o fieldset (parente) como display:none 
 * pega o proximo fieldset irmão do parente e coloca block.
 * No if ele pega o pai, depois pega o ultimo elemento igual ao pai antes dele, procura
 * o ultimo filho, pega o ultimo irmão e ve se é next ou previous a confusão maior é 
 * pra manter o atualNext e na hora que acaba os previous, mas isso é resolvido no else 
 * (que ve se ele possui um irmao pro ultimo filho).
 * No fim ele remove então as classes do botão que foi clicado.
 */

function prev() {
   // botão de voltar
   'use strict';
   var botaoAtual = document.getElementsByClassName('atualPrev')[0];
   botaoAtual.parentElement.style.display = 'none';
   botaoAtual.parentElement.previousElementSibling.style.display = 'block';
   if (ultimoFilhoPreviousPai(botaoAtual).previousElementSibling.classList.contains('prev')) {
      ultimoFilhoPreviousPai(botaoAtual).previousElementSibling.classList.add('atualPrev');
      ultimoFilhoPreviousPai(botaoAtual).classList.add('atualNext');
   } else {
      ultimoFilhoPreviousPai(botaoAtual).classList.add('atualNext');
   }
   botaoAtual.parentNode.lastChild.previousElementSibling.classList.remove('atualPrev');
   botaoAtual.classList.remove('atualNext');
}

/** not:
 * 
 * Partes: 
 * 1. Ao clicar no botão "Começar processo" esconde todas as fieldsets que não sejam o primeiro,
 * atenção para o seletor css que utilizei que escolhe todos que não sejam o primeiro do tipo
 * escolhido seria algo como (!firstFieldset).
 * 2. Eventlistener para o next e previous, tive que colocar no if 
 * pq elementos dinamicos criados com DOM não são automaticamente 
 * add ao event listener. Ele então reconhece se o target tem a classe desejada.
 */

function main() {
   // 1
   'use strict';
   document.getElementById('btn-start').addEventListener('click', function () {
      var fieldsets = document.querySelectorAll('fieldset:not(:first-of-type)');
      var fieldsetsArr = Array.from(fieldsets);
      fieldsetsArr
         .forEach(function (x) {
            x.style.display = 'none';
         });

      criarBotoes();
      document.getElementById('btn-start').remove();
   });

   // 2
   document.getElementsByTagName('form')[0].addEventListener('click', function (e) {
      if (e.target && e.target.matches('.atualNext')) {
         prox();
      } else if (e.target && e.target.matches('.atualPrev')) {
         prev();
      }
   });
}



/** Prepara função ao ativar tela */
window.onload = main;