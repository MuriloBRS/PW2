const taskController = require('../controllers/taskController');
const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {

  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const method = req.method;

  try {

    // Home
    if (pathname === '/' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ mensagem: 'Home' }));
    }

    // Listar alunos
    if (pathname === '/alunos' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return taskController.alunos(req, res);
    }

    // Criar aluno
    if (pathname === '/alunos' && method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      return taskController.createAluno(req, res);
    }

    // Sobre
    if (pathname === '/sobre' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return taskController.sobre(req, res);
    }

    // Status
    if (pathname === '/status' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return taskController.status(req, res);
    }

    // Buscar aluno por ID
    if (pathname.startsWith('/alunos/') && method === 'GET') {
      const id = pathname.split('/')[2];
      res.setHeader('Content-Type', 'application/json');
      return taskController.alunosid(req, res, id);
    }

    // Atualizar aluno
    if (pathname.startsWith('/alunos/') && method === 'PUT') {
      const id = pathname.split('/')[2];
      res.setHeader('Content-Type', 'application/json');
      return taskController.alunosAtlz(req, res, id);
    }

    // Deletar aluno
    if (pathname.startsWith('/alunos/') && method === 'DELETE') {
      const id = pathname.split('/')[2];
      res.setHeader('Content-Type', 'application/json');
      return taskController.deleteAluno(req, res, id);
    }

    // Produtos por categoria
    if (pathname === '/produtos' && method === 'GET') {
      const categoria = url.searchParams.get('categoria');
      res.setHeader('Content-Type', 'application/json');
      return taskController.produtos(req, res, categoria);
    }

    if (pathname === '/pagina' && method === 'GET') {
      const page = await fs.readFile(path.join(__dirname, '../public/pagina.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.end(page);
    }

    if (pathname === '/api/status' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ status: 'Api funcionando.' }));
    }

    // Verificação de métodos permitidos

    if (pathname === '/alunos' && !['GET', 'POST'].includes(method)) {
      res.statusCode = 405;
      return res.end(JSON.stringify({message: 'Método não permitido. 405'}));
    }

    if (pathname === '/sobre' && method !== 'GET') {
      res.statusCode = 405;
      return res.end(JSON.stringify({message: 'Método não permitido. 405'}));
    }

    if (pathname === '/status' && method !== 'GET') {
      res.statusCode = 405;
      return res.end(JSON.stringify({message: 'Método não permitido. 405'}));
    }

    if (pathname === '/produtos' && method !== 'GET') {
      res.statusCode = 405;
      return res.end(JSON.stringify({message: 'Método não permitido. 405'}));
    }

    if (pathname.startsWith('/alunos/') &&
        !['GET', 'PUT', 'DELETE'].includes(method)) {
      res.statusCode = 405;
      return res.end(JSON.stringify({message: 'Método não permitido. 405'}));
    }

    res.statusCode = 404;
    
    res.setHeader('Content-Type', 'application/json');

    return res.end(JSON.stringify({ message: 'Rota não encontrada. 404' }));

    }catch (erro) {

      console.error(erro);

      res.statusCode = 500;

      return res.end(JSON.stringify({
        message: 'Erro interno do servidor'
      }));
  }
};