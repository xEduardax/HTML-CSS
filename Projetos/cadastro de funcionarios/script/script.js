'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

//CRUD -- funções das funcionalidades de cadastrar, editar, deletar, visualizar
//função que envia os dados para o localStorage

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //verifica se o banco de dados está vazio, se estiver, ele cria um array vazio.
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient)) //set envia os dados, db está criando um banco de dados para o client

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()


//Create 
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const isValidFields = () => { //ele vai verificar se ele preencheu todos os campos
    return document.getElementById('form').reportValidity()
}

const clearFields = () => { //cada vez que cadastrar um novo cliente ele apaga os campos do cadastrado anterior
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}

//Interação com o layout
const saveClient = () => {
    if (isValidFields()) { //só vai entrar aqui se verificou os campos da função IsValidFields
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
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

const createRow = (client, index) => { // cria uma nova linha vazia, preenche os td e dps insere no tbody
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id='edit-${index}'>editar</button> 
            <button type="button" class="button red" id='delete-${index}'>excluir</button>
        </td>
        `
    document.querySelector('#tableClient>tbody').appendChild(newRow)

}
const clearTable = () => { //limpa as linhas para não ficar duplicando os elementos cada vez que atualizar a tabela
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => { //forEach vai ler os dados do banco de dados e criar uma linha na tabela com os dados
    const dbClient = readClient()
    clearTable() //se não vai ficar duplicando os dados na tabela
    dbClient.forEach(createRow)
}

const fillFields = (cliente) => { //quando clicar para editar tem que aparecer os dados do cliente para poder editar
    document.getElementById('nome').value = cliente.nome
    document.getElementById('email').value = cliente.email
    document.getElementById('celular').value = cliente.celular
    document.getElementById('cidade').value = cliente.cidade
    document.getElementById('nome').dataset.index = cliente.index
}

const editClient = (index) => { //quando clicar para editar tem que aparecer os dados do cliente para poder editar
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')  //cria um array em que o primeiro elemento é a ação do botao e a segunda o indice, ou seja de quem é a ação. 

        if (action == 'edit') {
            editClient(index)
        }else {
            const client = readClient() [index]
            const response = confirm(`deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            } 
        }
    }
}

updateTable() 

//Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody').addEventListener("click", editDelete)