let first = 'RUB'
let second = 'USD'
let defaultAmount = 5000

let valyuta1 = document.querySelector('.valyuta1')
let valyuta2 = document.querySelector('.valyuta2')

let inputbox1 = document.querySelector('.inputbox1')
let inputbox2 = document.querySelector('.inputbox2')

valyuta1.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        valyuta1.querySelector('.active').classList.remove('active')
        btn.classList.add('active')
        first = btn.innerHTML
        converter().then(response => {
            inputbox2.value = response[second]
            document.querySelector('.input1 .input-wrapper .current-value').innerHTML = `1 ${first} = ${(response.rate).toFixed(5)} ${second}`
            document.querySelector('.input2 .input-wrapper .current-value').innerHTML = `1 ${second} = ${(1/response.rate).toFixed(5)} ${first}`
        })   
    })
})

valyuta2.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        valyuta2.querySelector('.active').classList.remove('active')
        btn.classList.add('active')
        second = btn.innerHTML

        converter().then(response => {
            inputbox2.value = response[second]
            document.querySelector('.input1 .input-wrapper .current-value').innerHTML = `1 ${first} = ${(response.rate).toFixed(5)} ${second}`
            document.querySelector('.input2 .input-wrapper .current-value').innerHTML = `1 ${second} = ${(1/response.rate).toFixed(5)} ${first}`
        })
    })
})

inputbox1.addEventListener('input', e => {

    let value = inputbox1.value;
    value = value.replace(/,/g, '.');
    value = value.replace(/[^0-9.]/g, ''); 
    const parts = value.split('.'); 
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join(''); 
    }
    inputbox1.value = value.slice(0,15);




    defaultAmount = e.target.value
    first = valyuta1.querySelector('.active').innerHTML
    second = valyuta2.querySelector('.active').innerHTML
    converter().then(response => {
        inputbox2.value = response[second]
    })
})

inputbox2.addEventListener('input', e => {

    let value = inputbox2.value;
    value = value.replace(/,/g, '.');
    value = value.replace(/[^0-9.]/g, ''); 
    const parts = value.split('.'); 
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join(''); 
    }
    inputbox2.value = value.slice(0,15);

    defaultAmount = e.target.value
    first = valyuta2.querySelector('.active').innerHTML
    second = valyuta1.querySelector('.active').innerHTML
    converter().then(response => {
        console.log(response);      
        inputbox1.value = response[second]
    })
})

const converter = async () => {
    if (!defaultAmount || defaultAmount < 0) {
        clearInputs();
        return { from, to, result: '', rate: 0 };
    }

    const response = await fetch(`https://api.fastforex.io/convert?from=${first}&to=${second}&amount=${defaultAmount}&precision=5&api_key=16e9275506-810eaaec51-sncoi4`).catch(error =>
    document.querySelector("#result").innerText = "No internet connection"

    )
    const data = await response.json();
    return data.result
};



inputbox1.value = defaultAmount
converter().then(r => {  
    inputbox2.value = r[second]
    document.querySelector('.input1 .input-wrapper .current-value').innerHTML = `1 ${first} = ${(r.rate).toFixed(5)} ${second}`
                document.querySelector('.input2 .input-wrapper .current-value').innerHTML = `1 ${second} = ${(1/r.rate).toFixed(5)} ${first}`
});



const item1 = document.querySelector(".item1-mobile");
const close = document.querySelector("#close-btn");
// const items = document.querySelectorAll(".item"); 

item1.addEventListener('click', ()=> {
    document.querySelector('.menu-items').classList.toggle('hidden')
})
close.addEventListener('click', ()=> {
    document.querySelector('.menu-items').classList.toggle('hidden')
})

window.addEventListener('resize', ()=> {
    if(window.innerWidth > 992) {
        document.querySelector('.menu-items').classList.add('hidden')
    }
})