//la déclaration const crée une référence en lecture seule vers une valeur.  permet au programmeur de signaler au compilateur que l'élément ainsi qualifié ne doit pas être modifié pendant l'exécution du programme. Cet élément sera donc constant tout le long d'une exécution normale du programme

const navburger = (() => {
    
    const btnresponsive = document.querySelector('.burger');
    //Un objet Element représentant le premier élément dans le document qui corresponde au selecteur css
    const nav = document.querySelector('.nav-links');
        
    const navLinks = document.querySelectorAll('.nav-links li');
    
    btnresponsive.addEventListener('click', () => {
         
    //     lancera les animation css
          btnresponsive.classList.toggle('active');
         nav.classList.toggle('nav-active');
     });    
    });
    
    navburger();