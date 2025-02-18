const apiBaseUrl = 'https://localhost:44351';



//Eliminar leitores inativos:
// Função para criar a interface dinamicamente
function criarInterfaceEliminarLeitores() {
    const mainContent = document.getElementById('main-content-eliminar-leitores-inativos');
    
    // Limpa o conteúdo existente
    mainContent.innerHTML = '';
    
    // Cria a estrutura da interface
    const container = document.createElement('div');
    container.className = 'form-container';
    
    const titulo = document.createElement('h1');
    titulo.textContent = 'Eliminar Leitores Inativos';
    
    const alerta = document.createElement('div');
    alerta.className = 'alert-info';
    alerta.innerHTML = `
        <p>Serão eliminados automaticamente os leitores que:</p>
        <ul>
            <li>Não fizeram requisições nos últimos 12 meses</li>
            <li>Não têm requisições ativas ou pendentes</li>
        </ul>
    `;
    
    const botao = document.createElement('button');
    botao.id = 'btnEliminarLeitores';
    botao.className = 'btn-danger';
    botao.textContent = 'Verificar e Eliminar Leitores Inativos';
    
    const resultadoContainer = document.createElement('div');
    resultadoContainer.id = 'resultado-eliminacao';
    resultadoContainer.style.marginTop = '20px';
    
    const tabela = document.createElement('table');
    tabela.id = 'tabela-leitores-eliminados';
    tabela.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    // Monta a estrutura
    resultadoContainer.appendChild(tabela);
    container.append(titulo, alerta, botao, resultadoContainer);
    mainContent.appendChild(container);
    
    // Adiciona o event listener dinamicamente
    botao.addEventListener('click', async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/Admin_EliminarLeitoresInativos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.detail || 'Erro na operação');
            
            const tbody = tabela.querySelector('tbody');
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3">Nenhum leitor foi eliminado</td></tr>';
                return;
            }
            
            data.forEach(leitor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${leitor.userID}</td>
                    <td>${leitor.nome}</td>
                    <td>${leitor.email}</td>
                `;
                tbody.appendChild(row);
            });
            
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    });
}

// Event listener para o menu
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('carregarEliminarLeitoresInativos').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('[id^="main-content"]').forEach(el => el.style.display = 'none');
        document.getElementById('main-content-eliminar-leitores-inativos').style.display = 'block';
        
        // Cria a interface dinamicamente quando a seção é acessada
        if (!document.getElementById('tabela-leitores-eliminados')) {
            criarInterfaceEliminarLeitores();
        }
    });
});







document.getElementById('carregarObras').addEventListener('click', async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/MostrarTodasObras`);
        if (!response.ok) throw new Error('Erro ao carregar as obras');
        const obras = await response.json();
        mostrarobrasmenu()

        const listaObras = document.getElementById('main-content');
        listaObras.innerHTML = '<div class="obra2"><h1>Obras Disponíveis</h1></br></br><p>Consulte, altere ou remova as suas obras.</div>';

        obras.forEach(obra => {
            const obraDiv = document.createElement('div');
            obraDiv.className = 'obra';

            // Título
            const titulo = document.createElement('h2');
            titulo.textContent = obra.titulo;
            obraDiv.appendChild(titulo);

            // Autor
            const autor = document.createElement('p');
            autor.textContent = `Autor: ${obra.autor}`;
            obraDiv.appendChild(autor);

            // Ano de Publicação
            const anoPublicacao = document.createElement('p');
            anoPublicacao.textContent = `Ano: ${obra.anoPublicacao || 'N/A'}`;
            obraDiv.appendChild(anoPublicacao);

            // Gênero
            const genero = document.createElement('p');
            genero.textContent = `Gênero: ${obra.genero}`;
            obraDiv.appendChild(genero);

            // Gênero
            const desc = document.createElement('p');
            desc.textContent = `${obra.descricao}`;
            obraDiv.appendChild(desc);

            // Imagem da capa
            if (obra.imagemBase64) {
                const imagem = document.createElement('img');
                imagem.src = `data:image/jpeg;base64,${obra.imagemBase64}`;
                obraDiv.appendChild(imagem);
            }

            // Botões
            const botoesDiv = document.createElement('div');
            botoesDiv.className = 'botoesDiv';

            // Botão Editar
            const botaoEditar = document.createElement('button');
            botaoEditar.textContent = 'Editar';
            botaoEditar.className = 'editar';
            botaoEditar.onclick = () => mostrarFormularioEditar(obra);
            botoesDiv.appendChild(botaoEditar);

            // Botão Remover
            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = 'Remover';
            botaoRemover.className = 'remover';
            botaoRemover.onclick = () => {
                console.log('ID da obra:', obra.obraID); // Verifique se o ID está definido
                if (obra.obraID) {
                    removerObra(obra.obraID); // Passa o ID da obra para a função removerObra
                } else {
                    alert('Erro: ID da obra não está definido.');
                }
            };
            botoesDiv.appendChild(botaoRemover);

            obraDiv.appendChild(botoesDiv);
            listaObras.appendChild(obraDiv);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar as obras');
    }
});

// Função para remover uma obra
async function removerObra(obraID) {
    try {
        // Envia o obraID como parâmetro de query string na URL
        const response = await fetch(`${apiBaseUrl}/ApagarObra?obraID=${obraID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            const errorData = await response.json(); // Lê o corpo da resposta como JSON
            throw new Error(errorData.error || 'Erro ao remover a obra');
        }
        // Recarrega a lista de obras
        carregarObras();
    } catch (error) {
        console.error('Erro ao remover a obra:', error);
    }
}


async function mostrarFormularioEditar(obra) {
    try {
        const modal = document.getElementById('modalEditar');
        const response = await fetch(`${apiBaseUrl}/ObterDadosObra?obraID=${obra.obraID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) throw new Error('Erro ao obter dados da obra');
        const obraData = await response.json();

        // Preencher os campos do formulário
        document.getElementById('obraID').value = obraData.obraID;
        document.getElementById('editarTitulo').value = obraData.titulo;
        document.getElementById('editarAutor').value = obraData.autor;
        document.getElementById('editarAno').value = obraData.anoPublicacao || '';
        document.getElementById('editarGenero').value = obraData.genero;
        document.getElementById('editarDescricao').value = obraData.descricao;

        // Mostrar imagem atual se existir
        const previewImagem = document.getElementById('previewImagem');
        if (obraData.imagemBase64) {
            previewImagem.style.display = 'block';
            previewImagem.src = `data:image/jpeg;base64,${obraData.imagemBase64}`;
        } else {
            previewImagem.style.display = 'none';
        }

        modal.style.display = 'block';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados para edição');
    }
}

// Fechar modal ao clicar no × ou fora
document.querySelector('.fechar').onclick = fecharModal;
window.onclick = function(event) {
    const modal = document.getElementById('modalEditar');
    if (event.target === modal) {
        fecharModal();
    }
}

function fecharModal() {
    document.getElementById('modalEditar').style.display = 'none';
}

// Submeter formulário
document.getElementById('formEditarObra').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const obraID = document.getElementById('obraID').value;
        const imagemInput = document.getElementById('editarImagem');
        let imagemBase64 = '';

        // Converter nova imagem para Base64 se for carregada
        if (imagemInput.files[0]) {
            imagemBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result.split(',')[1]);
                reader.readAsDataURL(imagemInput.files[0]);
            });
        } else {
            // Manter imagem existente se não for carregada nova
            const previewImagem = document.getElementById('previewImagem');
            if (previewImagem.src.startsWith('data:')) {
                imagemBase64 = previewImagem.src.split(',')[1];
            }
        }

        const obraDto = {
            obraID: parseInt(obraID),
            titulo: document.getElementById('editarTitulo').value,
            autor: document.getElementById('editarAutor').value,
            anoPublicacao: document.getElementById('editarAno').value || null,
            genero: document.getElementById('editarGenero').value,
            descricao: document.getElementById('editarDescricao').value,
            imagemBase64: imagemBase64
        };

        const response = await fetch(`${apiBaseUrl}/AtualizarObra`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obraDto)
        });

        if (!response.ok) throw new Error('Erro ao atualizar obra');
        
        fecharModal();
        carregarObras();
        alert('Obra atualizada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
});


// Função para recarregar a lista de obras
function carregarObras() {
    document.getElementById('carregarObras').click(); // Simula o clique no botão "Mostrar Obras"
}




// Função para mostrar o formulário
function mostrarFormularioAdicionar() {
    document.querySelectorAll('[id^="main-content"]').forEach(el => el.style.display = 'none');
    document.getElementById('main-content-relatorio-top10').style.display = 'none';
    document.getElementById('main-content-transferirexemplares').style.display = 'none';
    document.getElementById('main-content-adicionarobra').style.display = 'block';
    document.getElementById('main-content-relatorio-requisicoes-nucleos').style.display = 'none';
    document.getElementById('main-content-adicionar-exemplares').style.display = 'none';
    document.getElementById('main-content-eliminar-leitores-inativos').style.display = 'none';
}

function mostrarobrasmenu() {
    document.querySelectorAll('[id^="main-content"]').forEach(el => el.style.display = 'grid');
    document.getElementById('main-content-relatorio-top10').style.display = 'none';
    document.getElementById('main-content-adicionarobra').style.display = 'none';
    document.getElementById('main-content-transferirexemplares').style.display = 'none';
    document.getElementById('main-content-relatorio-requisicoes-nucleos').style.display = 'none';
    document.getElementById('main-content-adicionar-exemplares').style.display = 'none';
    document.getElementById('main-content-eliminar-leitores-inativos').style.display = 'none';
}






//Adicionar obra
// Event listener para o formulário
document.getElementById('formAdicionarObra').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os dados do formulário
    const formData = {
        Titulo: document.getElementById('titulo').value,
        Autor: document.getElementById('autor').value,
        AnoPublicacao: parseInt(document.getElementById('anoPublicacao').value),
        Genero: document.getElementById('genero').value,
        Descricao: document.getElementById('descricao').value,
        ImagemBase64: null // Inicialmente nulo
    };

    // Processa a imagem, se existir
    const fileInput = document.getElementById('imagem');
    const file = fileInput.files[0];

    if (file) {
        // Converte a imagem para Base64
        const reader = new FileReader();
        reader.onload = function (e) {
            formData.ImagemBase64 = e.target.result; // Atribui o Base64 ao objeto

            // Envia os dados para o servidor
            enviarDados(formData);
        };
        reader.readAsDataURL(file); // Converte o arquivo para Base64
    } else {
        // Envia os dados sem imagem
        enviarDados(formData);
    }
});

// Função para enviar os dados para o servidor
async function enviarDados(formData) {
    try {
        const response = await fetch('https://localhost:44351/AdicionarObra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
            },
            body: JSON.stringify(formData) // Converte o objeto para JSON
        });

        if (!response.ok) throw new Error('Erro ao adicionar obra');

        alert('Obra adicionada com sucesso!');
        cancelarEdicao(); // Limpa o formulário e oculta a seção
        document.getElementById('carregarObras').click(); // Recarrega a lista de obras
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar obra: ' + error.message);
    }
}

// Função para cancelar e limpar o formulário
function cancelarEdicao() {
    document.getElementById('formAdicionarObra').reset();
    document.getElementById('main-content-adicionarobra').style.display = 'none';
}








// Função para carregar as obras e núcleos
async function carregarDadosTransferencia() {
    try {
        // 1. Carregar obras disponíveis
        const responseObras = await fetch(`${apiBaseUrl}/ObterObras`);
        if (!responseObras.ok) throw new Error('Erro ao carregar obras');
        const obras = await responseObras.json();

        // 2. Carregar núcleos disponíveis
        const responseNucleos = await fetch(`${apiBaseUrl}/ObterNucleos`);
        if (!responseNucleos.ok) throw new Error('Erro ao carregar núcleos');
        const nucleos = await responseNucleos.json();

        // 3. Carregar exemplares por núcleo
        const responseExemplares = await fetch(`${apiBaseUrl}/ObterExemplaresPorNucleo`);
        if (!responseExemplares.ok) throw new Error('Erro ao carregar exemplares');
        const exemplares = await responseExemplares.json();

        // Preencher dropdown de obras
        const selectObra = document.getElementById('obra');
        selectObra.innerHTML = '<option value="">Selecione uma obra</option>';
        obras.forEach(obra => {
            const option = document.createElement('option');
            option.value = obra.obraID;
            option.textContent = obra.titulo;
            selectObra.appendChild(option);
        });

        // Preencher dropdowns de núcleos
        const preencherNucleos = (selectElement) => {
            selectElement.innerHTML = '<option value="">Selecione um núcleo</option>';
            nucleos.forEach(nucleo => {
                const option = document.createElement('option');
                option.value = nucleo.nucleoID;
                option.textContent = nucleo.nome;
                selectElement.appendChild(option);
            });
        };

        preencherNucleos(document.getElementById('origemNucleo'));
        preencherNucleos(document.getElementById('destinoNucleo'));

        // Preencher tabela de exemplares
        const tbody = document.querySelector('#tabelaObras tbody');
        tbody.innerHTML = '';
        exemplares.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.titulo}</td>
                <td>${item.nomeNucleo}</td>
                <td>${item.quantidade}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}

// Event listener para o formulário de transferência
document.getElementById('formTransferirExemplares').addEventListener('submit', async (e) => {
    e.preventDefault();

    const obraId = document.getElementById('obra').value;
    const origemNucleoId = document.getElementById('origemNucleo').value;
    const destinoNucleoId = document.getElementById('destinoNucleo').value;
    const quantidade = document.getElementById('quantidade').value;

    if (!obraId || !origemNucleoId || !destinoNucleoId || !quantidade) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    try {
        const url = `${apiBaseUrl}/Admin_TransferirExemplar?` + 
                    `obraId=${encodeURIComponent(obraId)}&` +
                    `origemNucleoId=${encodeURIComponent(origemNucleoId)}&` +
                    `destinoNucleoId=${encodeURIComponent(destinoNucleoId)}&` +
                    `qtdTransferir=${encodeURIComponent(quantidade)}`;

        console.log("Enviando requisição para:", url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': '*/*'
            },
        });
        
        
// Verificar se a resposta é válida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Ler a resposta como JSON
        const result = await response.json();

        console.log('Resposta do servidor:', result); // Log da resposta

        if (!result.sucesso) {
            throw new Error(result.mensagem || 'Erro na transferência');
        }

        // Exibir mensagem de sucesso
        alert(result.mensagem);

        // Atualizar dados após transferência
        await carregarDadosTransferencia();

        // Resetar formulário
        document.getElementById('formTransferirExemplares').reset();

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message); // Exibir mensagem de erro
    }
});

// Função para cancelar transferência
function cancelarTransferencia() {
    document.getElementById('formTransferirExemplares').reset();
    document.getElementById('main-content-transferirexemplares').style.display = 'none';
}

// Event listener para o menu de transferência
document.getElementById('carregarTransferirExemplares').addEventListener('click', () => {
    // Esconder outros conteúdos
    document.querySelectorAll('[id^="main-content"]').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar seção de transferência
    const transferSection = document.getElementById('main-content-transferirexemplares');
    transferSection.style.display = 'block';
    
    // Carregar dados
    carregarDadosTransferencia();
});











//Adicionar Exemplares
// Função para carregar as obras no dropdown
async function carregarObrasParaAdicionarExemplares() {
    try {
        const response = await fetch(`${apiBaseUrl}/MostrarTodasObras`);
        if (!response.ok) throw new Error('Erro ao carregar as obras');
        const obras = await response.json();

        console.log('Dados recebidos:', obras); // Verifique os dados aqui

        const selectObra = document.getElementById('obra1');
        selectObra.innerHTML = '<option value="">Selecione uma obra</option>'; // Limpa o dropdown

        obras.forEach(obra => {
            const option = document.createElement('option');
            option.value = obra.obraID;
            option.textContent = obra.titulo;
            selectObra.appendChild(option);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar as obras');
    }
}

// Event listener para o formulário de adicionar exemplares
document.getElementById('formAdicionarExemplares').addEventListener('submit', async (e) => {
    e.preventDefault();

    const obraId = document.getElementById('obra1').value;
    const quantidade = document.getElementById('quantidade1').value;

    if (!obraId || !quantidade) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/AdicionarExemplaresAoNucleoPrincipal?obraID=${obraId}&qtdAdicionar=${quantidade}`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        alert('Exemplares adicionados com sucesso!');
        document.getElementById('formAdicionarExemplares').reset(); // Limpa o formulário
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
});

// Função para cancelar a adição de exemplares
function cancelarAdicaoExemplares() {
    document.getElementById('formAdicionarExemplares').reset();
}

// Função para mostrar a seção de adicionar exemplares
function mostrarAdicionarExemplares() {
    document.querySelectorAll('[id^="main-content"]').forEach(el => el.style.display = 'none');
    document.getElementById('main-content-adicionar-exemplares').style.display = 'block';
    carregarObrasParaAdicionarExemplares(); // Carrega as obras ao abrir a seção
}


















//Relatorio ultimas requisições
document.getElementById('carregarUltimasRequisicoes').addEventListener('click', async () => {
    try {
        // Esconde outros conteúdos e mostra o relatório
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('main-content-adicionarobra').style.display = 'none';
        document.getElementById('main-content-transferirexemplares').style.display = 'none';
        document.getElementById('main-content-relatorio-top10').style.display = 'none';
        document.getElementById('main-content-transferirexemplares').style.display = 'none';
        document.getElementById('main-content-eliminar-leitores-inativos').style.display = 'none';
        document.getElementById('main-content-relatorio-requisicoes-nucleos').style.display = 'block';

        // Faz a requisição ao endpoint
        const response = await fetch(`${apiBaseUrl}/Admin_ObterUltimaRequisicaoPorNucleo`);
        if (!response.ok) throw new Error('Erro ao carregar o relatório');

        const data = await response.json();
        console.log('Resposta do endpoint:', data); // Verifique a estrutura dos dados

        // Limpa o conteúdo anterior
        const relatorioDiv = document.getElementById('main-content-relatorio-requisicoes-nucleos');
        relatorioDiv.innerHTML = '<h1>Últimas Requisições por Núcleo</h1>';

        // Cria uma tabela para exibir os dados
        const tabela = document.createElement('table');
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Núcleo</th>
                    <th>Última Requisição</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        // Preenche a tabela com os dados
        const tbody = tabela.querySelector('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nomeNucleo}</td>
                <td>${item.ultimaRequisicao}</td>
            `;
            tbody.appendChild(row);
        });

        // Adiciona a tabela ao div
        relatorioDiv.appendChild(tabela);
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
});





//Relatorio top10 obras mais requisitadas ultimo ano
document.getElementById('carregarTop10Obras').addEventListener('click', async () => {
    try {
        // Esconde outros conteúdos e mostra o relatório
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('main-content-adicionarobra').style.display = 'none';
        document.getElementById('main-content-transferirexemplares').style.display = 'none';
        document.getElementById('main-content-relatorio-requisicoes-nucleos').style.display = 'none';
        document.getElementById('main-content-eliminar-leitores-inativos').style.display = 'none';
        document.getElementById('main-content-relatorio-top10').style.display = 'block';

        // Faz a requisição ao endpoint
        const response = await fetch(`${apiBaseUrl}/Admin_Top10ObrasRequisitadasUltimoAno`);
        if (!response.ok) throw new Error('Erro ao carregar o relatório');

        const data = await response.json();

        // Verifica se a requisição foi bem-sucedida
        if (!data.sucesso) {
            throw new Error(data.mensagem || 'Erro ao carregar o relatório');
        }

        // Limpa o conteúdo anterior
        const relatorioDiv = document.getElementById('main-content-relatorio-top10');
        relatorioDiv.innerHTML = '<h1>Top 10 Obras Mais Requisitadas no Último Ano</h1>';

        // Cria uma tabela para exibir os dados
        const tabela = document.createElement('table');
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Total de Requisições</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        // Preenche a tabela com os dados
        const tbody = tabela.querySelector('tbody');
        data.obras.forEach(obra => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${obra.titulo}</td>
                <td>${obra.totalRequisicoes}</td>
            `;
            tbody.appendChild(row);
        });

        // Adiciona a tabela ao div
        relatorioDiv.appendChild(tabela);
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
});










// Menu lateral
document.addEventListener("DOMContentLoaded", function() {
    // Adiciona evento de clique para os botões do dropdown
    var dropdownButtons = document.querySelectorAll(".dropdown-btn");
    dropdownButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            // Alterna a visibilidade do conteúdo do dropdown
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    });

    // Adiciona evento de clique para os itens do dropdown
    var dropdownItems = document.querySelectorAll(".dropdown-container a");
    dropdownItems.forEach(function(item) {
        item.addEventListener("click", function(event) {
            event.preventDefault(); // Previne o comportamento padrão do link 
        });
    });

    
});