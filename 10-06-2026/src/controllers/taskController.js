const taskService = require('../services/taskService');

const path = require('path');
const fs = require('fs/promises');

const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('JSON inválido'));
      }
    });

    req.on('error', reject);
  });
};

const alunosFile = path.join(__dirname, '../../Alunos.json');

const alunos = async (req, res) => {
  const caminho = path.join(__dirname, '../../Alunos.json');
  const conteudo = await fs.readFile(caminho, 'utf-8');
  res.end(conteudo);
};


const sobre = async (req, res) => {
  res.end(JSON.stringify({mensagem:'Meu nome é Murilo Boer Ribeiro Santos'}));
};

const status = async (req, res) => {
  res.end(JSON.stringify({mensagem:'Servidor ativo'}));
};

const alunosid = async (req, res, id) => {
  const alunos = JSON.parse(await fs.readFile(alunosFile, 'utf8'));

  const aluno = alunos.find(a => a.id == id);

  if (!aluno) {
    res.statusCode = 404;

    return res.end(JSON.stringify({
      message: 'Não encontrado'
    }));
  }

  res.statusCode = 200;

  return res.end(JSON.stringify(aluno));
};


const produtos = async (req, res, categoria) => {
  const caminho = path.join(__dirname, '../../produtos.json');

  const conteudo = await fs.readFile(caminho, 'utf-8');
  const listaProdutos = JSON.parse(conteudo);

  const encontrados = listaProdutos.filter(
    produto => produto.categoria.toLowerCase() === categoria.toLowerCase()
  );

  res.statusCode = 200;

  if (encontrados.length > 0) {
    return res.end(JSON.stringify(encontrados));
  }

  return res.end(JSON.stringify(listaProdutos));
};

const alunosAtlz = async (req, res, id) => {
  try {
    const body = await getRequestBody(req);

    const aluno = taskService.atualizarAluno(id, body.nome, body.turma, body.curso
    );

    res.statusCode = 200;
    res.end(JSON.stringify(aluno));

  } catch (error) {

    if (error.message === 'Aluno não encontrado') {
      res.statusCode = 404;
    } else {
      res.statusCode = 400;
    }

    res.end(JSON.stringify({
      message: error.message
    }));
  }
};

const deleteAluno = async (req, res, id) => {
    try {
    const body = await getRequestBody(req);

    const aluno = taskService.deleteAluno(id, body.nome, body.turma, body.curso
    );

    res.statusCode = 200;
    res.end(JSON.stringify(aluno));

  } catch (error) {

    if (error.message === 'Aluno não encontrado') {
      res.statusCode = 404;
    } else {
      res.statusCode = 400;
    }

    res.end(JSON.stringify({
      message: error.message
    }));
  }
};

const createAluno = async (req, res) => {
  try {
  const body = await getRequestBody(req);

  const aluno = taskService.addAluno(body.nome, body.turma, body.curso);

  res.statusCode = 201;
  res.end(JSON.stringify(aluno));
} catch (error) {
  res.statusCode = 400;
  res.end(JSON.stringify({ message: error.message }));
}
};

module.exports = {
  createAluno,
  alunos,
  alunosid,
  alunosAtlz,
  produtos,
  sobre,
  status,
  deleteAluno
};