const express = require('express');
const { listarContas, criarNovaConta, atualizarConta, exluirConta, saldoDaConta, extratoDaConta } = require('./controladores/contas');
const { depositar, sacar, transferir } = require('./controladores/transacoes');


const rotas = express();





rotas.get('/contas', listarContas);
rotas.post('/contas', criarNovaConta);
rotas.put('/contas/:numeroDeConta', atualizarConta);
rotas.delete('/contas/:numeroDeConta', exluirConta);
rotas.get('/contas/saldo', saldoDaConta);
rotas.get('/contas/extrato', extratoDaConta);

rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);




module.exports = rotas;