SUPSI 2025  
Corso d’interaction design, CV429.01  
Docenti: A. Gysin, G. Profeta  

Elaborato 2: Estensione jpeg 

# jpeg
Autore: Leonardo Mariucci  
[jpeg]([https://ixd-supsi.github.io/2023/esempi/mp_hands/es6/1_landmarks](https://leomariu.github.io/jpeg/))


## Introduzione e tema
Questo sito è stato creato per spiegare in modo chiaro e accessibile il funzionamento del formato JPEG, uno degli standard di compressione delle immagini più utilizzati al mondo. Attraverso una panoramica storica, una descrizione tecnica dettagliata del processo di compressione e un confronto con formati successivi, il sito aiuta a comprendere perché JPEG è ancora oggi così diffuso e come riesce a ridurre le dimensioni delle immagini mantenendo una qualità visiva accettabile.


## Riferimenti progettuali
Per questo progetto ho scelto di adottare uno stile il più semplice e minimale possibile, con l’obiettivo di rendere i contenuti chiari, leggibili e privi di elementi superflui.

Riferimento:
http://motherfuckingwebsite.com



## Design dell’interfaccia e modalità di interazione

L’interfaccia del sito presenta un design estremamente semplice e pulito, pensato per facilitare la lettura e guidare l’utente attraverso i contenuti senza distrazioni. Il layout è composto da una singola colonna centrale, con testi ben organizzati in paragrafi e sezioni tematiche chiaramente distinguibili grazie all’uso di titoli e sottotitoli. La modalità principale di interazione è lo scroll verticale: l’utente viene accompagnato in un percorso lineare attraverso la spiegazione del formato JPEG, senza dover cliccare su pulsanti o navigare tra pagine diverse. Non sono presenti elementi interattivi avanzati o animazioni, proprio per mantenere l’esperienza il più diretta e leggibile possibile. Il sito è inoltre responsive, cioè adattabile a schermi di diverse dimensioni, e può essere consultato comodamente anche da dispositivi mobili. Questa scelta di design minimale rispecchia l’obiettivo principale del progetto: rendere l’informazione tecnica accessibile a tutti, evitando qualsiasi elemento che possa distrarre dal contenuto.

## Tecnologia usata
Il sito è stato realizzato utilizzando HTML, CSS e JavaScript puro, senza framework o librerie esterne, in linea con l’approccio semplice e minimale del progetto. L’unica interazione dinamica è stata implementata tramite JavaScript, ed è proprio qui che si concentra la parte più interessante del codice: l’utente ha la possibilità di caricare una propria immagine dal dispositivo e ridimensionarla in tempo reale utilizzando una barra di scorrimento. Questo consente di visualizzare concretamente gli effetti della compressione e della riduzione di dimensioni, rendendo tangibile il concetto spiegato nel testo. L’interazione è gestita attraverso l’oggetto FileReader per caricare l’immagine, e poi con un elemento <canvas> per ridisegnare l’immagine alla nuova dimensione selezionata. La barra di input di tipo range permette all’utente di scegliere la percentuale di riduzione, e a ogni cambiamento del valore viene aggiornata l'immagine sul canvas e mostrata la nuova dimensione in kilobyte. Un esempio semplificato di questa logica in JavaScript potrebbe essere il seguente:

```JavaScript

slider.addEventListener('input', () => {
  const scale = slider.value / 100;
  const width = originalWidth * scale;
  const height = originalHeight * scale;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  canvas.toBlob(blob => {
    sizeLabel.textContent = `${(blob.size / 1024).toFixed(2)} KB`;
  }, 'image/jpeg', 0.8);
});
```


## Target e contesto d’uso
Il sito è rivolto principalmente a studenti e a chi vuole comprendere in modo semplice e diretto come funziona la compressione JPEG. Pensato per un contesto educativo o divulgativo, il progetto unisce spiegazione testuale e interazione pratica per rendere accessibili concetti tecnici anche a un pubblico non esperto.

