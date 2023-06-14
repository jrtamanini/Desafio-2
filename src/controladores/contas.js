const bancodedados = require('../bancodedados');
const { banco, contas, saques, depositos, transferencias } = require('../bancodedados');




const listarContas = (req, res) => {
    const { senha_banco } = req.query;
    if (senha_banco) {
        if (senha_banco === banco.senha) {
            return res.status(200).json({ contas });
        };
        if (senha_banco !== banco.senha) {
            return res.status(401).json({ mensagem: 'Senha inválida' });
        };
    };

};

const criarNovaConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O campo cpf é obrigatório' })
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'O campo data de nascimento é obrigatório' })
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O campo telefone é obrigatório' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório' })
    }

    let cpfExistente = bancodedados.contas.find((dados) => {
        return dados.usuario.cpf === cpf;
    });
    if (cpfExistente) {
        return res.status(400).json({ mensagem: 'CPF já esta cadastrado' })
    }

    let emailExistente = bancodedados.contas.find((dados) => {
        return dados.usuario.email === email;
    });
    if (emailExistente) {
        return res.status(400).json({ mensagem: 'Email já esta cadastrado' })
    }
    let numeroDeConta = (bancodedados.contas.length + 1).toString();
    let novaConta = {
        numero: numeroDeConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };
    bancodedados.contas.push(novaConta);

    return res.status(201).json(novaConta);
};

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;


    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Informe o campo que deseja atualizar' });
    }
    const numeroDeConta = Number(req.params.numeroDeConta);
    const dadosDaConta = contas.findIndex((dados) => {
        dados.numero === numeroDeConta;
    });

    if (nome) {
        contas[dadosDaConta].usuario.nome = nome
    };
    if (cpf) {
        contas[dadosDaConta].usuario.cpf = cpf
    };
    if (data_nascimento) {
        contas[dadosDaConta].usuario.data_nascimento = data_nascimento
    };
    if (telefone) {
        contas[dadosDaConta].usuario.telefone = telefone
    };
    if (email) {
        contas[dadosDaConta].usuario.email = email
    };
    if (senha) {
        contas[dadosDaConta].usuario.senha = senha
    };

    return res.status(200).json({ mensagem: 'A conta foi atualizada com sucesso' });

};

const exluirConta = (req, res) => {
    const numeroDeConta = Number(req.params.numeroDeConta);
    const dadosDaConta = contas.findIndex((dados) => {
        dados.numero === numeroDeConta;
    });
    if (contas[dadosDaConta].saldo > 0) {
        return res.status(400).json({ mensagem: 'Não é possivel excluir conta com saldo' });
    } else {
        contas.splice(dadosDaConta, 1);
        return res.status(200).json({ mensagem: 'Conta excluida com sucesso' })
    }


};

const saldoDaConta = (req, res) => {
    const { numero_conta } = req.query;

    const dadosDaConta = contas.findIndex((dados) => {
        dados.numero == numero_conta;
        return res.status(200).json({ saldo: contas[dadosDaConta].saldo });
    });
};

const extratoDaConta = (req, res) => {
    const { numero_conta } = req.query;

    const dadosDoExtrato = {
        depositos: [],
        saques: [],
        transfEnviadas: [],
        transfRecebidas: []
    };

    for (let deposito of depositos) {
        if (deposito.numero_conta == numero_conta) {
            dadosDoExtrato({ depositos }).push(deposito);
        };
    };

    for (let saque of saques) {
        if (saque.numero_conta == numero_conta) {
            dadosDoExtrato({ saques }).push(saque);
        };
    };

    for (let transferencia of transferencias) {
        if (transferencia.numero_conta_origem == numero_conta) {
            dadosDoExtrato({ transfEnviadas }).push(transferencia);
        };
    };

    for (let transferencia of transferencias) {
        if (transferencia.numero_conta_destino == numero_conta) {
            dadosDoExtrato({ transfEnviadas }).push(transferencia);
        };
    };
    return res.status(200).json({
        depositos: depositos,
        saques: saques,
        transfEnviadas,
        transfRecebidas
    });


};





module.exports = {
    listarContas,
    criarNovaConta,
    atualizarConta,
    exluirConta,
    saldoDaConta,
    extratoDaConta

};