const bancodedados = require('../bancodedados');
const { banco, contas, saques, depositos, transferencias } = require('../bancodedados');


const depositar = (req, res) => {

    const { numero_conta, valor } = req.body;

    if (!numero_conta && !valor) {
        return res.status(400).json({ mensagem: 'Informe o numero da conta e valor do depósito' });
    };


    const dadosDaConta = contas.findIndex((dados) => {
        dados.numero == numero_conta;

        if (dadosDaConta < 0) {
            return res.status(404).json({ mensagem: 'Conta nao existe' });
        }
        if (Number(valor) <= 0) {
            return res.status(400).json({ mensagem: 'Informe um valor válido' });
        }

        if (dadosDaConta > 0) {
            contas[dadosDaConta].saldo += Number(valor);
            depositar.push({
                data: Date(),
                numero_conta: String(numero_conta),
                valor
            });

            return res.status(200).json({ mensagem: 'Depósito realizado com sucesso' });
        }
    });

};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if (numero_conta && valor, senha) {
        let procurarConta = contas.findIndex((dados) => {
            return dados.numero === Number(numero_conta);
        });

        if (valor <= contas[procurarConta].saldo) {
            contas[procurarConta].saldo -= valor;
            saques.push({
                data: Date(),
                numero_conta: numero_conta,
                valor
            });
        };
        return res.status(200).json({ mensagem: 'Saque realizado com sucesso' });
    };
    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Numero da conta invalido' })
    };
    if (!valor || valor <= 0) {
        return res.status(400).json({ mensagem: 'valor invalido' })
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'senha invalida' })

    };
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    if (!numero_conta_destino && !numero_conta_origem && !valor && !senha) {
        return res.status(400).json({ mensagem: 'dados invalidos' })
    };

    const dadosContaOrigem = contas.findIndex((dados) => {
        dados.numero === numero_conta_origem;
    });
    if (dadosContaOrigem < 0) {
        return res.status(404).json({ mensagem: 'conta não encontrada' });
    };

    const dadosContaDestino = contas.findIndex((dados) => {
        dados.numero === numero_conta_destino;
    });
    if (dadosContaDestino < 0) {
        return res.status(404).json({ mensagem: 'conta não encontrada' });
    };




    if (senha != contas[dadosContaOrigem].usuario.senha) {
        return res.status(400).json({ mensgem: 'senha incorreta' });
    };

    if (contas[dadosContaOrigem].sado <= 0) {
        return res.status(400).json({ mensagem: 'Não há saldo' });
    };
    contas[dadosContaOrigem].saldo -= Number(valor);
    contas[dadosContaDestino].saldo += Number(valor);
    transferencias.push({
        data: Date(),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor
    });


    return res.status(200).json({ mensagem: "transferencia realizada com sucesso" });
};






module.exports = {
    depositar,
    sacar,
    transferir
};