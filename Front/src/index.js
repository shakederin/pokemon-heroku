import "./index.css"
//API resorces
const dataApi = " https://pokeapi.co/api/v2/pokemon/";
const dataApiType = " https://pokeapi.co/api/v2/type/"; 
const myAPI = "http://localhost:8080"

// variables
const inputValue = document.getElementById("input");
const searchButton = document.getElementById("button");
const pokimonImg = document.getElementById("pokimonImg"); 
const singInBox = document.getElementById("singIn");
const usernameInput = document.getElementById("usernameInput");
const singInBtn = document.getElementById("bttn");
const topRightName = document.getElementById("curtain");
const pokimonList = document.getElementById("ownPokimon");
const releaseBtn = document.getElementById("releaseBtn");
const catchBtn = document.getElementById("catchBtn");
let pokimonData;
let pokimondataType;
let userName;
let lastId = inputValue.value;
let pushs = ""


//create Dom
getPokimonInfoByInput(1)

//EventListeners
catchBtn.addEventListener("click", async function(){
    try{
        await axios.put(`${myAPI}/pokemon/catch/${lastId}`,{}, {
            headers: {
                'username': userName
            }
        })
        const pokimonArray = await axios.get(`${myAPI}/pokemon/`, {
            headers: {
                'username': userName
            }  
        })
        pokimonList.innerText = "";
        pushs = "";
        for(let num of pokimonArray.data){
            pushs += await getNameById(num);
            pushs += " ";
        }
        pokimonList.innerText = pushs
    }catch(err){
        reply("Pokenom already caught...");         
    }
})

releaseBtn.addEventListener("click", async function(){
    try{
        await axios.delete(`${myAPI}/pokemon/release/${lastId}`, {
            headers: {
                'username': userName
            }  
        })
        const pokimonArray = await axios.get(`${myAPI}/pokemon/`, {
            headers: {
                'username': userName
            }  
        })
        pokimonList.innerText = "";
        pushs = "";
        for(let num of pokimonArray.data){
            pushs += await getNameById(num);
            pushs += " ";
        }
        pokimonList.innerText = pushs
    } catch(err){
        reply("You dont own it...");           
    }    
})

singInBtn.addEventListener("click", async function(event){
    if(!usernameInput.value){
        return
    }
    userName = usernameInput.value;
    singInBox.style.display = 'none';
    topRightName.innerHTML = userName;
    const pokimonArray = await axios.get(`${myAPI}/pokemon/`, {
        headers: {
          'username': userName
        }  
    })
    pokimonList.innerText = "";
    pushs = "";
    for(let num of pokimonArray.data){
        pushs += await getNameById(num);
        pushs += " ";
    }
    pokimonList.innerText = pushs
})

inputValue.addEventListener("keyup",function(event){
    if (event.keyCode === 13) {
        if(inputValue.value === "") {                                           // make sure that the input aint empty
            alert("Please Enter an ID or a name ");
            return;
        }
        useInput()
        inputValue.value = "";
        };
})

searchButton.addEventListener("click", function(){
    if(inputValue.value === "") {                                           // make sure that the input aint empty
        alert("Please Enter an ID or a name ");
        return;
    }
    useInput()
    inputValue.value = "";
});

pokimonImg.addEventListener("mouseover", function(){
    changeToBackImg(lastId);
})

pokimonImg.addEventListener("mouseleave", function(){
    addFrontImg(lastId);
})

//Functions
function reply(string){
    document.getElementById("errorMsg").innerText = string;
    setTimeout(function(){ document.getElementById("errorMsg").innerText=""; }, 2500);
    return;
}

async function getNameById(num){
    try {
        pokimonData = await axios.get(myAPI +"/pokemon/get/" + num ,{
            headers: {
              'username': userName
            }
        });
        return pokimonData.data.name
    } catch (error) {
        console.log(error);
    }
}

function useInput(){
    getPokimonInfoByInput(inputValue.value);
    
}

async function getPokimonInfoByInput(input){
        try {
                if(!isNaN(input)){
                    pokimonData = await axios.get(myAPI +"/pokemon/get/" + input ,{
                        headers: {
                          'username': userName
                        }
                    });
                }
                else {
                    pokimonData = await axios.get(myAPI + "/pokemon/query/", {headers: {
                        'username': userName
                      }, params: { query: input } } );
                }
                lastId = input;
                addName();
                addHeight();
                addWeight();
                addTypes();
                addFrontImg();
        } catch (error) {  
            console.log(error);
                document.getElementById("errorMsg").innerText = "Pokenom not found...";
                setTimeout(function(){ document.getElementById("errorMsg").innerText=""; }, 2500);
                return;
        }
}

function getUrlFrontImg(pokimondata){
   return pokimondata.data.sprites.front_default;
}

function getUrlBackImg(pokimondata){
    return pokimondata.data.sprites.back_default;
 }

function addName(num){
    document.getElementById("name").innerText = "Name: " + pokimonData.data.name.toUpperCase();
}

function addHeight(num){
    document.getElementById("height").innerText = "Height: " +  pokimonData.data.height*10 +"cm";
}

function addWeight(num){
    document.getElementById("weight").innerText = "Weight: " + pokimonData.data.weight + "kg";
}

function addTypes(num){
    const types = document.getElementById("types");
    let stingOfTypes = "Types: "
    for(let i = 0 ; i < pokimonData.data.types.length; i++){
        let typeTest = pokimonData.data.types[i];
        stingOfTypes += `<div class="types" id= "type${i}" style="cursor: pointer" onclick="getTypeList('${typeTest}')" >${typeTest}</div>`;
    }
    types.innerHTML = stingOfTypes; 
}

function addFrontImg(num){
    document.getElementById("pokimonImg").src = pokimonData.data.front_pic ;
}

function changeToBackImg(num){
    document.getElementById("pokimonImg").src = pokimonData.data.back_pic ;
}
// onmouseover="changePokimonData('${pokimondataType.data.pokemon[i*10+j].pokemon.name}')"          copy and add after line 114
async function getTypeList(type){
    try {
        pokimondataType = await axios.get(dataApiType + type + "/");
        let typesTable = ``;
        for(let i = 0; i < Math.floor(pokimondataType.data.pokemon.length/10) + 1; i++ ){
            typesTable += `<tr>`
            for(let j = 0; j < 10; j++ ){
                if(i*10+j<pokimondataType.data.pokemon.length){
                    typesTable += `<td style="cursor: pointer";
                    onclick="changePokimonData('${pokimondataType.data.pokemon[i*10+j].pokemon.name}')">
                    ${pokimondataType.data.pokemon[i*10+j].pokemon.name}</td>`
                }
            }
            typesTable +=`</tr>`
        }
        document.getElementById("typeTable").innerHTML = typesTable;
    } catch (error) {
        k = 1;
        console.log(error);
        alert ("Type not found...");
        return;
    }
}

async function changePokimonData(name){
    lastId = name;
   await getPokimonInfoByInput(name);
} 




