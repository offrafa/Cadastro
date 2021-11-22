let clientCompara;

const openModal = () => document.getElementById('modal')
    .classList.add('active')
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient)) 

// verificando os compos do formulario email ou telefone são diferente dos dados salvos no localStorage
const verificaOsCampoDoFormularioAoEditar = (camposDoFormulario) =>{
    const amarzenamento = JSON.parse(localStorage.getItem('db_client'))
        
    let verificaOsCampos = false
        

    // percorrendo os dados salvo no LocaStorage 
    for (pegarAmarzenamnto of amarzenamento) {
        // verificando de email formulario é igual aos savo no localStorage

        if (pegarAmarzenamnto.email === camposDoFormulario.email &&  (pegarAmarzenamnto.nome === camposDoFormulario.nome && pegarAmarzenamnto.cidade === camposDoFormulario.cidade)) {
            verificaOsCampos = true
        }
        
         // verificando se o celular do formulario é igual no localStorage
        if (pegarAmarzenamnto.celular === camposDoFormulario.celular && (pegarAmarzenamnto.nome === camposDoFormulario.nome && pegarAmarzenamnto.cidade === camposDoFormulario.cidade)){
            verificaOsCampos = true
           
        }
         // verificando se o email ou celular é igual os que está salvo no localStorage
        if (verificaOsCampos === true){
          return true
        }
    }
   

    // retornando que não foi encontrado o telefone ou email igual do localStorage
    return false
        
}


  

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}
const updateClient = (index, client) => {
    if (verificaOsCampoDoFormularioAoEditar(client)){
        console.log('entrou no if de verificaçao ao salvar os dados qunado está editando')
        Swal.fire('E-mail ou Celular já cadastrado no sistema')
        return 
    }

    

    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
    console.log(' NÃO ENTROU NO IF E SALVOU NO BANCO DE DADOS')

}
const readClient = () => getLocalStorage()
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
//Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}   
    // verificando se os campos digitados no input são iguais salvo no banco de dados 
    const verificaCamposDoClient =(client) => {
        const verificaoDeCampos = {
            nome: false,
            email: false,
            celular: false,
            cidade: false
        }
        if (client.nome === clientCompara.nome) {
            verificaoDeCampos.nome = true
            console.log(verificaoDeCampos.nome)
        }
        if (client.email === clientCompara.email){
            verificaoDeCampos.email = true
            console.log(verificaoDeCampos.email)
        }
        if (client.celular === clientCompara.celular){
            verificaoDeCampos.celular = true
            console.log(verificaoDeCampos.celular)
        }
        if (client.cidade === clientCompara.cidade){
            verificaoDeCampos.cidade = true
            console.log(verificaoDeCampos.cidade)
        }
        // verificando se a comparação dos campos foi modificado 
        if (verificaoDeCampos.nome === true && verificaoDeCampos.email && verificaoDeCampos.celular && verificaoDeCampos.cidade) {
            return false
        }
        
        return true
          
    }

    
     

const saveClient = () => {
   // debugger
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        if (verificaCamposDoClient(client) == false){
            Swal.fire(
                'ALERTA',
                'nenhum campo foi modificado',
                'warning'
        )
           // alert("nenhum campo foi modificado")
            return            
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
            
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
            

        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
  //debugger
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
    //console.log(nome)
}


  // editar 
const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
   clientCompara = client
    
}
    
 
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');
        if (action === 'edit') {
            editClient(index);
        } else {
            const client = readClient()[index]
            Swal.fire({
                title: 'ATENÇÃO!',
                text: "Deseja Realmente Excluir o Cliente " +` ${client.nome}`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Excluir'
              }).then((result) => {
                if (result.isConfirmed) {
                    deleteClient(index);
                    updateTable()
             } 
             })
         }
      }
    }

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

const $html = document.querySelector('html');
const $checkbox = document.querySelector('#switch');
$checkbox.addEventListener('change', function(){
    $html.classList.toggle('modo-escuro')
})

