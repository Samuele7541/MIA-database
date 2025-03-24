document.addEventListener("DOMContentLoaded", function() {
    let funghi = [];
	
	/*MENU SELEZIONE*/
    let links = document.querySelectorAll("nav a");
    let selettore = document.querySelector("nav span");
    let attivo = null; // Tiene traccia della voce attualmente selezionata
    
    function aggiornaSelettore(link) {
        let bounding = link.getBoundingClientRect();
        let navBounding = link.parentElement.getBoundingClientRect();
    
        selettore.style.width = `${bounding.width}px`;
        selettore.style.left = `${bounding.left + bounding.width / 2 - navBounding.left}px`; // Centra il selettore
    }
    
    //SCORRIMENTO
    links.forEach(link => {
        link.addEventListener("mouseover", function () {
            if (attivo === null) { //RESET POSIZIONE
                aggiornaSelettore(this);
            }
        });
    
        link.addEventListener("click", function (event) {
            event.preventDefault();
            if (this.textContent === "Home") {
                attivo = null; //RESET POSIZIONE
            } else {
                attivo = this; //SELEZIONE EFFETTUATA
            }
            aggiornaSelettore(this);
        });
    });
    
    //RITORNO IN POSIZIONE
    document.querySelector("nav").addEventListener("mouseleave", function () {
        if (attivo === null) {
            aggiornaSelettore(links[0]);
        }
    });
    
    //POSIZIONE INIZIALE IN CASO DI NO N SELEZIONE
    aggiornaSelettore(links[0]);

    const fungiCollectionSection = document.getElementById("fungi-collection");
    const fungiCardsContainer = document.getElementById("fungi-cards-container");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");

    let fungiData = [];
    let currentIndex = 0;
    const maxVisible = 5;

    let originalFungiData = []; // Variabile per memorizzare i dati originali

    async function loadFungi() {
        const response = await fetch('data/funghi.json');
        originalFungiData = await response.json(); // Salva i dati originali
        fungiData = [...originalFungiData]; // Inizializza fungiData con i dati originali

        if (fungiData.length === 0) return;

        currentIndex = 0;
        displayFungi();
        updateButtons();
    }
    
    function displayFungi() {
        fungiCardsContainer.innerHTML = '';
    
        const endIndex = Math.min(currentIndex + maxVisible, fungiData.length);
        for (let i = currentIndex; i < endIndex; i++) {
            const fungi = fungiData[i];
            const card = document.createElement('div');
            card.className = 'fungi-card';
            card.innerHTML = `
                <h3>${fungi.identificativo}</h3> <!-- Mostra l'identificativo -->
                <img src="${fungi.immagine}" alt="${fungi.identificativo}" style="width: 100%; height: auto;">
                <button class="info-button">
                    <i class="fa-solid fa-circle-info"></i> Info
                </button>
            `;
    
            fungiCardsContainer.appendChild(card);
    
            // Aggiungiamo un ritardo per l'effetto di transizione
            setTimeout(() => card.classList.add('show'), 50 * (i - currentIndex));
    
            // Gestione del click sul pulsante Info
            const infoButton = card.querySelector('.info-button');
            infoButton.addEventListener('click', () => {
                // Ripulisci il contenuto della modale
                const modalContent = document.querySelector('.modal-content');
                modalContent.innerHTML = ''; // Rimuovi tutto il contenuto esistente
            
                // Aggiungi il pulsante di chiusura come icona
                const closeButton = document.createElement('span');
                closeButton.className = 'close-button';
                closeButton.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>'; // Aggiungi l'icona
                closeButton.addEventListener('click', () => {
                    document.getElementById('modal').style.display = 'none'; // Chiudi la modale
                });
                modalContent.appendChild(closeButton); // Aggiungi il pulsante di chiusura al contenuto della modale
            
                // Aggiungi il nuovo contenuto
                const title = document.createElement('h2');
                title.id = 'modal-title';
                title.innerText = fungi.identificativo; // Mostra l'identificativo
                title.style.margin = '10px 0'; // Imposta un margine sopra e sotto l'identificativo
                modalContent.appendChild(title);
            
                // Aggiungi l'immagine2 sotto l'identificativo
                const modalImage = document.createElement('img');
                modalImage.src = fungi.immagine2; // Imposta l'immagine2
                modalImage.alt = fungi.identificativo; // Imposta l'attributo alt
                modalImage.style.width = '80%'; // Imposta la larghezza dell'immagine al 80% del contenitore
                modalImage.style.height = 'auto'; // Mantieni l'altezza automatica
                modalImage.style.margin = '10px 0'; // Aggiungi margine sopra e sotto l'immagine
                modalContent.appendChild(modalImage); // Aggiungi l'immagine al contenuto della modale
            
                const scientificName = document.createElement('p');
                scientificName.id = 'modal-scientific-name';
                scientificName.innerText = `Nome scientifico: ${fungi.nome_scientifico}`; // Mostra il nome scientifico
                modalContent.appendChild(scientificName);
            
                const geographicDistribution = document.createElement('p');
                geographicDistribution.id = 'modal-geographic-distribution';
                geographicDistribution.innerText = `Distribuzione geografica: ${fungi.distribuzione_geografica}`;
                modalContent.appendChild(geographicDistribution);
            
                const habitat = document.createElement('p');
                habitat.id = 'modal-habitat';
                habitat.innerText = `Habitat: ${fungi.habitat}`;
                modalContent.appendChild(habitat);
            
                const morphology = document.createElement('p');
                morphology.id = 'modal-morphology';
                morphology.innerText = `Morfologia: ${fungi.morfologia}`;
                modalContent.appendChild(morphology);
            
                const geneticSequence = document.createElement('p');
                geneticSequence.id = 'modal-genetic-sequence';
                geneticSequence.innerText = `Sequenza genetica: ${fungi.sequenza_genetica}`;
                modalContent.appendChild(geneticSequence);
            
                const references = document.createElement('p');
                references.id = 'modal-references';
                references.innerText = `Riferimenti bibliografici: ${fungi.riferimenti_bibliografici}`;
                modalContent.appendChild(references);
            
                const biotechApplications = document.createElement('p');
                biotechApplications.id = 'modal-biotech-applications';
                biotechApplications.innerText = `Applicazioni biotecnologiche: ${fungi.applicazioni_biotecnologiche}`;
                modalContent.appendChild(biotechApplications);
            
                document.getElementById('modal').style.display = 'flex';
            });
        }
    
        updateButtons();
    }
    
    // Gestione della chiusura della finestra modale
    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });
    
    // Gestione della chiusura della finestra modale
    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    function updateButtons() {
        prevButton.style.display = currentIndex === 0 ? "none" : "block";
        nextButton.style.display = currentIndex + maxVisible >= fungiData.length ? "none" : "block";
    }

    function scrollFungi(direction) {
        if (direction === "next" && currentIndex + maxVisible < fungiData.length) {
            currentIndex += maxVisible;
        } else if (direction === "prev" && currentIndex > 0) {
            currentIndex -= maxVisible;
        }

        displayFungi();
    }

    prevButton.addEventListener("click", () => scrollFungi("prev"));
    nextButton.addEventListener("click", () => scrollFungi("next"));

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            if (this.textContent === "Collection") {
                fungiCollectionSection.style.display = "block";
                loadFungi();
            } else {
                fungiCollectionSection.style.display = "none";
            }
        });
    });

    const searchInput = document.querySelector('.searchBar input');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
    
        if (searchTerm === "") {
            // Se la barra di ricerca è vuota, ripristina i dati originali
            loadFungi(); // Ricarica i dati originali
            return; // Esci dalla funzione
        }
    
        const filteredFungi = fungiData.filter(fungi => 
            fungi.identificativo.toLowerCase().includes(searchTerm) || 
            fungi.nome_scientifico.toLowerCase().includes(searchTerm)
        );
    
        currentIndex = 0; // Reset dell'indice corrente
        fungiData = filteredFungi; // Aggiorna i dati dei funghi con quelli filtrati
        displayFungi(); // Mostra i funghi filtrati
        updateButtons(); // Aggiorna i pulsanti
    });
});