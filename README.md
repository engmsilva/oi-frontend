Oi - Avaliação FullStack (Frontend).

O sistema consiste em uma web app para realizar busca e CRUD de telefones.

Os seguintes desafios foram propostos:

* Usar React JS;
* Consumir dados de uma API;
* Página de busca de cadastro
* Página de listagem de cadastrados;
* Página para criar e editar cadastro;
* Excluir cadastro.

Requisitos:
- git 2.29.2
- node v12.16.1
- yarn 1.22.5

### Para executar o aplicativo localmente:

```bash
$ git clone https://github.com/engmsilva/oi-frontend.git
$ cd oi-frontend
$ yarn install
```

Execute o comando abaixo dentro do diretório do projeto:

```bash
$ yarn start
$ open http://localhost:3000
```

### Para executar a versão minificada do aplicativo localmente:

Instalação do servidor Node

```bash
$ yarn global add serve
```
Exportar caminho de instalação do servidor para variável de ambiente do sistema operacional.

```bash
$ export PATH="$PATH:$(yarn global bin)" // exemplo usado no Ubuntu
```
Execute o servidor

```bash
$ serve -s build
$ open http://localhost:3001
```