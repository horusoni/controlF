let check = document.getElementById('check')
let burguerCont = document.querySelector('.burguerCont')
let navBar = document.querySelector('.navBar')
let bar1 = document.querySelector('.bar1')
let bar2 = document.querySelector('.bar2')
let bar3 = document.querySelector('.bar3')

document.addEventListener('click',(e)=>{
    if(e.target.id ==="burguerFull"){
        if(!check.checked){
            openMenu()
        }else{
            closeMenu()
        }
    }
})


function openMenu(){
    burguerCont.classList.add('burguerAfter')
    bar1.classList.add('bar1After')
    bar2.classList.add('bar2After')
    bar3.classList.add('bar3After')
    navBar.classList.add('navBarAfter')
}

function closeMenu(){
    burguerCont.classList.remove('burguerAfter')
    bar1.classList.remove('bar1After')
    bar2.classList.remove('bar2After')
    bar3.classList.remove('bar3After')
    navBar.classList.remove('navBarAfter')
}