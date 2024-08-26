let textoUsuario;

document.addEventListener("DOMContentLoaded", () => {
  executarComDelay(animarDialogo, 500);
  executarComDelay(animarTexto, 600);

  let botoes = document.querySelectorAll(".btns");
  console.log("Botões encontrados:", botoes);

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function (e) {
      let evento = e.target; // Pega o botão alvo
      let identidade = evento.id;

      let imgBoneco = document.getElementById("boneco-lupa");

      if (identidade === "criptografar" || identidade === "descriptografar") {
        let condicao = verificarPalavras(); //pegar area texto

        if (condicao.resultado === true) {
          apagarTexto(false);

          imgBoneco.style.opacity = 0; // Corrigido para usar imgBoneco

          executarComDelay(animarTela, 1000, true);
          executarComDelay(animarBotoes, 1500, identidade, botoes);

          if (identidade === "criptografar") {
            colocarTela(criptografar(condicao.texto), false);
          } else {
            colocarTela(descriptografar(condicao.texto), false);
            console.log("a pessoa clicou descriptografar " + condicao.texto);
          }
        } else {
          animarDialogo(condicao);
        }
      } else if (identidade === "voltar") {
        executarComDelay(voltarOuCopiar, 400, identidade, botoes, false);
        imgBoneco.style.opacity = 1;
      } else if (identidade === "copiar") {
        executarComDelay(voltarOuCopiar, 400, identidade, botoes, true);
        imgBoneco.style.opacity = 1;
      }
    });
  });
});

function pegarTextarea(tipo) {
  return tipo
    ? document.getElementById("areaTexto")
    : document.getElementById("areaTexto2");
}

function verificarPalavras() {
  let textarea = pegarTextarea(true);
  let areaTextoValue = textarea.value;

  if (areaTextoValue != "") {
    let regex = /[^a-z\s]/g;
    let matches = areaTextoValue.match(regex);
    console.log(matches);

    let textoInvalido = regex.test(areaTextoValue);

    if (textoInvalido) {
      return {
        resultado: false,
        mensagem: "Este caractere não é permitido: ",
        valores: matches,
      };
    } else {
      console.log("texto valido: " + areaTextoValue);
      textoUsuario = areaTextoValue;
      return { resultado: true, texto: areaTextoValue };
    }
  } else {
    return {
      resultado: false,
      mensagem: "Mensagem",
      valores: "Necessário digitar algum texto",
    };
  }
}

function animarTela(tipo) {
  let card = document.querySelector("main");
  card.style.transform = tipo ? "rotateY(-180deg)" : "rotateY(-360deg)";
}

function animarBotoes(identidade, botoes) {
  let botoesArray = Array.from(botoes);

  if (identidade === "criptografar" || identidade === "descriptografar") {
    botoesArray
      .slice(0, 2)
      .forEach((pegarBtn) => pegarBtn.classList.add("none"));
    botoesArray
      .slice(2)
      .forEach((pegarBtn) => pegarBtn.classList.remove("none"));
  } else {
    botoesArray.slice(2).forEach((pegarBtn) => pegarBtn.classList.add("none"));
    botoesArray
      .slice(0, 2)
      .forEach((pegarBtn) => pegarBtn.classList.remove("none"));
  }
}

function apagarTexto(tipo) {
  let textarea = pegarTextarea(tipo);
  textarea.value = "";
}

function criptografar(texto) {
  console.log("texto para criptografar: " + texto);
  let txt = Trocartexto("criptografar");

  return texto
    .split("")
    .map((str) => txt[str] || str)
    .join("");
}

function descriptografar(texto) {
  console.log("texto para descriptografar: " + texto);
  let lista = Trocartexto("descriptografar");
  const regex = new RegExp(Object.keys(lista).join("|"), "g");

  return texto.replace(regex, (coisa) => lista[coisa]);
}

function Trocartexto(tipo) {
  const lista = {
    e: "enter",
    i: "imes",
    a: "ai",
    o: "ober",
    u: "ufat",
  };

  const listaInvertida = {
    enter: "e",
    imes: "i",
    ai: "a",
    ober: "o",
    ufat: "u",
  };

  return tipo === "criptografar" ? lista : listaInvertida;
}

function colocarTela(texto, tipo) {
  let textarea2 = pegarTextarea(tipo);
  textarea2.value = texto;
}

function voltarOuCopiar(identidade, botoes, tipo) {
  if (tipo) {
    let textArea2 = pegarTextarea(false);
    navigator.clipboard.writeText(textArea2.value);
    alert("Texto copiado para a área de transferência!");
  }
  apagarTexto(true);
  animarTela(false);
  animarBotoes(identidade, botoes);
}

function animarDialogo(texto = false) {
  let balaoDiv = document.querySelector(".balao");

  if (!texto) {
    balaoDiv.style.opacity = 1;
    executarComDelay(fecharDialogo, 4000);
  } else {
    let balaoH3 = document.getElementById("texto-h3");
    balaoH3.innerText = texto.mensagem + " " + texto.valores;
    balaoDiv.style.opacity = 1;
    executarComDelay(fecharDialogo, 6000);
  }
}

function fecharDialogo() {
  let balaoDiv = document.querySelector(".balao");
  balaoDiv.style.opacity = 0;
}

function animarTexto() {
  const elementoTexto = document.getElementById("texto-h3");
  const palavra = elementoTexto.textContent.split(" ");
  elementoTexto.innerHTML = palavra
    .map((letras) => `<span class="palavra">${letras}</span>`)
    .join(" ");

  const elementosSpan = document.querySelectorAll("#texto-h3 .palavra");
  let delay = 0;

  elementosSpan.forEach((palavra) => {
    setTimeout(() => {
      palavra.classList.add("animate");
    }, delay);
    delay += 300;
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executarComDelay(func, delayMs, ...args) {
  await delay(delayMs);
  func(...args);
}
