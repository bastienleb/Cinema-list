var key = "49b2f53f93119ab30420217aaed3afe7" 
var page = 1
var pageMax = 1
var trie = "popular"
var genre = ""
var affi_genre = []
var search = ""
var mode = ""
var directeur = ""
var acteur =new Array(4)
var img1 = ""
var img2 = ""
var img3 = ""
var img4 = ""
var tableau = Array()
var mode_affichage = "movie"

function getByGenre(val){
    document.getElementById("search").value = "";
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.themoviedb.org/3/genre/"+mode_affichage+"/list?api_key="+key+"&language=fr");
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            
            if(val == "vide"){
                genre = ""
                affi_page()
                let all = document.getElementsByTagName("affichage")
                all[0].innerHTML = "";
                getIDMovie() 
            }
            else{
                for(let i=0 ;i< result.genres.length;i++){
                    
                    if(result.genres[i].name == val){
                        genre = result.genres[i].id
                        affi_page()
                        let all = document.getElementsByTagName("affichage")
                        all[0].innerHTML = "";
                        getIDMovie() 
                    }        
                }
            }
        }
    }
    xhttp.send();
}

function getIDMovieSearch(){
    document.getElementById("loader").style.display = "none"

    const xhttp = new XMLHttpRequest();
    
    xhttp.open("GET", "https://api.themoviedb.org/3/search/movie?api_key="+key+"&language=fr&query="+search+"&page="+page);
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            
            pageMax = result.total_pages
                                
            for (let index = 0; index != result.results.length; index++) {
                let element = result.results[index];
                let image = ""
                getDirector(element.id)
                getGenreTxt(element.genre_ids)

                if(element.poster_path == null){
                    image = "image/Image_non_disponible.png"
                }
                else{
                    image = "https://image.tmdb.org/t/p/w300" + element.poster_path
                }
                riot.mount('affichage',{
                    titre: element.title ,
                    image: image ,
                    vote: element.vote_average ,
                    genre : tableau,
                    id : element.id
                });
            }   
        }       
    }
    xhttp.send();  
}

function getIDMovie(){

    document.getElementById("loader").style.display = "none"

    const xhttp = new XMLHttpRequest();
    
    xhttp.open("GET", "https://api.themoviedb.org/3/"+mode_affichage+"/"+trie+"?api_key="+key+"&language=fr&page="+page+"&with_genres="+genre);
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            pageMax = result.total_pages
                                
            for (let index = 0; index != result.results.length; index++) {
                let element = result.results[index];
                let image = ""
                getDirector(element.id)
                getGenreTxt(element.genre_ids)
                

                if(element.poster_path == null){
                    image = "image/Image_non_disponible.png"
                }
                else{
                    image = "https://image.tmdb.org/t/p/w300" + element.poster_path
                }

                if(mode_affichage == "movie"){
                    title =  element.title
                }
                else if(mode_affichage == "tv"){
                    title =  element.name
                }
                
                riot.mount('affichage',{
                    titre: title ,
                    image: image ,
                    vote: element.vote_average ,
                    genre : tableau,
                    id : element.id
                });
            }   
        }       
    }
    xhttp.send();  
}

function affi_page_search(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.themoviedb.org/3/search/"+mode_affichage+"?api_key="+key+"&language=fr&query="+search);
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
          
            let all = document.getElementsByTagName("page")
			all[0].innerHTML = "";

            riot.mount('page',{
                debut: page,
                fin: result.total_pages
            }); 
        }       
    }
    xhttp.send();  
}


function affi_page(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.themoviedb.org/3/"+mode_affichage+"/"+trie+"?api_key="+key+"&language=fr&with_genres="+genre);
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
          
            let all = document.getElementsByTagName("page")
			all[0].innerHTML = "";

            riot.mount('page',{
                debut: page,
                fin: result.total_pages
            }); 
        }       
    }
    xhttp.send();  
}

function up_page(){
    page ++;
    if(page	!= pageMax){

        let all = document.getElementsByTagName("affichage")
        all[0].innerHTML = "";

        if(mode == 1){
            affi_page()
            getIDMovie()
        }
        else if(mode == 2){
            affi_page_search()
            getIDMovieSearch()
        }
    }
}

function down_page(){
    if(page!=1){
        page --;
        
        let all = document.getElementsByTagName("affichage")
        all[0].innerHTML = "";

        if(mode == 1){
            affi_page()
            getIDMovie()
        }
        else if(mode == 2){
            affi_page_search()
            getIDMovieSearch()
        }
    }
}

function transition(id){
    document.getElementById("loader").style.display="block"
    let all = document.getElementsByTagName("affichage")
    all[0].remove()
    let allbtn = document.getElementsByTagName("alltrie")
    allbtn[0].remove()
    let allpage = document.getElementsByTagName("page")
    allpage[0].remove()
    
    setTimeout(function(){ document.getElementById("loader").style.display="none"},250);
    getActeur(id)
    getPage2(id)

}

function getPage2(id){
    
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.themoviedb.org/3/"+mode_affichage+"/"+id+"?api_key="+key+"&language=fr");
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            console.log(result)
            genre = []
            let i = 0
            let title =""
            
            result.genres.forEach(element => {
                genre[i]= element.name
                i++
            });

            if(result.backdrop_path == null){
                image = "image/Image_non_disponible.png"
            }
            else{
                image = "https://image.tmdb.org/t/p/w500" + result.poster_path
            }

            if(result.production_countries[0] === undefined){
                pays = 'pas indiquer'
            }
            else{
                pays = result.production_countries[0].iso_3166_1
            }

            if(mode_affichage == "movie"){
                title =  result.title
            }
            else if(mode_affichage == "tv"){
                title =  result.name
            }
            
            riot.mount('information',{
                titre: title,
                image: image,
                genre: genre,
                date: result.release_date,
                pays: pays,
                directeur : directeur,
                acteur: acteur,
                img1: img1,
                img2: img2,
                img3: img3,
                img4: img4,
                description: result.overview,
                vote: result.vote_average,
                avis: result.vote_count,
            }); 
        } 
    }
    xhttp.send();
}

	
function getDirector(id){

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", " https://api.themoviedb.org/3/"+mode_affichage+"/"+ id+"/credits?api_key="+key+"&language=fr");
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            
            for (let index = 0; index < result.crew.length; index++) {
                const element = result.crew[index];
                if(element.job == "Director"){
                    directeur = element.name
                }
            }
        } 
    }
    xhttp.send();
}

function getActeur(id){
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", " https://api.themoviedb.org/3/"+mode_affichage+"/"+ id+"/credits?api_key="+key+"&language=fr");
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText)
            
            let tmp = 0
            let image = ""

            while(tmp != 4){
                acteur.push(result.cast[tmp].name)

                if(result.cast[tmp].profile_path == null){
                    image = "image/Image_non_disponible_acteur.png"
                }
                else{
                    image = "https://image.tmdb.org/t/p/w200" + result.cast[tmp].profile_path
                }
                
                if(tmp == 0){
                    img1 = image
                }
                else if(tmp == 1){
                    img2 = image
                }
                else if(tmp == 2){
                    img3 = image
                }
                else if(tmp == 3){
                    img4 = image
                }
                tmp ++
            }    

            acteur = acteur.filter( function(val){return val !== ''} );
        } 
    }
    xhttp.send();
}

function convert_id_to_genre (id, table_convert){
    var j =-1
    var id_genre
    
    while(id != id_genre){
        j++
        id_genre= table_convert[j]["id"]   
    }
}

function getGenreTxt(id){

    var tab=id.toString().split(",")
    
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.themoviedb.org/3/genre/"+mode_affichage+"/list?api_key="+key+"&language=fr",false);
    request.send(null);
   
    tableau.splice(0, tableau.length);
    var responsegenre = request.responseText
    var obj = JSON.parse(responsegenre);
    for(let i = 0; i < obj.genres.length; i ++){
        for (let index = 0; index < tab.length; index++) {
            if(tab[index]==obj.genres[i].id)
                tableau.push(obj.genres[i].name)
        }
    }
}

function change_vision(valeur){
    mode_affichage = valeur
    let all = document.getElementsByTagName("affichage")
    all[0].innerHTML = ""
    getIDMovie()
}